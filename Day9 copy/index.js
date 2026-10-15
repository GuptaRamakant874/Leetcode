const express = require('express');
const app = express();
require('dotenv').config();
const main = require("./src/config/db");
const cookieParser = require("cookie-parser");
const authRouter = require('./src/routes/userAuth');
const redisClient = require('./src/config/redis');
const problemRouter = require('./src/routes/problemCreator');
const submitRouter = require('./src/routes/submit');
// const Submission = require('./src/models/submission');
const aiRouter = require('./src/routes/aiChatting')
const cors = require('cors');
const videoRouter = require('./src/routes/videoCreator');


const allowedOrigins = ["http://localhost:5173", "http://localhost:5174" , "leetcode-frontend-eta.vercel.app"];

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}))


app.use(express.json());
app.use(cookieParser());

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);


const InitializeConnection = async ()=>{


    try{
        await main();
        console.log("DB connected");

        try {
            await redisClient.connect();
            console.log("Redis connected");
        } catch (err) {
            console.log("Redis unavailable, continuing without cache: " + err.message);
        }

        app.listen(process.env.PORT, ()=>{
            console.log("Server Listening at port number "+process.env.PORT);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}

InitializeConnection();


// main()
// .then(async ()=>{
//     app.listen(process.env.PORT, ()=>{
//         console.log("Server Listening at port number "+process.env.PORT);
//     })
// })
// .catch(err=> console.log("Error Occurred: "+err));



