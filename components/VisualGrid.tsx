import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GridItem } from '../types';

interface VisualGridProps {
  onComplete: (selectedIds: string[]) => void;
}

const items: GridItem[] = [
  { id: 'speed', label: 'Slow Delivery', imageUrl: 'https://images.unsplash.com/photo-1626071477287-25bfd376241b?auto=format&fit=crop&w=400&q=80' },
  { id: 'price', label: 'Too Expensive', imageUrl: 'https://images.unsplash.com/photo-1554672723-b208dc2513af?auto=format&fit=crop&w=400&q=80' },
  { id: 'packaging', label: 'Bad Packaging', imageUrl: 'https://images.unsplash.com/photo-1605701250441-2bfa95839417?auto=format&fit=crop&w=400&q=80' },
  { id: 'freshness', label: 'Not Fresh', imageUrl: 'https://images.unsplash.com/photo-1463428784770-9831c1a92e1b?auto=format&fit=crop&w=400&q=80' }
];

export const VisualGrid: React.FC<VisualGridProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (navigator.vibrate) navigator.vibrate(15);
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-800 mb-2">Any issues? 🛠️</h2>
        <p className="text-gray-500">Tap to tell us what went wrong.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {items.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleItem(item.id)}
              className={`relative aspect-square rounded-3xl overflow-hidden shadow-lg transition-all duration-300 border-4 ${
                isSelected 
                  ? 'border-emerald-500 ring-4 ring-emerald-200' 
                  : 'border-white'
              }`}
            >
              {/* Image Background */}
              <img 
                src={item.imageUrl} 
                alt={item.label}
                className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'scale-100'}`}
              />
              
              {/* Overlay */}
              <div className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-emerald-600/60' : 'bg-black/20 hover:bg-black/10'}`} />

              {/* Label */}
              <div className="absolute bottom-0 left-0 w-full p-3 text-left">
                  <span className="text-white font-bold text-sm drop-shadow-md leading-tight block">{item.label}</span>
              </div>
              
              {/* Checkmark */}
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }} 
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="bg-white text-emerald-600 rounded-full p-2 shadow-xl">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onComplete(selected)}
        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
            selected.length > 0 
                ? 'bg-emerald-600 text-white shadow-emerald-200' 
                : 'bg-white text-gray-800 border-2 border-gray-100'
        }`}
      >
        {selected.length > 0 ? 'Fix these for me' : 'Everything was perfect!'}
      </motion.button>
    </div>
  );
};