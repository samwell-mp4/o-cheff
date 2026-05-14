import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import mm2Items from '../data/mm2Items';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Styles
import 'swiper/css';
import 'swiper/css/navigation';

const ShowcaseCarousel = () => {
  const navigate = useNavigate();
  // Get unique Godlies or sets
  const items = mm2Items.filter(item => item.category === 'Set' || item.category === 'Godly').slice(10, 20);

  return (
    <section className="py-32 bg-white/[0.02] border-y border-white/5">
      <div className="container relative">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-neon-purple/20 rounded-2xl flex items-center justify-center border border-neon-purple/30">
              <Zap className="w-8 h-8 text-neon-purple shadow-[0_0_10px_#BF00FF]" />
            </div>
            <div>
              <h2 className="text-4xl font-black font-gamer tracking-tighter uppercase leading-none mb-2">GALERIA DE <span className="neon-purple">ELITE</span></h2>
              <p className="text-[#888888] font-bebas text-xl tracking-[0.2em] uppercase">Sincronização global de inventário</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="showcase-prev w-14 h-14 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-gray-500 hover:text-white">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button className="showcase-next w-14 h-14 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-gray-500 hover:text-white">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          autoplay={{ delay: 4000 }}
          navigation={{
            prevEl: '.showcase-prev',
            nextEl: '.showcase-next',
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }}
          className="showcase-swiper"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div 
                onClick={() => navigate(`/produto/${item.slug}`)}
                className="group relative glass-card p-6 rounded-[32px] border-white/10 hover:border-neon-purple/30 transition-all duration-500 h-[420px] flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                
                <div className="w-full h-48 flex items-center justify-center mb-6 relative z-10">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="text-center relative z-10">
                  <div className="text-xs font-bebas tracking-[0.3em] text-[#888888] mb-2 uppercase">{item.category}</div>
                  <h3 className="text-2xl font-black mb-4 font-gamer tracking-tighter truncate w-full px-4">{item.name}</h3>
                  <div className="text-xl md:text-2xl font-black neon-gold font-bebas whitespace-nowrap">R$ {item.price.toFixed(2).replace('.', ',')}</div>
                </div>

                <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-neon-purple font-bebas text-lg tracking-[0.2em] flex items-center gap-2">
                    DETALHES <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ShowcaseCarousel;
