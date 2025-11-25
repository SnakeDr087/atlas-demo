import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, UserRole } from '../types.ts';
import { CloseIcon, ChatBubbleIcon } from './IconComponents.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

interface ChatbotProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    history: ChatMessage[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

const suggestedPrompts: Record<UserRole, string[]> = {
    'Super Admin': [
        'How many agencies are there?',
        'Which agency has the most officers?',
        'Show me all high-priority trouble tickets.',
        'What is the most common follow-up action?'
    ],
    'Agency Admin': [
        'How many active officers are in my agency?',
        'Show me the incident history for Officer John Davis.',
        'Are any of my officers on a PIP?',
        'List all reports that are still pending review.'
    ],
    'Agency Supervisor': [
        'How many active officers are in my agency?',
        'Show me the incident history for Officer John Davis.',
        'Are any of my officers on a PIP?',
        'List all reports that are still pending review.'
    ],
    'Officer': [], // No chatbot for Officer role
};

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen, history, isLoading, onSendMessage }) => {
    const { currentUser } = useAppContext();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [history]);

    const handleSend = (message?: string) => {
        const messageToSend = message || inputValue;
        if (messageToSend.trim()) {
            onSendMessage(messageToSend);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    
    if (!currentUser) return null;
    const role = currentUser.role;

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-8 right-8 bg-atlas-blue text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue transition-transform transform ${isOpen ? 'scale-0' : 'scale-100'}`}
                aria-label="Open chatbot"
            >
                <ChatBubbleIcon className="h-8 w-8" />
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-8 right-8 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* Header */}
                <div className="p-4 bg-atlas-sidebar text-white flex justify-between items-center rounded-t-lg">
                    <h3 className="font-semibold text-lg">ATLAS AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                        {history.length === 0 && (
                             <div className="text-center text-gray-500 p-4">
                                <p className="font-semibold">Ask me anything about your data!</p>
                                <p className="text-sm mt-4 mb-2">Or try one of these suggestions:</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {(suggestedPrompts[role] || []).map((prompt, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => handleSend(prompt)}
                                            className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {history.map((msg, index) => (
                             <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-atlas-blue text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-200 text-gray-800">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                         <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question..."
                            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-atlas-blue text-gray-900"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading}
                            className="px-4 py-2 bg-atlas-blue text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
