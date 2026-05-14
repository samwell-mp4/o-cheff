import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight } from 'lucide-react';

const FloatingCart = ({ count, onOpenCart }) => {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      <motion.button
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 50 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenCart}
        className="relative group flex items-center gap-4 bg-neon-cyan text-black px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all overflow-hidden"
      >
        {/* Animated Glow Background */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-7 h-7" />
            <span className="absolute -top-2 -right-2 bg-black text-neon-cyan text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              {count}
            </span>
          </div>
          <span className="font-bebas text-xl tracking-widest hidden sm:block">VER CARRINHO</span>
        </div>
        
        <ChevronRight className="w-5 h-5 hidden sm:block group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
};

export default FloatingCart;
