const runSubmission = require("../utils/ProblemUtility")
const Problem = require("../models/problem")
const User=require("../models/user")
const express=require('express')
const Submission=require("../models/submission")
//import express from "express";
const SolutionVideo = require("../models/solutionVideo");


 const app=express()

const shouldBlockOnJudgeError = process.env.BLOCK_CREATE_ON_JUDGE_ERROR === "true";

const validateReferenceSolutions = async (referenceSolution = [], visibleTestCases = []) => {
    for (const { language, completeCode } of referenceSolution) {
        for (const testcase of visibleTestCases) {
            const result = await runSubmission({
                language,
                source_code: completeCode,
                stdin: testcase.input,
                expected_output: testcase.output
            });

            const statusId = result.status.id;

            if (statusId === 4) {
                throw new Error("Wrong Answer");
            }
            if (statusId === 6) {
                throw new Error("Compilation Error");
            }
            if (statusId >= 7) {
                throw new Error("Runtime Error");
            }
        }
    }
};

const normalizeProblemPayload = (payload = {}) => {
    const normalizedTags = Array.isArray(payload.tags) ? payload.tags : (payload.tags ? [payload.tags] : undefined);

    const normalizeLanguage = (language = "") => {
        const value = String(language).trim().toLowerCase();
        if (value === "cpp") return "c++";
        if (value === "js") return "javascript";
        return value;
    };

    const normalizedStartCode = Array.isArray(payload.startCode)
        ? payload.startCode.map((item) => ({
            ...item,
            language: normalizeLanguage(item?.language)
        }))
        : payload.startCode;

    const normalizedReferenceSolution = Array.isArray(payload.referenceSolution)
        ? payload.referenceSolution.map((item) => ({
            ...item,
            language: normalizeLanguage(item?.language)
        }))
        : payload.referenceSolution;

    return {
        ...payload,
        ...(normalizedTags ? { tags: normalizedTags } : {}),
        ...(normalizedStartCode ? { startCode: normalizedStartCode } : {}),
        ...(normalizedReferenceSolution ? { referenceSolution: normalizedReferenceSolution } : {})
    };
};

const createProblem = async (req, res) => {

    console.log('userproblem file reach kar raha hai')
    const { title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases, startCode, referenceSolution,
        problemCreator } = req.body;
    console.log('After title')
    try {
        try {
            await validateReferenceSolutions(referenceSolution, visibleTestCases);
        } catch (validationError) {
            const message = String(validationError.message || validationError);
            const isJudgeInfraError = message.toLowerCase().includes("judge0 request failed") ||
                message.toLowerCase().includes("timeout") ||
                message.toLowerCase().includes("network") ||
                message.toLowerCase().includes("socket") ||
                message.toLowerCase().includes("econn") ||
                message.toLowerCase().includes("invalid response from judge0");

            if (!isJudgeInfraError || shouldBlockOnJudgeError) {
                return res.status(400).send(message);
            }

            console.error("Judge0 unavailable during createProblem, continuing save:", message);
        }
        console.log("userproble file create problemm function reach kar raha hai")

        const userProblem = await Problem.create({
            ...normalizeProblemPayload(req.body),
            problemCreator: req.result._id //storing, admin id , who is created
        })

        res.send('problem saved successfully, userPoblem file');
    }
    catch (err) {
        res.status(400).send('error from userProblem file ' + err)
    }
}

