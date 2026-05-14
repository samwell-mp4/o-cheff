import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import mm2Items from '../data/mm2Items';
import ItemCard from './ItemCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Flame, Sparkles, Box, Shield, Ghost } from 'lucide-react';

// Styles
import 'swiper/css';
import 'swiper/css/free-mode';

const categories = [
  { id: 'Todos', name: 'TODOS', icon: <LayoutGrid className="w-5 h-5" /> },
  { id: 'Godly', name: 'GODLY', icon: <Flame className="w-5 h-5" /> },
  { id: 'Chroma', name: 'CHROMA', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'Set', name: 'SETS', icon: <Box className="w-5 h-5" /> },
  { id: 'Valued', name: 'VALUED', icon: <Shield className="w-5 h-5" /> },
  { id: 'Pet', name: 'PETS', icon: <Ghost className="w-5 h-5" /> },
];

const Catalog = ({ searchQuery, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredItems = mm2Items.filter(item => {
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalog" className="container py-32">
      {/* Header & Category Selection */}
      <div className="flex flex-col gap-12 mb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-12">
          <div className="relative text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 italic">
              DATABASE DE <span className="neon-cyan">ITENS</span>
            </h2>
            <p className="font-bebas text-2xl text-[#888888] tracking-widest uppercase">
              FILTRANDO <span className="text-white">{filteredItems.length}</span> ARQUIVOS DE ELITE
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={16}
              freeMode={true}
              modules={[FreeMode]}
              className="category-swiper"
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat.id} className="w-auto">
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bebas text-xl tracking-widest transition-all border whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                        : 'bg-white/5 text-[#888888] border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {cat.icon}
                    {cat.name}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
      >
        <AnimatePresence mode='popLayout'>
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 glass-card rounded-[40px] border-dashed border-white/10"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="w-10 h-10 text-gray-700" />
          </div>
          <p className="font-bebas text-3xl text-[#888888] tracking-widest uppercase italic">
            Nenhum item correspondente nos servidores
          </p>
          <button 
            onClick={() => setActiveCategory('Todos')}
            className="mt-8 text-neon-cyan font-bebas text-xl tracking-widest hover:underline"
          >
            RESETAR FILTROS
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default Catalog;
