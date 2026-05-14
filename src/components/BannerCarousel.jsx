import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const FALLBACK_BANNERS = [
  {
    id: 'fallback-1',
    url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2070',
    title: 'A LOJA Nº 1 DE ITENS DO BRASIL',
    subtitle: 'Itens Lendários, Godlys e Chromas de Murder Mystery 2 e Sailor Piece com entrega automatizada e segura.'
  },
  {
    id: 'fallback-2',
    url: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb3c?auto=format&fit=crop&q=80&w=2070',
    title: 'MURDER MYSTERY 2 & SAILOR PIECE',
    subtitle: 'Os melhores preços do mercado com a confiança de quem já entregou milhares de pedidos.'
  }
];

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();

    // Listener para atualizações em tempo real
    const channel = supabase
      .channel('public:banners')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, fetchBanners)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        setBanners(data);
      } else {
        setBanners(FALLBACK_BANNERS);
      }
    } catch (err) {
      console.error("Erro ao carregar banners:", err);
      setBanners(FALLBACK_BANNERS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-[85vh] sm:h-[90vh] bg-[#050510] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={true}
        className="h-full w-full"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-full w-full group">
              {/* Background Image with Zoom Effect */}
              <div className="absolute inset-0 transition-transform duration-[10000ms] ease-out scale-110 group-hover:scale-100">
                <img 
                  src={banner.url} 
                  alt={banner.title || 'Promoção'} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050510] via-transparent to-transparent opacity-80" />
              </div>

              {/* Content */}
              <div className="container relative h-full flex flex-col justify-center items-start z-10 px-6 sm:px-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-4xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-12 bg-neon-cyan" />
                    <span className="font-bebas text-xl sm:text-2xl tracking-[0.3em] text-neon-cyan drop-shadow-[0_0_10px_#00FFFF]">
                      NOVIDADE EXCLUSIVA
                    </span>
                  </div>

                  <h2 className="text-6xl sm:text-8xl md:text-9xl font-black italic font-gamer tracking-tighter leading-[0.9] text-white mb-8">
                    {banner.title || "O REINO DOS CARDS"}
                  </h2>

                  <p className="text-gray-400 font-bebas text-xl sm:text-2xl md:text-3xl tracking-widest max-w-2xl mb-12 leading-relaxed uppercase">
                    {banner.subtitle || banner.description || "Itens Lendários, Godlys e Chromas com entrega automatizada."}
                  </p>

                  <div className="flex flex-wrap gap-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/shop')}
                      className="group bg-neon-cyan text-black px-10 py-5 rounded-2xl font-gamer font-black text-2xl tracking-tighter flex items-center gap-3 shadow-[0_0_30px_#00FFFF44] hover:shadow-[0_0_50px_#00FFFF66] transition-all"
                    >
                      VER INVENTÁRIO
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-20 right-20 hidden lg:block">
                <div className="relative">
                  <div className="w-32 h-32 border border-white/10 rounded-full animate-spin-slow flex items-center justify-center">
                    <Zap className="text-[#00FFFF] w-12 h-12 drop-shadow-[0_0_15px_#00FFFF]" />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <span className="font-bebas text-xs tracking-[0.4em] text-gray-500 uppercase">Explorar</span>
        <div className="w-px h-12 bg-gradient-to-b from-neon-cyan to-transparent" />
      </div>
    </section>
  );
};

export default BannerCarousel;