const updateProblem = async (req, res) => {
    //finding id , which problem admin want to update

    //    console.log("reach in update  Problem")
       app.use(express.json()); 
    const { title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases, startCode, referenceSolution,
        problemCreator } = req.body;

    const { id } = req.params
     

    try {
        if (!id) {
            return res.status(400).send("missing id, userProblem file, updateProblem file")
        }
        const DsaProblem = await Problem.findById(id);
        if (!DsaProblem) {
            return res.status(404).send("Id is not prensent in server (mongdb) , userProblem file, updateProblem file")
        }


        //         for (const { language, completeCode } of referenceSolution) {

        //         for (const testcase of visibleTestCases) {

        //         const result = await runSubmission({
        //             language: language,   // 👈 pass directly
        //             source_code: completeCode,
        //             stdin: testcase.input,
        //             expected_output: testcase.output
        //         });

        //         const statusId = result.status.id;

        //         // if (statusId === 4) return res.status(400).send("Wrong Answer");
        //         // if (statusId === 6) return res.status(400).send("Compilation Error");
        //         // if (statusId >= 7) return res.status(400).send("Runtime Error");

        //         if (statusId === 3) continue; // Accepted
        // if (statusId === 4) throw new Error("Wrong Answer");
        // if (statusId === 5) throw new Error("Time Limit Exceeded");
        // if (statusId === 6) throw new Error("Compilation Error");
        // if (statusId >= 7) throw new Error("Runtime Error");

        //     }
        // }



        if (referenceSolution && visibleTestCases) {
            try {
                await validateReferenceSolutions(referenceSolution, visibleTestCases);
            } catch (validationError) {
                const message = String(validationError.message || validationError);
                const isJudgeInfraError = message.toLowerCase().includes("judge0 request failed") ||
                    message.toLowerCase().includes("timeout") ||
                    message.toLowerCase().includes("network") ||
                    message.toLowerCase().includes("socket") ||
                    message.toLowerCase().includes("econn") ||
                    message.toLowerCase().includes("invalid response from judge0");

                if (!isJudgeInfraError || shouldBlockOnJudgeError) {
                    throw validationError;
                }

                console.error("Judge0 unavailable during updateProblem, continuing update:", message);
            }
        }

        //timelint lec 6   19.00
        const normalizedPayload = normalizeProblemPayload(req.body);
        const newProblem = await Problem.findByIdAndUpdate(id, normalizedPayload, { runValidators: true, new: true }) //new:true:, means return updated walt, runvalidator->check the schema is right or not (required fiele)
        res.status(200).send(newProblem);

    }
    catch (err) {
        res.status(500).send("error from userProbmlem file , update Problem function," + err)
    }
}




const deleteProblem= async(req, res)=>{
    const {id}= req.params;

    try{
        if(!id)
            return res.status(400).send("id is missing , userProblemfile, deleteProblem function");

      const deleteproblem= await Problem.findByIdAndDelete(id); //of id is not present, then deleteProblm contain null
    if(!deleteproblem){
        return res.status(404).send("The problem which you want is not present in  db , may be id incorrect (userProblm fiel, deleteProblme function)");
    }

    res.status(200).send("deleted Successfully (userProblm file, deleteProblmem function)");
    
    }

    catch(err)
    {
        res.status(500).send("error from (userProblm file, deleteProblmem function)" + err)
    }

}

const getProblemById = async(req, res)=>{
    const {id}= req.params;

    try{
        if(!id)
            return res.status(400).send("id is missing , userProblemfile, getProblemId");
        //send only those thing are required
       const getProblem= await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');
        // const getProblem= await Problem.findById(id).select('-hiddenTestCases -difficulty');
     
    if(!getProblem){
        return res.status(404).send("The problem which you want is not present in  db , may be id incorrect (userProblm file, getProblemBy function)");
    }

    // const video = await SolutionVideo.findOne({ problemId: id })
    //     .select('secureUrl cloudinaryPublicId thumbnailUrl duration');

    // const responsePayload = getProblem.toObject();

    // if (video) {
    //     responsePayload.video = {
    //         secureUrl: video.secureUrl,
    //         cloudinaryPublicId: video.cloudinaryPublicId,
    //         thumbnailUrl: video.thumbnailUrl,
    //         duration: video.duration
    //     };
    // }
    const videos = await SolutionVideo.findOne({ problemId: id })

    if(videos){
        const responseData = {
            ...getProblem.toObject(),
            secureUrl: videos.secureUrl,
            thumbnailUrl: videos.thumbnailUrl,
            duration: videos.duration
        }
        // getProblem.secureUrl = videos.secureUrl;
        // // getProblem.cloudinaryPublicId = videos.cloudinaryPublicId;
        // getProblem.thumbnailUrl = videos.thumbnailUrl;
        // getProblem.duration = videos.duration;

        return res.status(200).send(responseData);
    }
    
    
    res.status(200).send(getProblem);
    
    }

    catch(err)
    {
        res.status(500).send("error from (userProblm file, getProblembyId function)" + err)
    }

}

