import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SurveyStep, SwipeCardData } from './types';
import { SwipeCards } from './components/SwipeCards';
import { EmojiSlider } from './components/EmojiSlider';
import { VisualGrid } from './components/VisualGrid';
import { ChatBot } from './components/ChatBot';
import { Completion } from './components/Completion';

// Image-Rich Data for the Swipe Poll
const SWIPE_DATA: SwipeCardData[] = [
  { 
    id: 1, 
    question: "Was your delivery fast enough?", 
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80",
    yesLabel: "FAST ⚡️", 
    noLabel: "SLOW 🐢" 
  },
  { 
    id: 2, 
    question: "Are our prices fair for you?", 
    imageUrl: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=600&q=80", // Market scene
    yesLabel: "GOOD PRICE 👍", 
    noLabel: "EXPENSIVE 💸" 
  },
  { 
    id: 3, 
    question: "Do you want us to stock more Garlic?", 
    imageUrl: "https://images.unsplash.com/photo-1615477209723-69f8841a22bd?auto=format&fit=crop&w=600&q=80",
    yesLabel: "YES PLEASE 🧄", 
    noLabel: "NO THANKS 🙅‍♂️" 
  }
];

const App: React.FC = () => {
  const [step, setStep] = useState<SurveyStep>(SurveyStep.INTRO);

  const nextStep = () => {
    switch (step) {
      case SurveyStep.INTRO: setStep(SurveyStep.SWIPE_POLL); break;
      case SurveyStep.SWIPE_POLL: setStep(SurveyStep.RATING_SLIDER); break;
      case SurveyStep.RATING_SLIDER: setStep(SurveyStep.IMPROVEMENT_GRID); break;
      case SurveyStep.IMPROVEMENT_GRID: setStep(SurveyStep.CHAT_BOT); break;
      case SurveyStep.CHAT_BOT: setStep(SurveyStep.COMPLETION); break;
      default: break;
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-900 flex flex-col items-center justify-center font-sans">
      
      {/* Dynamic Background Layer */}
      <AnimatePresence mode='wait'>
        <motion.div 
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ 
                backgroundImage: step === SurveyStep.INTRO 
                    ? "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80')" // Market
                    : "none"
            }}
        >
            <div className={`absolute inset-0 ${step === SurveyStep.INTRO ? 'bg-black/50' : 'bg-gradient-to-br from-emerald-50 to-orange-50'}`} />
        </motion.div>
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-md h-full flex flex-col">
        
        {/* Progress Dots */}
        {step !== SurveyStep.INTRO && step !== SurveyStep.COMPLETION && (
             <div className="absolute top-8 left-0 w-full px-8 flex justify-center gap-2 z-20">
                 {[SurveyStep.SWIPE_POLL, SurveyStep.RATING_SLIDER, SurveyStep.IMPROVEMENT_GRID, SurveyStep.CHAT_BOT].map((s, i) => (
                     <motion.div 
                        key={i} 
                        initial={false}
                        animate={{ 
                            width: Object.values(SurveyStep).indexOf(step) === Object.values(SurveyStep).indexOf(s) ? 24 : 8,
                            backgroundColor: Object.values(SurveyStep).indexOf(step) >= Object.values(SurveyStep).indexOf(s) ? '#10B981' : '#D1D5DB'
                        }}
                        className="h-2 rounded-full shadow-sm"
                     />
                 ))}
             </div>
        )}

        <AnimatePresence mode='wait'>
          {step === SurveyStep.INTRO && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-end h-full pb-16 px-6 text-center text-white"
            >
              <div className="flex-1 flex flex-col justify-center items-center">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-6xl mb-6 border border-white/20 shadow-xl"
                  >
                    🍅
                  </motion.div>
                  <h1 className="text-5xl font-black mb-4 drop-shadow-lg tracking-tight">ChipChip</h1>
                  <p className="text-xl font-medium opacity-90 max-w-xs drop-shadow-md">
                    Help us build the best grocery delivery in Ethiopia! 🇪🇹
                  </p>
              </div>
              
              <div className="w-full bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                <p className="text-sm font-semibold mb-4 opacity-80">Takes only 30 seconds</p>
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-emerald-900/20 shadow-xl flex items-center justify-center gap-2"
                >
                    Let's Go 🚀
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === SurveyStep.SWIPE_POLL && (
            <motion.div 
              key="swipe"
              className="flex-1 flex flex-col items-center justify-center p-4 pt-16"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
            >
              <SwipeCards cards={SWIPE_DATA} onComplete={nextStep} />
            </motion.div>
          )}

          {step === SurveyStep.RATING_SLIDER && (
            <motion.div 
               key="slider"
               className="flex-1 flex flex-col items-center justify-center p-4 pt-16"
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -100, opacity: 0 }}
            >
                <EmojiSlider onComplete={nextStep} />
            </motion.div>
          )}

          {step === SurveyStep.IMPROVEMENT_GRID && (
             <motion.div 
                key="grid"
                className="flex-1 flex flex-col items-center justify-center p-4 pt-16"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
             >
                 <VisualGrid onComplete={nextStep} />
             </motion.div>
          )}

          {step === SurveyStep.CHAT_BOT && (
              <motion.div 
                  key="chat"
                  className="flex-1 flex flex-col items-center justify-center p-4 pt-12 pb-0 h-full"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
              >
                  <ChatBot onComplete={nextStep} />
              </motion.div>
          )}

          {step === SurveyStep.COMPLETION && (
              <motion.div 
                  key="done"
                  className="absolute inset-0 z-50 bg-white"
              >
                  <Completion />
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;