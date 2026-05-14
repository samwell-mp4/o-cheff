import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import mm2Items from '../data/mm2Items';
import ItemCard from './ItemCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Flame, Sparkles, Box, Shield, Ghost, ChevronLeft, ChevronRight, Anchor } from 'lucide-react';

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
  { id: 'Sailor Piece', name: 'SAILOR', icon: <Anchor className="w-5 h-5" /> },
];

const ITEMS_PER_PAGE = 12;

const Catalog = ({ searchQuery, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = mm2Items.filter(item => {
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section id="catalog" className="container py-32">
      {/* Header - STACKED FOR MAXIMUM COMPATIBILITY AND FORMAL LOOK */}
      <div className="mb-20 border-b border-white/5 pb-16">
        <div className="flex flex-col gap-10">
          {/* Title Row */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none mb-4">
                <span className="neon-cyan">ITENS</span>
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="h-1 w-12 bg-neon-cyan shadow-[0_0_10px_#00FFFF]" />
                <p className="font-bebas text-xl md:text-2xl text-[#888888] tracking-[0.2em] uppercase">
                  DATABASE <span className="text-white">ATIVA</span> | {filteredItems.length} REGISTROS
                </p>
              </div>
            </div>
            
            {/* Search metadata info */}
            <div className="hidden md:block text-right">
              <div className="text-[#444] font-bebas text-sm tracking-[0.3em] uppercase mb-1">Status do Sistema</div>
              <div className="text-neon-green font-bebas text-lg tracking-widest flex items-center justify-end gap-2">
                <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                SINCRONIZADO
              </div>
            </div>
          </div>

          {/* Filters Row - Full Width Slider */}
          <div className="w-full">
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={12}
              freeMode={true}
              modules={[FreeMode]}
              className="category-swiper"
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat.id} className="!w-auto">
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bebas text-xl md:text-2xl tracking-widest transition-all border whitespace-nowrap min-w-[120px] md:min-w-[150px] justify-center ${
                      activeCategory === cat.id
                        ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                        : 'bg-white/5 text-[#888888] border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span className="shrink-0">{cat.icon}</span>
                    <span>{cat.name}</span>
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 min-h-[600px]"
      >
        <AnimatePresence mode='popLayout'>
          {paginatedItems.map((item) => (
            <ItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-20 flex items-center justify-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-xl hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-xl font-bebas text-xl tracking-widest transition-all border ${
                  currentPage === i + 1
                    ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_15px_#00FFFF]'
                    : 'bg-white/5 text-[#888888] border-white/10 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-xl hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

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
