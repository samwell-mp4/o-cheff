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
                onClick={() => navigate(`/produto/${item.slug}`)}
                className="glass-card rounded-3xl p-6 group cursor-pointer border-white/5 hover:border-neon-cyan/30 transition-all"
              >
                <div className="h-40 flex items-center justify-center mb-4">
                  <img src={item.image} alt={item.name} className="h-full object-contain group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-sm truncate mb-1">{item.name}</h3>
                  <div className="text-neon-cyan font-bebas tracking-widest">R$ {parseFloat(item.price).toFixed(2)}</div>
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
