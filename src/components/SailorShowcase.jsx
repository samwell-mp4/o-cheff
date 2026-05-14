import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Anchor, Zap, Shield } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const SailorShowcase = () => {
  const navigate = useNavigate();
  const [sailorItems, setSailorItems] = useState([]);

  useEffect(() => {
    const fetchSailor = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Sailor Piece')
        .eq('is_active', true)
        .limit(4);
      if (data) setSailorItems(data);
    };
    fetchSailor();
  }, []);

  if (sailorItems.length === 0) return null;

  return (
    <section className="py-24 relative bg-[#050510]">
      <div className="container">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-neon-cyan mb-4">
              <Anchor className="w-6 h-6" />
              <span className="font-bebas text-2xl tracking-[0.3em]">SAILOR PIECE EXCLUSIVE</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              DOMINE OS <span className="text-neon-cyan">MARES</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/shop?category=Sailor Piece')}
            className="font-bebas text-xl tracking-widest text-gray-400 hover:text-neon-cyan transition-colors"
          >
            VER COLEÇÃO COMPLETA →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sailorItems.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/produto/${item.slug}`)}
              className="glass-card rounded-[32px] p-8 border-white/5 hover:border-neon-cyan/20 cursor-pointer group"
            >
              <div className="h-48 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-neon-cyan/5 blur-3xl rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={item.image} alt={item.name} className="h-full object-contain relative z-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-gamer tracking-tight truncate">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-white">R$ {parseFloat(item.price).toFixed(2)}</div>
                  <div className="flex gap-2">
                    <Zap className="w-4 h-4 text-neon-cyan" />
                    <Shield className="w-4 h-4 text-neon-purple" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SailorShowcase;
