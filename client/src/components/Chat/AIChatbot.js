import React, { useState } from "react";
import API from "../../api"; // Your axios instance

const AIChatbot = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSend = async () => {
        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        
        try {
            const { data } = await API.post("/index/ai-assistant", { prompt: input });
            setMessages(prev => [...prev, { text: data.data.message, sender: "ai" }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "AI is sleeping right now...", sender: "ai" }]);
        }
        setInput("");
    };

    return (
        <div className="fixed bottom-5 right-5 w-80 bg-white shadow-2xl rounded-2xl border flex flex-col overflow-hidden">
            <div className="bg-blue-600 p-4 text-white font-bold">Intellinest AI</div>
            <div className="h-64 overflow-y-auto p-4 space-y-2">
                {messages.map((m, i) => (
                    <div key={i} className={`p-2 rounded-lg ${m.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100'}`}>
                        {m.text}
                    </div>
                ))}
            </div>
            <div className="p-2 border-t flex">
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow p-2 outline-none" 
                    placeholder="Ask about a mentor..." 
                />
                <button onClick={handleSend} className="text-blue-600 font-bold px-2">Send</button>
            </div>
        </div>
    );
};

export default AIChatbot;