import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Anchor, Zap, Shield, Sparkles, Trophy } from 'lucide-react';
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
        .limit(4);
      if (data) setSailorItems(data);
    };
    fetchSailor();
  }, []);

  if (sailorItems.length === 0) return null;

  return (
    <section className="py-32 relative bg-[#050510] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00FFFF]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00FFFF]/5 blur-[150px] rounded-full opacity-50" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 text-neon-cyan mb-6"
            >
              <div className="h-px w-12 bg-neon-cyan" />
              <span className="font-bebas text-2xl tracking-[0.4em] uppercase">Coleção Imperial</span>
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] font-gamer italic">
              SAILOR <span className="text-neon-cyan drop-shadow-[0_0_20px_rgba(0,255,255,0.4)]">PIECE</span>
            </h2>
            <p className="mt-8 text-gray-500 font-bebas text-xl tracking-widest max-w-xl">
              OS ITENS MAIS RAROS E PODEROSOS DOS SETE MARES, SELECIONADOS PARA QUEM BUSCA O TOPO.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, x: 10 }}
            onClick={() => navigate('/shop?category=Sailor Piece')}
            className="group flex items-center gap-4 font-bebas text-2xl tracking-widest text-white/40 hover:text-neon-cyan transition-all"
          >
            EXPLORAR TUDO <Anchor className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {sailorItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -15 }}
              onClick={() => navigate(`/produto/${item.slug || item.id}`)}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#00FFFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[40px] blur-xl" />
              
              <div className="relative glass-card rounded-[40px] p-10 border border-white/5 hover:border-neon-cyan/40 transition-all duration-500 overflow-hidden">
                {/* Rarity Tag */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                   <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Exclusivo</span>
                </div>

                <div className="h-56 flex items-center justify-center mb-10 relative">
                  <div className="absolute inset-0 bg-neon-cyan/5 blur-3xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-700" />
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full object-contain relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" 
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-black font-gamer tracking-tight text-white group-hover:text-neon-cyan transition-colors truncate uppercase">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 text-left">Preço Especial</span>
                      <div className="text-3xl font-black text-white tracking-tighter">
                        <span className="text-sm text-neon-cyan mr-1 font-bebas">R$</span>
                        {parseFloat(item.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-neon-cyan/50 transition-all group-hover:bg-neon-cyan/10">
                      <Trophy className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform" />
                    </div>
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
