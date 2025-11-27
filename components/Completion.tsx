import React from 'react';
import { motion } from 'framer-motion';

export const Completion = () => {
  const particles = Array.from({ length: 50 });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-6 relative overflow-hidden bg-emerald-600">
      
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 to-emerald-800" />

      {/* Confetti Particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${['bg-yellow-300', 'bg-white', 'bg-orange-400', 'bg-pink-400'][i % 4]}`}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: -20, 
            rotate: 0 
          }}
          animate={{ 
            y: window.innerHeight + 20, 
            rotate: 360 * 2,
            x: Math.random() * window.innerWidth 
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            ease: "linear",
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="z-10 bg-white p-1 rounded-[2.5rem] shadow-2xl rotate-1"
      >
        <div className="bg-white rounded-[2.2rem] border-4 border-dashed border-gray-200 p-8 flex flex-col items-center">
            <motion.div 
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                className="text-8xl mb-6 filter drop-shadow-xl"
            >
                🎉
            </motion.div>
            
            <h2 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">You're Awesome!</h2>
            <p className="text-gray-500 mb-8 font-medium">Thanks for helping us improve.</p>
            
            {/* Reward Card */}
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:animate-shine" />
                
                <div className="flex justify-between items-center relative z-10">
                    <div className="text-left">
                        <p className="text-yellow-800 font-bold uppercase text-[10px] tracking-widest mb-1">Promo Code Unlocked</p>
                        <p className="text-4xl font-black text-white drop-shadow-md">10 BIRR</p>
                    </div>
                    <div className="h-12 w-12 bg-white/30 rounded-full flex items-center justify-center text-2xl">
                        💰
                    </div>
                </div>
            </motion.div>

            <button 
                onClick={() => window.location.reload()}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-xl"
            >
                Close & Shop
            </button>
        </div>
      </motion.div>
    </div>
  );
};