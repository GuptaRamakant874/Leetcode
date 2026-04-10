import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function ChatAi({ problem, selectedLanguage }) {
    const [messages, setMessages] = useState([
        { role: 'model', content: "Hi, How are you" },
        { role: 'user', content: "I am Good" }
    ]);

    const { register, handleSubmit, reset,formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const normalizedLanguage = selectedLanguage?.trim().toLowerCase();
    const currentStartCode = problem?.startCode?.find((item) => {
        const language = item?.language?.trim().toLowerCase();

        if (normalizedLanguage === "cpp") {
            return language === "cpp" || language === "c++";
        }

        return language === normalizedLanguage;
    })?.initialCode || "";

    const onSubmit = async (data) => {
        const userMessage = data.message.trim();

        if (!userMessage) {
            return;
        }

        const nextMessages = [...messages, { role: 'user', content: userMessage }];

        setMessages(nextMessages);
        reset();

        try {
            const response = await axiosClient.post("/ai/chat", {
                message: userMessage,
                messages: nextMessages.map((msg) => ({
                    role: msg.role,
                    text: msg.content
                })),
                title: problem?.title || "",
                description: problem?.description || "",
                testCases: problem?.visibleTestCases || [],
                startCode: currentStartCode
            });

            setMessages(prev => [...prev, { 
                role: 'model', 
                content: response.data.message || response.data.content 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                content: "Sorry, I encountered an error" 
            }]);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-bubble bg-base-200 text-base-content">
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask me anything" 
                        className="input input-bordered flex-1" 
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-ghost ml-2"
                        disabled={errors.message}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;
