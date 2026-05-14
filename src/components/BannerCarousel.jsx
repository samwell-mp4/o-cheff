import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { supabase } from '../lib/supabaseClient';

// Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();

    const channel = supabase
      .channel('public-banners')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, () => {
        fetchBanners();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (data) setBanners(data);
    setLoading(false);
  };

  if (loading || banners.length === 0) return null;

  return (
    <section className="relative w-full pt-24 sm:pt-32">
      <div className="container px-4">
        <Swiper
          spaceBetween={30}
          effect={'fade'}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Autoplay, Pagination, EffectFade]}
          className="banner-swiper rounded-[20px] sm:rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id}>
              <div className="relative aspect-[21/9] w-full overflow-hidden group">
                <img 
                  src={banner.url} 
                  alt={`Promoção ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-purple/10" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BannerCarousel;
