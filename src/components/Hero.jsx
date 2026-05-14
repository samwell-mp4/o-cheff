import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Trophy } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-52 pb-32 relative overflow-hidden">
      {/* Cinematic Rays & Background Glows */}
      <div className="cinematic-rays" />
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-[#BF00FF]/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-20 left-[-5%] w-[400px] h-[400px] bg-[#00FFFF]/10 blur-[120px] rounded-full" />
      
      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <span className="bg-[#00FFFF]/10 border border-[#00FFFF]/30 px-4 py-2 rounded-full text-[#00FFFF] font-bebas tracking-widest text-lg shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            A MAIOR REVENDEDORA DE ELITE DO BRASIL
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-7xl md:text-9xl font-black mb-8 leading-none tracking-tighter"
        >
          <span className="block">DOMINE O</span>
          <span className="neon-cyan">INVENTÁRIO</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-[#888888] text-xl md:text-2xl mb-12 max-w-2xl font-light leading-relaxed"
        >
          Itens Godlys, Chromas e Sets de <span className="text-white font-bold">Murder Mystery 2</span> com entrega instantânea e segurança absoluta.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap gap-6 justify-center mb-16"
        >
          <button 
            onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
            className="btn-viral"
          >
            ACESSAR CATÁLOGO AGORA
          </button>
          <button className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bebas text-xl tracking-widest hover:bg-white/10 transition-all rounded-sm">
            VER TUTORIAIS
          </button>
        </motion.div>

        {/* Cinematic Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
        >
          <div className="flex items-center gap-4 justify-center md:justify-start glass-card p-4 rounded-xl border-[#00FFFF]/20">
            <Rocket className="w-8 h-8 text-[#00FFFF]" />
            <div className="text-left">
              <div className="font-bebas text-xl tracking-widest">ENTREGA FLASH</div>
              <div className="text-xs text-[#888888]">Média de 5 minutos</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start glass-card p-4 rounded-xl border-[#BF00FF]/20">
            <ShieldCheck className="w-8 h-8 text-[#BF00FF]" />
            <div className="text-left">
              <div className="font-bebas text-xl tracking-widest">100% SEGURO</div>
              <div className="text-xs text-[#888888]">Trade oficial via Roblox</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start glass-card p-4 rounded-xl border-[#FFD700]/20">
            <Trophy className="w-8 h-8 text-[#FFD700]" />
            <div className="text-left">
              <div className="font-bebas text-xl tracking-widest">TOP VENDEDOR</div>
              <div className="text-xs text-[#888888]">Líder em MM2</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
