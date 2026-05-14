import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen pt-32 pb-20 relative flex items-center justify-center overflow-hidden">
      {/* Background Media - Cinematic Particles & Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#00FFFF]/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#BF00FF]/10 blur-[150px] rounded-full" />
        <div className="cinematic-rays opacity-30" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Side: Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full mb-8"
            >
              <Sparkles className="w-5 h-5 text-neon-gold animate-pulse" />
              <span className="font-bebas tracking-[0.2em] text-lg text-gray-300">A LOJA Nº 1 DE ITENS DO BRASIL</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl xl:text-9xl font-black italic tracking-tighter uppercase leading-[0.85] mb-8"
            >
              O REINO <br /> 
              <span className="neon-cyan">DOS CARDS</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0"
            >
              Itens Lendários, Godlys e Chromas de <span className="text-white font-bold">Murder Mystery 2</span> e <span className="text-white font-bold">Sailor Piece</span> com entrega automatizada e segurança absoluta.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
            >
              <button 
                onClick={() => navigate('/shop')}
                className="group relative px-12 py-6 bg-neon-cyan text-black font-bebas text-2xl tracking-widest rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(0,255,255,0.4)]"
              >
                <div className="relative z-10 flex items-center gap-4">
                  EXPLORAR INVENTÁRIO
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[#050505] bg-gray-800 flex items-center justify-center">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="" className="w-full h-full rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">2.5k+ Compras</div>
                  <div className="text-sm text-gray-500 font-bebas tracking-widest">REALIZADAS ESTE MÊS</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Floating Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="flex-1 relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Card Visual */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/20 to-[#BF00FF]/20 rounded-[60px] border border-white/10 backdrop-blur-3xl transform rotate-6 scale-95 opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#BF00FF]/20 to-[#00FFFF]/20 rounded-[60px] border border-white/10 backdrop-blur-3xl transform -rotate-3 scale-95 opacity-50" />
              
              <div className="relative h-full w-full glass-card rounded-[60px] p-12 border-white/10 shadow-2xl flex flex-col items-center justify-center overflow-hidden group">
                <img 
                  src="https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Chroma_Luger.png" 
                  alt="Chroma Item" 
                  className="w-full h-full object-contain filter drop-shadow-[0_40px_60px_rgba(0,0,0,0.9)] animate-float"
                />
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="font-bebas text-2xl tracking-widest text-[#00FFFF] mb-1">CHROMA LUGER</div>
                  <div className="font-bebas text-4xl tracking-tighter text-white">ITEM EM DESTAQUE</div>
                </div>
                <div className="absolute top-12 right-12 bg-neon-cyan/10 border border-neon-cyan/40 p-4 rounded-2xl">
                  <div className="font-bebas text-2xl text-neon-cyan">R$ 14,90</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 w-full max-w-5xl mx-auto"
        >
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-neon-cyan transition-all group-hover:scale-110">
              <Rocket className="w-8 h-8 text-neon-cyan" />
            </div>
            <h3 className="font-bebas text-2xl tracking-widest text-white mb-2">ENTREGA FLASH</h3>
            <p className="text-gray-500">Média de 5 minutos via trade oficial no Roblox.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-neon-purple transition-all group-hover:scale-110">
              <ShieldCheck className="w-8 h-8 text-neon-purple" />
            </div>
            <h3 className="font-bebas text-2xl tracking-widest text-white mb-2">SEGURANÇA TOTAL</h3>
            <p className="text-gray-500">Transações 100% protegidas e garantidas.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-neon-gold transition-all group-hover:scale-110">
              <Trophy className="w-8 h-8 text-neon-gold" />
            </div>
            <h3 className="font-bebas text-2xl tracking-widest text-white mb-2">SUPORTE VIP</h3>
            <p className="text-gray-500">Equipe pronta para ajudar você em qualquer dúvida.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
