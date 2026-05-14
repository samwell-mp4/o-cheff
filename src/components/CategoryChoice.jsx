import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, Anchor, ChevronRight, Zap } from 'lucide-react';

const CategoryChoice = () => {
  const navigate = useNavigate();

  const choices = [
    {
      id: 'mm2',
      title: 'MURDER MYSTERY 2',
      subtitle: 'GODLYS, CHROMAS & SETS',
      description: 'O maior inventário de MM2 com os itens mais raros do mercado global.',
      icon: <Flame className="w-12 h-12" />,
      color: '#00FFFF',
      bgGradient: 'from-[#00FFFF]/20 to-transparent',
      borderColor: 'border-[#00FFFF]/30',
      image: 'https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Corrupt.png',
      route: '/shop?category=Godly'
    },
    {
      id: 'sailor',
      title: 'SAILOR PIECE',
      subtitle: 'CONTAS & ITENS MÍTICOS',
      description: 'Comece no topo com contas level máximo e materiais exclusivos para sua jornada.',
      icon: <Anchor className="w-12 h-12" />,
      color: '#BF00FF',
      bgGradient: 'from-[#BF00FF]/20 to-transparent',
      borderColor: 'border-[#BF00FF]/30',
      image: 'https://bloxvendas.com.br/uploads/categories/category_1776715753887_ribjw7.jpeg',
      route: '/shop?category=Sailor%20Piece'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-black/20">
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="h-px w-12 bg-white/20" />
            <span className="font-bebas text-2xl tracking-[0.3em] text-[#00FFFF] uppercase">Escolha sua Jornada</span>
            <div className="h-px w-12 bg-white/20" />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
            CATEGORIAS DE <span className="neon-cyan">ELITE</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {choices.map((choice, idx) => (
            <motion.div
              key={choice.id}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(choice.route)}
              className={`group relative cursor-pointer glass-card rounded-[40px] overflow-hidden border ${choice.borderColor} p-8 md:p-12 h-[500px] flex flex-col justify-end transition-all duration-500`}
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-t ${choice.bgGradient} opacity-50 group-hover:opacity-80 transition-opacity`} />
              
              {/* Image / Visual Element */}
              <div className="absolute top-10 right-[-10%] w-64 h-64 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                <img src={choice.image} alt="" className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
              </div>

              {/* Icon & Content */}
              <div className="relative z-10">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 shadow-2xl group-hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                  style={{ backgroundColor: `${choice.color}20`, color: choice.color, border: `1px solid ${choice.color}40` }}
                >
                  {choice.icon}
                </div>
                
                <div className="font-bebas text-xl tracking-widest text-gray-400 mb-2">{choice.subtitle}</div>
                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 group-hover:text-white transition-colors uppercase leading-tight">
                  {choice.title}
                </h3>
                <p className="text-gray-500 text-lg md:text-xl mb-8 max-w-sm line-clamp-2 group-hover:text-gray-300 transition-colors">
                  {choice.description}
                </p>

                <div className="flex items-center gap-4 group-hover:gap-6 transition-all duration-500">
                  <span className="font-bebas text-2xl tracking-widest" style={{ color: choice.color }}>ENTRAR NO SHOP</span>
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:border-white" style={{ borderColor: `${choice.color}40`, color: choice.color }}>
                    <ChevronRight className="w-6 h-6 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>

              {/* Decorative Overlay */}
              <div className="absolute top-6 left-6 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                <Zap className="w-4 h-4" style={{ color: choice.color }} />
                <span className="font-bebas text-sm tracking-widest uppercase">Sistema Sincronizado</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00FFFF] blur-[150px] rounded-full" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#BF00FF] blur-[150px] rounded-full" />
      </div>
    </section>
  );
};

export default CategoryChoice;
