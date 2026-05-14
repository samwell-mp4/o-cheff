import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageOff, ShoppingCart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item, onAddToCart }) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/produto/${item.slug}`)}
      className="glass-card rounded-2xl p-6 group cursor-pointer relative overflow-hidden"
    >
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-black/60 backdrop-blur-md border border-[#00FFFF]/30 px-3 py-1 rounded-sm text-[#00FFFF] font-bebas tracking-widest text-xs">
          {item.category}
        </span>
      </div>
      
      {/* Image Preview */}
      <div className="w-full h-48 flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(0,255,255,0.05), transparent) opacity-0 group-hover:opacity-100 transition-opacity" />
        {imgError ? (
          <div className="text-gray-700 flex flex-col items-center gap-2">
            <ImageOff className="w-12 h-12" />
            <span className="font-bebas text-sm">NO PREVIEW</span>
          </div>
        ) : (
          <img
            src={item.image}
            alt={`${item.name} original ${item.category} comprar online MM2`}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.4)] group-hover:scale-110 transition-all duration-500"
          />
        )}
      </div>

      {/* Item Info */}
      <h3 className="text-2xl font-bold mb-4 font-gamer tracking-tighter group-hover:neon-cyan transition-all">
        {item.name}
      </h3>
      
      <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
        <div className="text-3xl font-black neon-gold font-bebas tracking-tighter">
          R$ {item.price.toFixed(2).replace('.', ',')}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="bg-[#00FFFF] text-black p-2 rounded-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 shadow-[0_0_15px_#00FFFF] hover:scale-110"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <div className="bg-white/10 text-white p-2 rounded-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Hover Background Accent */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#BF00FF]/5 blur-[60px] group-hover:bg-[#BF00FF]/20 transition-all" />
    </motion.div>
  );
};

export default ItemCard;
