const Problem = require("../models/problem");
const Submission = require("../models/submission");
const runSubmission = require("../utils/ProblemUtility");

const normalizeSubmissionLanguage = (language = "") => {
    const normalized = String(language).trim().toLowerCase();

    if (normalized === "cpp" || normalized === "c++") return "c++";
    if (normalized === "java") return "java";
    if (normalized === "javascript" || normalized === "js") return "javascript";

    return normalized;
};

const getRuntimeInSeconds = (result = {}) => {
    const timeValue = Number(result?.time);
    return Number.isFinite(timeValue) ? timeValue : 0;
};

const getMemoryInKb = (result = {}) => {
    const memoryValue = Number(result?.memory);
    return Number.isFinite(memoryValue) ? memoryValue : 0;
};

const getErrorMessage = (result = {}) =>
    result?.stderr || result?.compile_output || result?.message || "Execution failed";

const runAgainstTestCases = async ({ code, language, testCases = [] }) => {
    const results = [];

    for (const testcase of testCases) {
        const executionResult = await runSubmission({
            language,
            source_code: code,
            stdin: testcase.input,
            expected_output: testcase.output
        });

        results.push({
            stdin: testcase.input,
            expected_output: testcase.output,
            stdout: executionResult.stdout || "",
            stderr: executionResult.stderr || "",
            compile_output: executionResult.compile_output || "",
            message: executionResult.message || "",
            status_id: executionResult.status.id,
            time: getRuntimeInSeconds(executionResult),
            memory: getMemoryInKb(executionResult)
        });
    }

    return results;
};

const runCode = async (req, res) => {
    try {
        const userId = req.result?._id;
        const problemId = req.params.id;
        const { code, language } = req.body;

        if (!userId || !problemId || !code || !language) {
            return res.status(400).send("Some Field Missing");
        }

        const problem = await Problem.findById(problemId).select("visibleTestCases");
        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        const normalizedLanguage = normalizeSubmissionLanguage(language);
        const testCases = await runAgainstTestCases({
            code,
            language: normalizedLanguage,
            testCases: problem.visibleTestCases || []
        });

        const success = testCases.every((testcase) => testcase.status_id === 3);
        const firstFailedCase = testCases.find((testcase) => testcase.status_id !== 3);

        return res.status(200).send({
            success,
            testCases,
            runtime: testCases[0]?.time || 0,
            memory: testCases[0]?.memory || 0,
            error: success ? null : getErrorMessage(firstFailedCase)
        });
    } catch (err) {
        console.error("runCode error:", err);
        return res.status(500).send({
            success: false,
            error: err.message || "Internal server error"
        });
    }
};

const submitCode = async (req, res) => {
    try {
        const userId = req.result?._id;
        const problemId = req.params.id;
        const { code, language } = req.body;

        if (!userId || !problemId || !code || !language) {
            return res.status(400).send("Some Field Missing");
        }

        const problem = await Problem.findById(problemId).select("hiddenTestCases");
        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        const normalizedLanguage = normalizeSubmissionLanguage(language);
        const hiddenTestCases = problem.hiddenTestCases || [];
        const testCaseResults = await runAgainstTestCases({
            code,
            language: normalizedLanguage,
            testCases: hiddenTestCases
        });

        const passedTestCases = testCaseResults.filter((testcase) => testcase.status_id === 3).length;
        const totalTestCases = testCaseResults.length;
        const accepted = totalTestCases > 0 && passedTestCases === totalTestCases;
        const firstFailedCase = testCaseResults.find((testcase) => testcase.status_id !== 3);
        const errorMessage = accepted ? "" : getErrorMessage(firstFailedCase);

        await Submission.create({
            userId,
            problemId,
            code,
            language: normalizedLanguage,
            status: accepted ? "accepted" : (firstFailedCase?.status_id === 4 ? "wrong" : "error"),
            runtime: testCaseResults[0]?.time || 0,
            errorMessage,
            testCasesPassed: passedTestCases,
            testCasesTotal: totalTestCases
        });

        if (accepted && !req.result.problemSolved.some((id) => String(id) === String(problemId))) {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

        return res.status(200).send({
            accepted,
            passedTestCases,
            totalTestCases,
            runtime: testCaseResults[0]?.time || 0,
            memory: testCaseResults[0]?.memory || 0,
            error: accepted ? null : errorMessage
        });
    } catch (err) {
        console.error("submitCode error:", err);
        return res.status(500).send({
            accepted: false,
            error: err.message || "Internal server error",
            passedTestCases: 0,
            totalTestCases: 0
        });
    }
};

module.exports = { submitCode, runCode };
