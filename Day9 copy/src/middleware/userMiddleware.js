const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");


const userMiddleware = async (req,res,next)=>{

    try{
        const {token} = req.cookies;
        console.log(token);
        if(!token){
            // console.log("token is not there");
            throw new Error("Token is not present");
        }

        // Check the token for validity
        const payload = jwt.verify(token,process.env.JWT_KEY);
        const {_id} = payload;
        if(!_id){
            throw new Error("invalid token");
        }

        const result = await User.findById(_id);
        if(!result){
            throw new Error("User Doesn't Exist");
        }

        // Redis ke blockList me present toh nahi hai
        const IsBlocked = redisClient.isReady
            ? await redisClient.exists(`token:${token}`)
            : 0;

        if(IsBlocked){
            throw new Error("invalid token");
        }
        req.result = result;


        next();


    }catch(err){
        res.status(401).send("Error: "+err.message);
    }
}



module.exports = userMiddleware;
