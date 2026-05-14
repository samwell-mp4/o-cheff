import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { Zap, ShoppingCart, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const PromotionsCarousel = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [promoItems, setPromoItems] = useState([]);

  useEffect(() => {
    const fetchPromos = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .or('category.eq.Chroma,category.eq.Valued')
        .eq('is_active', true)
        .limit(6);
      if (data) setPromoItems(data);
    };
    fetchPromos();
  }, []);

  if (promoItems.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase italic">
            OFERTAS <span className="neon-cyan">EXPLOSIVAS</span>
          </h2>
          <div className="w-24 h-1 bg-neon-cyan shadow-[0_0_10px_#00FFFF]" />
        </div>

        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="promo-swiper py-12"
        >
          {promoItems.map((item) => (
            <SwiperSlide key={item.id} className="w-[280px] sm:w-[350px] md:w-[450px]">
              <div 
                onClick={() => navigate(`/produto/${item.slug}`)}
                className="glass-card rounded-[40px] p-8 md:p-12 relative group border-neon-purple/30 cursor-pointer"
              >
                <div className="absolute top-6 right-6">
                  <div className="bg-neon-purple text-white px-4 py-1 rounded-full font-bebas text-lg tracking-widest animate-pulse shadow-[0_0_15px_#BF00FF]">
                    HOT DEAL
                  </div>
                </div>
                
                <div className="w-full h-48 md:h-64 flex items-center justify-center mb-8">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-2xl md:text-4xl font-black mb-2 font-gamer tracking-tighter truncate px-4">{item.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Star className="w-4 h-4 text-gold fill-current" />
                    <span className="text-[#888888] font-bebas tracking-widest text-lg uppercase">{item.category}</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xl md:text-2xl font-black neon-gold font-bebas whitespace-nowrap">R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}</div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item);
                      }}
                      className="btn-viral px-6 h-12 flex items-center gap-2 text-lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      PEGAR AGORA
                    </button>
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

export default PromotionsCarousel;
