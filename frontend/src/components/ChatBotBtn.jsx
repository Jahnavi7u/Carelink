import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBotBtn = () => {
    const [isChatBotOpen, setIsChatBotOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => {
        setIsChatBotOpen(!isChatBotOpen);
    };

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/v1/chatbot', { prompt: input });

            const botResponse = { text: response.data.response, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botResponse]);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            setMessages((prevMessages) => [...prevMessages, { text: 'Error retrieving response.', sender: 'bot' }]);
        }

        setLoading(false);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <motion.button
                className="bg-white p-4 rounded-full shadow-md border-1 border-indigo-600 hover:bg-indigo-600 hover:cursor-pointer"
                onClick={toggleChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <img src="https://cdn-icons-png.freepik.com/256/4712/4712242.png?semt=ais_hybrid" alt="chatbot" className='h-7 w-7' />
            </motion.button>

            <AnimatePresence>
                {isChatBotOpen && (
                    <motion.div
                        className="absolute right-3 bottom-16 bg-[#FAF9F6] shadow-md rounded-lg w-110 h-125 p-4 flex flex-col justify-between"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className='flex justify-between items-center mb-2'>
                            <img src="https://cdn-icons-png.freepik.com/256/4712/4712242.png?semt=ais_hybrid" alt="chatbot" className='h-7 w-7' />
                            <h2 className="text-lg font-bold">CareLink</h2>
                            <button className="text-black text-xl hover:text-red-600 focus:outline-none" onClick={toggleChat}>
                                <X />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    className={`py-2 px-3 my-1 rounded-3xl w-fit text-white ${msg.sender === 'user' ? 'bg-purple-500 text-right ml-auto' : 'bg-indigo-500 text-left'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {msg.text}
                                </motion.div>
                            ))}
                            {loading && <div className="text-white py-2 px-3 my-1 rounded-3xl bg-indigo-500 w-fit text-left">Thinking...</div>}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder='Ask something?'
                                className='p-2 shadow-md rounded-2xl border-none w-full'
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>
                                <img src="https://cdn-icons-png.flaticon.com/128/6532/6532019.png" alt="send button" className="h-6 w-6" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatBotBtn;