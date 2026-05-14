import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, LayoutGrid, List, ArrowUpDown, Anchor, Flame, Sparkles, Box, Shield, Ghost, X, ChevronRight } from 'lucide-react';
import mm2Items from '../data/mm2Items';
import ItemCard from '../components/ItemCard';
import { Helmet } from 'react-helmet-async';

const Shop = ({ searchQuery: navSearch, onAddToCart }) => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeSubCategory, setActiveSubCategory] = useState('Todos');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('popular');
  const [localSearch, setLocalSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('q');
    
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (searchParam) {
      setLocalSearch(searchParam);
    }
  }, [location]);

  const categories = [
    { id: 'Todos', name: 'Todos os Itens', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'Godly', name: 'Murder Mystery 2', icon: <Flame className="w-5 h-5" />, subCategories: ['Todos', 'Godly', 'Chroma', 'Set', 'Valued', 'Pet'] },
    { id: 'Sailor Piece', name: 'Sailor Piece', icon: <Anchor className="w-5 h-5" /> },
  ];

  const filteredItems = useMemo(() => {
    return mm2Items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes((localSearch || navSearch).toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || 
                             (activeCategory === 'Godly' ? (item.category !== 'Sailor Piece') : (item.category === activeCategory));
      
      const matchesSubCategory = activeSubCategory === 'Todos' || item.category === activeSubCategory;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesSubCategory && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      return 0; // popular/default
    });
  }, [activeCategory, activeSubCategory, priceRange, sortBy, localSearch, navSearch]);

  const subCats = activeCategory === 'Godly' ? categories[1].subCategories : [];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <Helmet>
        <title>Shop | O Chefão dos Cards - Loja Oficial MM2 e Sailor Piece</title>
        <meta name="description" content="Explore nosso inventário completo de itens Murder Mystery 2 e Sailor Piece. Use filtros avançados para encontrar Godlys, Chromas e Sets exclusivos." />
      </Helmet>

      {/* Header Section */}
      <section className="container mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 leading-none">
              NOSSO <span className="neon-cyan">SHOP</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-neon-cyan shadow-[0_0_10px_#00FFFF]" />
              <p className="font-bebas text-xl text-gray-400 tracking-widest uppercase">
                {filteredItems.length} ITENS ENCONTRADOS NO INVENTÁRIO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input 
                type="text" 
                placeholder="PROCURAR NO SHOP..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-12 text-white font-bebas tracking-widest focus:outline-none focus:border-neon-cyan/50 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`md:hidden p-4 rounded-xl border transition-all ${isFilterOpen ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 border-white/10 text-white'}`}
            >
              <Filter className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-40 space-y-10">
              {/* Categories */}
              <div>
                <h3 className="font-bebas text-2xl tracking-widest text-white mb-6 flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5 text-neon-cyan" /> CATEGORIAS
                </h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setActiveSubCategory('Todos');
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-xl font-bebas text-xl tracking-widest border transition-all ${
                        activeCategory === cat.id 
                          ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.1)]' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {cat.icon}
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === cat.id ? 'rotate-90' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub Categories for MM2 */}
              <AnimatePresence>
                {activeCategory === 'Godly' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <h3 className="font-bebas text-2xl tracking-widest text-white mb-6 flex items-center gap-3">
                      <SlidersHorizontal className="w-5 h-5 text-neon-purple" /> TIPO DE ITEM
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {subCats.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setActiveSubCategory(sub)}
                          className={`p-3 rounded-lg font-bebas text-lg tracking-widest border transition-all ${
                            activeSubCategory === sub
                              ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(191,0,255,0.2)]'
                              : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Price Filter */}
              <div>
                <h3 className="font-bebas text-2xl tracking-widest text-white mb-6 flex items-center gap-3">
                  <ArrowUpDown className="w-5 h-5 text-neon-gold" /> PREÇO (R$)
                </h3>
                <div className="space-y-6 px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="500" 
                    step="5"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-neon-cyan h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center justify-between font-bebas text-xl tracking-widest text-gray-400">
                    <span>R$ 0</span>
                    <span className="text-neon-cyan">ATÉ R$ {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h3 className="font-bebas text-2xl tracking-widest text-white mb-6">ORDENAR POR</h3>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bebas text-xl tracking-widest text-white focus:outline-none focus:border-neon-cyan/50"
                >
                  <option value="popular">MAIS POPULARES</option>
                  <option value="price-low">MENOR PREÇO</option>
                  <option value="price-high">MAIOR PREÇO</option>
                  <option value="az">NOME (A-Z)</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Mobile Filters Trigger Placeholder (Hidden on Desktop) */}
            <div className="lg:hidden mb-8 overflow-x-auto pb-4 no-scrollbar">
              <div className="flex gap-3 min-w-max">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bebas text-lg tracking-widest border transition-all ${
                      activeCategory === cat.id ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            {filteredItems.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8"
              >
                <AnimatePresence mode='popLayout'>
                  {filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 glass-card rounded-[40px] text-center border-dashed border-white/10">
                <Search className="w-16 h-16 text-gray-700 mb-6" />
                <h2 className="font-bebas text-4xl text-gray-500 tracking-widest mb-4">NENHUM ITEM ENCONTRADO</h2>
                <p className="text-gray-600 mb-8 max-w-sm">Tente ajustar seus filtros ou termos de pesquisa para encontrar o que procura.</p>
                <button 
                  onClick={() => {
                    setActiveCategory('Todos');
                    setActiveSubCategory('Todos');
                    setLocalSearch('');
                    setPriceRange([0, 500]);
                  }}
                  className="text-neon-cyan font-bebas text-2xl tracking-widest hover:underline"
                >
                  LIMPAR TODOS OS FILTROS
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-[#050505] border-l border-white/10 p-8 z-[101] lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-bebas text-3xl tracking-widest text-white">FILTROS</h2>
                <button onClick={() => setIsFilterOpen(false)}><X className="w-8 h-8 text-gray-400" /></button>
              </div>

              {/* Duplicate Filters for Mobile in the Sidebar */}
              <div className="space-y-12">
                <div>
                  <h3 className="font-bebas text-xl tracking-widest text-gray-500 mb-4 uppercase">Ordenar</h3>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bebas text-xl text-white"
                  >
                    <option value="popular">POPULARES</option>
                    <option value="price-low">MENOR PREÇO</option>
                    <option value="price-high">MAIOR PREÇO</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-bebas text-xl tracking-widest text-gray-500 mb-4 uppercase">Preço Máximo</h3>
                  <input 
                    type="range" 
                    min="0" 
                    max="500" 
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-neon-cyan mb-4"
                  />
                  <div className="font-bebas text-2xl text-neon-cyan">R$ {priceRange[1]}</div>
                </div>

                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-neon-cyan text-black py-4 rounded-xl font-bebas text-2xl tracking-widest shadow-[0_0_20px_#00FFFF66]"
                >
                  APLICAR FILTROS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
