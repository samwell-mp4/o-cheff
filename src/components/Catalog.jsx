import React, { useState } from 'react';
import mm2Items from '../data/mm2Items';
import ItemCard from './ItemCard';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['Todos', 'Godly', 'Valued', 'Set', 'Chroma', 'Pet'];

const Catalog = ({ searchQuery, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredItems = mm2Items.filter(item => {
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalog" className="container py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
        <div className="relative">
          <div className="absolute -left-6 top-0 w-2 h-full bg-[#00FFFF] shadow-[0_0_15px_#00FFFF]" />
          <h2 className="text-5xl font-black tracking-tighter mb-2">CATÁLOGO DE <span className="neon-cyan">ELITE</span></h2>
          <p className="font-bebas text-2xl text-[#888888] tracking-widest uppercase">
            Sincronizando <span className="text-white">{filteredItems.length}</span> registros ativos
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2 rounded-sm font-bebas text-xl tracking-widest transition-all ${
                activeCategory === cat
                  ? 'bg-[#00FFFF] text-black shadow-[0_0_20px_#00FFFF]'
                  : 'bg-white/5 text-[#888888] hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <AnimatePresence mode='popLayout'>
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="text-center py-40 glass-card rounded-3xl border-dashed">
          <p className="font-bebas text-3xl text-[#888888] animate-pulse tracking-widest uppercase">
            Nenhum registro encontrado no servidor central.
          </p>
        </div>
      )}
    </section>
  );
};

export default Catalog;
