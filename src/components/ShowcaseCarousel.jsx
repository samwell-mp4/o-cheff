import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Styles
import 'swiper/css';
import 'swiper/css/free-mode';

const ShowcaseCarousel = () => {
  const navigate = useNavigate();
  const [showcaseItems, setShowcaseItems] = useState([]);

  useEffect(() => {
    const fetchShowcase = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(8);
      if (data) setShowcaseItems(data);
    };
    fetchShowcase();
  }, []);

  if (showcaseItems.length === 0) return null;

  return (
    <section className="py-20 bg-black/40">
      <div className="container">
        <h2 className="text-3xl font-black mb-12 tracking-tighter border-l-4 border-neon-cyan pl-6 uppercase">
          VITRINE <span className="neon-cyan">GODLY</span>
        </h2>
        
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          freeMode={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          modules={[Autoplay, FreeMode]}
          className="showcase-swiper"
        >
          {showcaseItems.map((item) => (
            <SwiperSlide key={item.id}>
              <div 
                onClick={() => navigate(`/produto/${item.slug || item.id}`)}
                className="glass-card rounded-[32px] p-8 group cursor-pointer border border-white/5 hover:border-neon-cyan/40 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] transition-all duration-500"
              >
                <div className="h-48 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-neon-cyan/5 blur-3xl rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-gamer text-lg font-bold tracking-tight truncate text-white/90 group-hover:text-neon-cyan transition-colors">{item.name}</h3>
                  <div className="text-2xl font-black text-white flex items-center justify-center gap-2">
                    <span className="text-xs text-gray-500 font-bebas tracking-tighter">R$</span>
                    {parseFloat(item.price).toFixed(2)}
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

export default ShowcaseCarousel;
