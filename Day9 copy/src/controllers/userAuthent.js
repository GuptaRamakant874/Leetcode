const redisClient = require('../config/redis');
const User = require('../models/user');
const validate = require('../utils/validator')
const bcrypt = require('bcrypt');
const  jwt  = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { sendPasswordResetEmail } = require('../utils/sendEmail');
// import Submission from '../models/submission';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const buildUserResponse = (user) => ({
    _id: user._id,
    firstName: user.firstName,
    emailId: user.emailID,
    role: user.role,
});

const normalizeGoogleFirstName = (value) => {
    const fallback = 'GoogleUser';
    const trimmedValue = String(value || fallback).trim();

    if (trimmedValue.length < 3) {
        return fallback;
    }

    return trimmedValue.slice(0, 20);
};

const createAuthCookieAndResponse = (res, user) => {
    const token = jwt.sign(
        { _id: user._id, emailID: user.emailID, role: user.role },
        process.env.JWT_KEY,
        { expiresIn: 60 * 60 }
    );

    res.cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Logged In Successfully",
        user: buildUserResponse(user),
    });
};

const register = async (req,res)=>{
    try{
        if (req.body.emailId && !req.body.emailID) {
            req.body.emailID = req.body.emailId;
        }

        // validate the data;
        validate(req.body);

        const {emailID,password} = req.body;

        // Hashcode
        req.body.password = await bcrypt.hash(password,10);
        req.body.role = "user";

        const user = await User.create(req.body);


        // token
        const token = jwt.sign({_id:user._id, emailID:emailID, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie("token",token,{
            maxAge: 60*60*1000,
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.status(201).json({
            message: "User Registered Successfully",
            user: buildUserResponse(user),
        });
        
    }catch(err){
        res.status(400).json({
            message: err.message,
        });
    }
}


const login = async (req,res)=>{

    try{

        const emailID = req.body.emailID || req.body.emailId;
        const {password} = req.body;

        if(!emailID){
            throw new Error("Email Invalid Credentials.");
        }
        if(!password){
            throw new Error("Password Invalid Credentials.");
        }
        // find in DB
        const user = await User.findOne({emailID});
        if(!user){
            throw new Error("Invalid Credentials");
        }
                            //   (password send by user, DB password) 
        const match =await bcrypt.compare(password,user.password);
        if(!match){
            throw new Error("Invalid Credentials");
        }

        return createAuthCookieAndResponse(res, user);


    }catch(err){
        res.status(401).json({
            message: err.message,
        });
    }
}

const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required",
            });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({
                message: "GOOGLE_CLIENT_ID is not configured on the server",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload?.email || !payload?.sub) {
            return res.status(400).json({
                message: "Invalid Google account data",
            });
        }

        if (payload.email_verified === false) {
            return res.status(400).json({
                message: "Google email is not verified",
            });
        }

        let user = await User.findOne({ emailID: payload.email.toLowerCase() });

        if (!user) {
            const randomPassword = crypto.randomBytes(24).toString('hex');
            user = await User.create({
                firstName: normalizeGoogleFirstName(payload.given_name || payload.name?.split(' ')[0]),
                emailID: payload.email.toLowerCase(),
                password: await bcrypt.hash(randomPassword, 10),
                role: 'user',
                googleId: payload.sub,
                authProvider: 'google',
            });
        } else {
            let shouldSave = false;

            if (!user.googleId) {
                user.googleId = payload.sub;
                shouldSave = true;
            }

            if (user.authProvider !== 'google') {
                user.authProvider = 'google';
                shouldSave = true;
            }

            if (!user.firstName && (payload.given_name || payload.name)) {
                user.firstName = normalizeGoogleFirstName(payload.given_name || payload.name.split(' ')[0]);
                shouldSave = true;
            }

            if (shouldSave) {
                await user.save();
            }
        }

        return createAuthCookieAndResponse(res, user);
    } catch (err) {
        return res.status(401).json({
            message: err.message || "Google authentication failed",
        });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const emailID = req.body.emailID || req.body.emailId;

        if (!emailID) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const normalizedEmail = String(emailID).trim().toLowerCase();
        const user = await User.findOne({ emailID: normalizedEmail });

        if (!user) {
            return res.status(200).json({
                message: "If an account exists with this email, a reset link has been generated.",
            });
        }

        const rawResetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
        const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${rawResetToken}`;

        user.resetPasswordToken = hashedResetToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        await sendPasswordResetEmail({
            toEmail: user.emailID,
            firstName: user.firstName,
            resetUrl,
        });

        return res.status(200).json({
            message: "Password reset link has been sent to your email.",
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Unable to process forgot password request",
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Reset token is required",
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password is required",
            });
        }

        if (String(password).length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long",
            });
        }

        const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedResetToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Reset link is invalid or has expired",
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully. Please login with your new password.",
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Unable to reset password",
        });
    }
}

// logout feature

const logout = async (req,res)=>{

    try{
        
        // validate the token

        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not present");
        }
        // then Token ko add kar dunga redis ke blockList me

        const payload = jwt.decode(token);

        if (redisClient.isReady) {
            await redisClient.set(`token:${token}`,'blocked');
            await redisClient.expireAt(`token:${token}`,payload.exp);
        }
        // Cookies ko clear kar dena.....

        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send("logout Successfully");



    }catch(err){
        res.status(503).send("Error: "+err);
    }
}


const adminRegister = async (req,res)=>{
    try{
        // validate the data;
        validate(req.body);

        const {emailID,password} = req.body;

        // Hashcode
        req.body.password = await bcrypt.hash(password,10);
        req.body.role = "admin";

        const user = await User.create(req.body);


        // token
        const token = jwt.sign({_id:user._id, emailID:emailID, role:'admin'},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie("token",token,{
            maxAge: 60*60*1000,
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.status(201).json({
            message: "User Registered Successfully",
            user: buildUserResponse(user),
        });
        
    }catch(err){
        res.status(400).json({
            message: err.message,
        });
    }
} 


const getProfile = async (req,res)=>{

    try{
        
    }catch(err){

    }
}

const getAllUsersForAdmin = async (req, res) => {
    try {
        const users = await User.find({}, {
            password: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            __v: 0,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            users,
            count: users.length,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Unable to fetch users",
        });
    }
}

const adminDeleteUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                message: "User id is required",
            });
        }

        if (String(req.result._id) === String(userId)) {
            return res.status(400).json({
                message: "Admin cannot delete own profile from this panel",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                message: "Admin profiles cannot be deleted from this panel",
            });
        }

        await User.findOneAndDelete({ _id: userId });

        return res.status(200).json({
            message: "User profile deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Unable to delete user profile",
        });
    }
}

const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
        await User.findOneAndDelete({ _id: userId });
        
        res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}



module.exports = {register,login,logout,getProfile,adminRegister,deleteProfile,forgotPassword,resetPassword,googleAuth,getAllUsersForAdmin,adminDeleteUserProfile};
