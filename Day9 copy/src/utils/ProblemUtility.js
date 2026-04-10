const axios = require("axios");

const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || "https://ce.judge0.com";

const languageIdMap = {
    "c++": 54,
    "cpp": 54,
    "java": 62,
    "javascript": 102,
    "js": 102
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeText = (value) => String(value ?? "").replace(/\r\n/g, "\n").trim();

const getLanguageId = (language) => {
    const key = String(language || "").toLowerCase();
    const id = languageIdMap[key];

    if (!id) {
        throw new Error("Unsupported language: " + language);
    }

    return id;
};

const fetchSubmissionResult = async (token, maxAttempts = 20) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const { data } = await axios.get(`${JUDGE0_BASE_URL}/submissions/${token}`, {
            params: {
                base64_encoded: false
            },
            timeout: 45000
        });

        const statusId = data?.status?.id;
        if (statusId !== 1 && statusId !== 2) {
            return data;
        }

        await delay(1000);
    }

    throw new Error("Judge0 timeout while waiting for submission result");
};

const runSubmission = async ({ language, source_code, stdin = "", expected_output }) => {
    const language_id = getLanguageId(language);

    try {
        const payload = {
            language_id,
            source_code,
            stdin
        };

        let result;

        try {
            const { data } = await axios.post(`${JUDGE0_BASE_URL}/submissions`, payload, {
                params: {
                    base64_encoded: false,
                    wait: true
                },
                timeout: 45000
            });

            if (data?.status?.id) {
                result = data;
            } else if (data?.token) {
                result = await fetchSubmissionResult(data.token);
            }
        } catch (error) {
            const waitNotAllowed = error?.response?.data?.error === "wait not allowed";
            if (!waitNotAllowed) {
                throw error;
            }

            const { data: queued } = await axios.post(`${JUDGE0_BASE_URL}/submissions`, payload, {
                params: {
                    base64_encoded: false,
                    wait: false
                },
                timeout: 45000
            });

            result = await fetchSubmissionResult(queued.token);
        }

        if (!result?.status?.id) {
            throw new Error("Invalid response from Judge0");
        }

        let statusId = result.status.id;

        // Keep behavior stable for your existing controller checks while making output compare tolerant.
        if (statusId === 3 && expected_output !== undefined) {
            const actual = normalizeText(result.stdout);
            const expected = normalizeText(expected_output);
            if (actual !== expected) {
                statusId = 4;
            }
        }

        return {
            status: { id: statusId },
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            message: result.message,
            time: result.time,
            memory: result.memory
        };
    } catch (err) {
        const apiError = err?.response?.data;
        if (apiError) {
            throw new Error("Judge0 request failed: " + JSON.stringify(apiError));
        }
        throw err;
    }
};

module.exports = runSubmission;
// module.exports = { getLanguageById, runSubmission };
