const { GoogleGenAI } = require("@google/genai");

const normalizeMessagesToContents = (messages) => {
    if (!Array.isArray(messages)) {
        return null;
    }

    const normalizedMessages = messages
        .map((message) => {
            if (!message || typeof message !== "object") {
                return null;
            }

            const role = message.role === "model" ? "model" : message.role === "user" ? "user" : null;
            const text = typeof message.text === "string" ? message.text.trim() : "";

            if (!role || !text) {
                return null;
            }

            return {
                role,
                parts: [{ text }]
            };
        })
        .filter(Boolean);

    if (normalizedMessages.length !== messages.length || normalizedMessages.length === 0) {
        return null;
    }

    return normalizedMessages;
};

const solveDoubt = async (req, res) => {
    try {
        const { message, messages, title, description, testCases, startCode } = req.body || {};
        const apiKey = process.env.GEMINI_KEY?.trim() || process.env.GEMINI_API_KEY?.trim();
        const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

        if (!apiKey) {
            console.error("GEMINI_KEY/GEMINI_API_KEY is missing. /ai/chat cannot be processed.");
            return res.status(500).json({
                message: "AI service is not configured"
            });
        }

        let contents = null;

        if (Array.isArray(messages) && messages.length > 0) {
            contents = normalizeMessagesToContents(messages);

            if (!contents) {
                return res.status(400).json({
                    message: "Invalid messages payload"
                });
            }
        } else if (typeof message === "string" && message.trim()) {
            contents = [{
                role: "user",
                parts: [{ text: message.trim() }]
            }];
        } else {
            return res.status(400).json({
                message: "Either a valid message or messages array is required"
            });
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction: `
You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${typeof title === "string" ? title : ""}
[PROBLEM_DESCRIPTION]: ${typeof description === "string" ? description : ""}
[EXAMPLES]: ${JSON.stringify(testCases ?? [])}
[startCode]: ${typeof startCode === "string" ? startCode : ""}


## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches (brute force, optimized, etc.)
6. **Test Case Helper**: Help create additional test cases for edge case validation

## INTERACTION GUIDELINES:

### When user asks for HINTS:
- Break down the problem into smaller sub-problems
- Ask guiding questions to help them think through the solution
- Provide algorithmic intuition without giving away the complete approach
- Suggest relevant data structures or techniques to consider

### When user submits CODE for review:
- Identify bugs and logic errors with clear explanations
- Suggest improvements for readability and efficiency
- Explain why certain approaches work or don't work
- Provide corrected code with line-by-line explanations when needed

### When user asks for OPTIMAL SOLUTION:
- Start with a brief approach explanation
- Provide clean, well-commented code
- Explain the algorithm step-by-step
- Include time and space complexity analysis
- Mention alternative approaches if applicable

### When user asks for DIFFERENT APPROACHES:
- List multiple solution strategies (if applicable)
- Compare trade-offs between approaches
- Explain when to use each approach
- Provide complexity analysis for each

## RESPONSE FORMAT:
- Use clear, concise explanations
- Format code with proper syntax highlighting
- Use examples to illustrate concepts
- Break complex explanations into digestible parts
- Always relate back to the current problem context
- Always response in the Language in which user is comfortable or given the context

## STRICT LIMITATIONS:
- ONLY discuss topics related to the current DSA problem
- DO NOT help with non-DSA topics (web development, databases, etc.)
- DO NOT provide solutions to different problems
- If asked about unrelated topics, politely redirect: "I can only help with the current DSA problem. What specific aspect of this problem would you like assistance with?"

## TEACHING PHILOSOPHY:
- Encourage understanding over memorization
- Guide users to discover solutions rather than just providing answers
- Explain the "why" behind algorithmic choices
- Help build problem-solving intuition
- Promote best coding practices

Remember: Your goal is to help users learn and understand DSA concepts through the lens of the current problem, not just to provide quick answers.
`
            }
        });

        const responseText = typeof response?.text === "string" ? response.text.trim() : "";

        if (!responseText) {
            console.error("Gemini returned an empty response:", response);
            return res.status(502).json({
                message: "AI service returned an empty response"
            });
        }

        // console.log(responseText);
        return res.status(201).json({
            message: responseText
        });
    } catch (err) {
        const providerMessage =
            err?.message ||
            err?.error?.message ||
            err?.response?.data?.error?.message ||
            err?.response?.data?.message;

        console.error("Error while solving doubt:", providerMessage || err);
        return res.status(500).json({
            message: providerMessage || "Internal server error"
        });
    }
};

module.exports = solveDoubt;
