const express = require('express');
const {register,login,logout,getProfile,adminRegister,deleteProfile,forgotPassword,resetPassword,googleAuth,getAllUsersForAdmin,adminDeleteUserProfile} = require('../controllers/userAuthent');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const authRouter = express.Router();


// Register
authRouter.post('/register',register)
authRouter.post('/login', login);
authRouter.post('/google', googleAuth);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware,adminRegister);
authRouter.get('/admin/users',adminMiddleware,getAllUsersForAdmin);
authRouter.delete('/admin/users/:userId',adminMiddleware,adminDeleteUserProfile);
authRouter.get('/getProfile',getProfile);
authRouter.delete('/deleteprofile',userMiddleware,deleteProfile);
authRouter.get('/check',userMiddleware,(req,res)=>{

    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailID,
        _id:req.result._id,
        role:req.result.role,
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})

// login

// logout
// GetProfile

module.exports = authRouter;