const getAllProblem =async(req, res)=>{
    
    try{
        const problem= await Problem.find({}).select('_id title description tags difficulty');
     
    if(problem.length===0){
        return res.status(404).send("There is no prblem in db");
    }

    res.status(200).send(problem);
    
    }

    catch(err)
    {
        res.status(500).send("error from (userProblm file, getAllProblem function)" + err)
    }

}

const getProblemForAdminEdit = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).send("id is missing , userProblemfile, getProblemForAdminEdit");
        }

        const problem = await Problem.findById(id).select("_id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution");

        if (!problem) {
            return res.status(404).send("The problem is not present in db, getProblemForAdminEdit");
        }

        return res.status(200).send(problem);
    } catch (err) {
        return res.status(500).send("error from getProblemForAdminEdit function " + err);
    }
}


const solvedAllProblemByUser = async(req, res)=>{

    try{
        //req.result contail user info, from middleware
        // const count= req.result.problemSolved.length;
        // res.status(200).send(count); //tell how mnay problem solved by user
        console.log("reach")
        const userId=req.result._id;
        // const user = await User.findById(userId); //give problemSolved contain only problemid
       // const user = await User.findById(userId).populate('problemSolved')
        const user = await User.findById(userId).populate({
            path:"problemSolved", //problem solved kisko refer kar raha hai(submissionSchem)
            select:"_id title difficulty tags"
        })

        console.log("reached")
        res.status(200).send(user.problemSolved)

    }
    catch(err){

    }
}

const submittedProblem = async(req, res)=>{
    try{
        const userId=req.result._id;;
        const problemId =req.params.pid;

       const ans= await Submission.find({userId, problemId});
        if(ans.length==0)
        {
            return res.status(200).send([]);
        }

       return res.status(200).send(ans);

    }

    catch(err)
    {
         res.status(500).send("Error ,userProblm file, submittedProbelm function "+err);
    }
}

const getUserProfileStats = async (req, res) => {
    try {
        const userId = req.result._id;

        const [totalSubmissions, activeDaysResult] = await Promise.all([
            Submission.countDocuments({ userId }),
            Submission.aggregate([
                { $match: { userId } },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        }
                    }
                },
                { $count: "totalActiveDays" }
            ])
        ]);

        return res.status(200).send({
            totalSubmissions,
            totalActiveDays: activeDaysResult[0]?.totalActiveDays || 0
        });
    }
    catch (err) {
        return res.status(500).send("Error ,userProblem file, getUserProfileStats function " + err);
    }
}


module.exports = { createProblem, updateProblem ,deleteProblem, getProblemById, getAllProblem, solvedAllProblemByUser, submittedProblem, getProblemForAdminEdit, getUserProfileStats}







//        for (const { language, completeCode } of referenceSolution) {

//     const languageId = await getLanguageById(language);

//     for (const testcase of visibleTestCases) {

//         const result = await runSubmission({
//             language_id: languageId,
//             source_code: completeCode,
//             stdin: testcase.input,
//             expected_output: testcase.output
//         });

//         const statusId = result.status.id;

//       if (statusId === 4) return res.status(400).send(" from userProblme Wrong Answer");
// if (statusId === 5) return res.status(400).send(" user proble m file Time Limit Exceeded");
// if (statusId === 6) return res.status(400).send(" user proble m fileCompilation Error");
// if (statusId >= 7) return res.status(400).send(" user proble m fileRuntime Error");
//     }
// }
