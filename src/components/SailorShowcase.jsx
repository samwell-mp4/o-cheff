import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCards } from 'swiper/modules';
import mm2Items from '../data/mm2Items';
import { ChevronLeft, ChevronRight, Anchor, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';

const SailorShowcase = () => {
  const navigate = useNavigate();
  // Filter for Sailor Piece items
  const items = mm2Items.filter(item => item.category === 'Sailor Piece').slice(0, 10);

  if (items.length === 0) return null;

  return (
    <section className="py-32 relative overflow-hidden bg-[#0a0a0f]">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full" />
      
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/30">
              <Anchor className="w-8 h-8 text-gold shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
            </div>
            <div>
              <h2 className="text-4xl font-black font-bebas tracking-widest uppercase leading-none mb-2">TESOUROS DE <span className="text-gold">SAILOR</span></h2>
              <p className="text-gray-500 font-bebas text-xl tracking-[0.2em] uppercase">Materiais e Contas de Nível Mítico</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="sailor-prev w-14 h-14 border border-gold/20 rounded-xl flex items-center justify-center hover:bg-gold/10 transition-all text-gold/50 hover:text-gold">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button className="sailor-next w-14 h-14 border border-gold/20 rounded-xl flex items-center justify-center hover:bg-gold/10 transition-all text-gold/50 hover:text-gold">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          autoplay={{ delay: 5000 }}
          navigation={{
            prevEl: '.sailor-prev',
            nextEl: '.sailor-next',
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }}
          className="sailor-swiper"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div 
                onClick={() => navigate(`/produto/${item.slug}`)}
                className="group relative glass-card p-8 rounded-[40px] border-gold/10 hover:border-gold/40 transition-all duration-700 h-[480px] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent"
              >
                {/* Gold Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold fill-current animate-pulse" />
                  <span className="font-bebas text-sm tracking-widest text-gold/70">MÍTICO</span>
                </div>

                <div className="w-full h-56 flex items-center justify-center mb-8 relative z-10">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-700"
                  />
                </div>

                <div className="text-center relative z-10 w-full">
                  <h3 className="text-2xl font-black mb-4 font-bebas tracking-widest truncate w-full px-4 text-white group-hover:text-gold transition-colors">{item.name}</h3>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-gold/20" />
                    <div className="text-2xl md:text-3xl font-black text-gold font-bebas tracking-tighter whitespace-nowrap">R$ {item.price.toFixed(2).replace('.', ',')}</div>
                    <div className="h-px w-8 bg-gold/20" />
                  </div>
                </div>

                <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                  <div className="bg-gold text-black px-6 py-2 rounded-lg font-bebas text-lg tracking-widest">
                    RESGATAR TESOURO
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SailorShowcase;
