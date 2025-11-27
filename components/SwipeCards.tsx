import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { SwipeCardData } from '../types';

interface SwipeCardsProps {
  cards: SwipeCardData[];
  onComplete: () => void;
}

const swipeVariants = {
  enter: (direction: number) => ({
    scale: 0.9,
    y: 30,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.3 }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? 1000 : -1000,
    rotate: direction > 0 ? 20 : -20,
    opacity: 0,
    transition: { duration: 0.2 }
  })
};

export const SwipeCards: React.FC<SwipeCardsProps> = ({ cards, onComplete }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  
  // Visual indicators for swipe drag
  const yesOpacity = useTransform(x, [0, 100], [0, 1]);
  const noOpacity = useTransform(x, [-100, 0], [1, 0]);
  const yesScale = useTransform(x, [0, 150], [0.5, 1.2]);
  const noScale = useTransform(x, [-150, 0], [1.2, 0.5]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      triggerSwipe('right');
    } else if (info.offset.x < -threshold) {
      triggerSwipe('left');
    } else {
      // Snap back if not swiped far enough
      // x is handled by framer motion drag snap back automatically usually, 
      // but explicit reset is safer if needed, though dragConstraints handle it.
    }
  };

  const triggerSwipe = (dir: 'left' | 'right') => {
    if (navigator.vibrate) navigator.vibrate(20);
    
    const dirVal = dir === 'right' ? 1 : -1;
    setDirection(dirVal);
    
    // We update state immediately to trigger exit animation
    if (activeCardIndex < cards.length) {
       setTimeout(() => {
          if (activeCardIndex === cards.length - 1) {
            onComplete();
          } else {
            setActiveCardIndex(prev => prev + 1);
            x.set(0); 
            setDirection(0);
          }
       }, 250); // Wait slightly for animation to start visually if triggered by button
    }
  };

  const activeCard = cards[activeCardIndex];

  if (activeCardIndex >= cards.length) return null;

  return (
    <div className="relative w-full h-[70vh] flex flex-col items-center justify-center perspective-1000">
        <h2 className="absolute -top-12 text-2xl font-black text-gray-800 tracking-tight">Quick Check! ⚡️</h2>
      
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={activeCard.id}
          custom={direction}
          variants={swipeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={handleDragEnd}
          style={{ x, rotate, opacity }}
          className="absolute w-full h-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border-4 border-white z-10 touch-none"
        >
            {/* Full Background Image */}
            <div className="absolute inset-0 bg-gray-200">
                <img 
                    src={activeCard.imageUrl} 
                    alt="Question context" 
                    className="w-full h-full object-cover"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </div>

            {/* Overlays for Yes/No (Drag Feedback) */}
            <motion.div style={{ opacity: yesOpacity, scale: yesScale }} className="absolute top-10 left-10 z-20 pointer-events-none">
                <div className="border-4 border-green-400 text-green-400 rounded-xl px-4 py-2 text-4xl font-black transform -rotate-12 bg-black/20 backdrop-blur-sm">
                    YES
                </div>
            </motion.div>
            <motion.div style={{ opacity: noOpacity, scale: noScale }} className="absolute top-10 right-10 z-20 pointer-events-none">
                 <div className="border-4 border-red-500 text-red-500 rounded-xl px-4 py-2 text-4xl font-black transform rotate-12 bg-black/20 backdrop-blur-sm">
                    NO
                </div>
            </motion.div>

            {/* Content at Bottom */}
            <div className="absolute bottom-0 w-full p-6 pb-8 text-white select-none">
                <div className="text-5xl mb-4 filter drop-shadow-lg">
                    {activeCardIndex === 0 ? '🛵' : activeCardIndex === 1 ? '💸' : '🍅'}
                </div>
                <h3 className="text-3xl font-bold leading-tight drop-shadow-md mb-8">
                    {activeCard.question}
                </h3>
                
                {/* Interactive Buttons */}
                <div className="flex justify-between items-center gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); triggerSwipe('left'); }}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-red-500/20 backdrop-blur-md py-4 rounded-2xl border border-white/20 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform">✕</div>
                        <span className="font-bold uppercase tracking-widest text-sm">No</span>
                    </motion.button>
                    
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); triggerSwipe('right'); }}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-green-500/20 backdrop-blur-md py-4 rounded-2xl border border-white/20 transition-colors group"
                    >
                        <span className="font-bold uppercase tracking-widest text-sm">Yes</span>
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform">✓</div>
                    </motion.button>
                </div>
            </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Stack Effect Cards (visual only) */}
      <div className="absolute top-8 w-[90%] h-full bg-white/40 rounded-[2.5rem] -z-10 blur-[1px] transform scale-95 transition-transform" />
      <div className="absolute top-14 w-[80%] h-full bg-white/20 rounded-[2.5rem] -z-20 blur-[2px] transform scale-90 transition-transform" />
    </div>
  );
};