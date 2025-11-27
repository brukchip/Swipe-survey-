import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini, initializeChat } from '../services/geminiService';
import { Message } from '../types';

interface ChatBotProps {
  onComplete: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hey! 👋 ChipChip support here. We noticed you haven\'t ordered in a while. Is everything okay?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [options, setOptions] = useState<string[]>([
    'Prices are high 💸',
    'Quality was bad 🍅',
    'Just busy/forgot 🤷‍♂️',
    'Delivery too slow 🐢'
  ]);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleOptionClick = async (option: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: option };
    setMessages(prev => [...prev, userMsg]);
    setOptions([]); 
    setIsTyping(true);

    const responseText = await sendMessageToGemini(option);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);

    if (option.includes("Yes") || option.includes("order")) {
         setTimeout(onComplete, 2000);
    } else {
        setTimeout(() => {
            setOptions(['Yes, I\'ll order! 😍', 'Maybe next week']);
        }, 1000);
    }
    
    if (option === 'Maybe next week') {
        setTimeout(onComplete, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-[#e5ddd5] rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden relative">
      {/* WhatsApp-style Header */}
      <div className="bg-[#075e54] p-4 pt-6 flex items-center space-x-3 text-white shadow-md z-10 shrink-0">
        <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#075e54] font-bold text-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop" alt="Support" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-[2px] border-2 border-[#075e54]">
                 <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
        </div>
        <div>
          <h3 className="font-bold text-lg leading-none">ChipChip Support</h3>
          <p className="text-xs opacity-80 mt-1">Typically replies instantly</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative" ref={scrollRef}>
        {/* Chat Background Pattern */}
        <div className="absolute inset-0 opacity-[0.06] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] pointer-events-none" />

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
          >
            <div 
                className={`max-w-[85%] p-3 px-4 rounded-2xl text-[15px] leading-snug shadow-sm relative ${
                    msg.role === 'user' 
                    ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none'
                }`}
            >
              {msg.text}
              <div className="text-[10px] text-gray-400 text-right mt-1 opacity-70">
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                {msg.role === 'user' && <span className="ml-1 text-blue-400">✓✓</span>}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start relative z-10">
             <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1 items-center h-10">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
             </div>
          </motion.div>
        )}
        <div className="h-24" /> {/* Spacer for bottom actions */}
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-0 left-0 w-full p-2 bg-white/80 backdrop-blur-md border-t border-gray-200 pb-safe">
        <div className="flex flex-wrap gap-2 justify-center p-2">
            <AnimatePresence>
                {options.map((opt) => (
                <motion.button
                    key={opt}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOptionClick(opt)}
                    className="bg-white hover:bg-gray-50 text-emerald-700 px-5 py-3 rounded-full text-sm font-bold border border-emerald-100 shadow-sm grow-0 shrink-0 whitespace-nowrap"
                >
                    {opt}
                </motion.button>
                ))}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};