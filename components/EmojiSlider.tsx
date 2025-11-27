import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface EmojiSliderProps {
  onComplete: (value: number) => void;
}

export const EmojiSlider: React.FC<EmojiSliderProps> = ({ onComplete }) => {
  const [value, setValue] = useState(50);

  // Determine emoji and style based on value
  const getFeedback = (val: number) => {
    if (val < 30) return { emoji: '😤', color: 'from-red-500 to-red-600', text: 'Not Fresh', shadow: 'shadow-red-500/50' };
    if (val < 70) return { emoji: '😐', color: 'from-yellow-400 to-orange-500', text: 'It was okay', shadow: 'shadow-orange-500/50' };
    return { emoji: '🤩', color: 'from-emerald-400 to-green-600', text: 'Super Fresh!', shadow: 'shadow-emerald-500/50' };
  };

  const { emoji, color, text, shadow } = getFeedback(value);

  const handleDragEnd = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    setTimeout(() => {
        onComplete(value);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <h2 className="text-3xl font-black text-gray-800 mb-2">Rate the Veggies 🥕</h2>
      <p className="text-gray-500 mb-10 text-base font-medium">Drag to rate freshness</p>

      {/* Main Emoji Display */}
      <motion.div 
        className={`w-40 h-40 rounded-[2.5rem] flex items-center justify-center bg-gradient-to-br ${color} ${shadow} shadow-2xl mb-8 border-4 border-white`}
        animate={{ 
            scale: [1, 1.05, 1],
            rotate: value < 30 ? [-5, 5, -5] : value > 70 ? [0, 10, -10, 0] : 0
        }}
        transition={{ duration: 0.5 }}
        key={emoji} 
      >
        <span className="text-8xl drop-shadow-md filter">{emoji}</span>
      </motion.div>
      
      <motion.p 
        key={text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-12"
      >
        {text}
      </motion.p>

      {/* Custom Slider */}
      <div className="relative w-full h-16 bg-gray-100 rounded-full shadow-inner p-2 border border-gray-200">
        
        {/* Fill */}
        <div 
            className={`absolute top-2 left-2 bottom-2 rounded-full bg-gradient-to-r ${color} opacity-30`}
            style={{ width: `calc(${value}% - 16px)` }}
        />

        <input 
            type="range" 
            min="0" 
            max="100" 
            value={value} 
            onChange={(e) => {
                setValue(parseInt(e.target.value));
                if (navigator.vibrate && parseInt(e.target.value) % 10 === 0) navigator.vibrate(5);
            }}
            onTouchEnd={handleDragEnd}
            onMouseUp={handleDragEnd}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Floating Knob */}
         <div 
            className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border border-gray-100 pointer-events-none transition-all duration-75"
            style={{ left: `calc(${value}% - 24px)` }}
         >
            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${color}`} />
         </div>
      </div>

      <div className="flex justify-between w-full mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
        <span>Very Bad</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};