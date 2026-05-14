import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Search, Filter, SlidersHorizontal, LayoutGrid, List, ArrowUpDown, 
  Anchor, Flame, Sparkles, Box, Shield, Ghost, X, ChevronRight,
  Target, Zap, Clock, Star, Gem, Eye
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import ItemCard from '../components/ItemCard';
import { Helmet } from 'react-helmet-async';

const Shop = ({ searchQuery: navSearch, onAddToCart }) => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeRarity, setActiveRarity] = useState('Todas');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('latest');
  const [localSearch, setLocalSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('q');
    
    if (categoryParam) setActiveCategory(categoryParam);
    if (searchParam) setLocalSearch(searchParam);
  }, [location]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Erro Supabase Shop:", error);
        alert("Erro ao carregar produtos: " + error.message);
      } else if (data) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Erro fatal Shop:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'Todos', name: 'Todos os Itens', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'Godly', name: 'Murder Mystery 2', icon: <Flame className="w-5 h-5" /> },
    { id: 'Sailor Piece', name: 'Sailor Piece', icon: <Anchor className="w-5 h-5" /> },
    { id: 'Chroma', name: 'Chromas Skins', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'Ancient', name: 'Ancients', icon: <Gem className="w-5 h-5" /> },
  ];

  const rarities = ['Todas', 'Common', 'Uncommon', 'Rare', 'Legendary', 'Godly', 'Ancient', 'Unique'];

  const filteredItems = useMemo(() => {
    return products.filter(item => {
      const name = item?.name || '';
      const query = (localSearch || navSearch || '').toLowerCase();
      const matchesSearch = name.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
      const matchesRarity = activeRarity === 'Todas' || item.rarity === activeRarity;
      const matchesStock = !onlyInStock || (item.stock > 0);
      const matchesPrice = (item.price || 0) >= priceRange[0] && (item.price || 0) <= priceRange[1];

      return matchesSearch && matchesCategory && matchesRarity && matchesStock && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'az') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'latest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      return 0;
    });
  }, [products, activeCategory, activeRarity, onlyInStock, priceRange, sortBy, localSearch, navSearch]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <Helmet>
        <title>Shop | O Chefão dos Cards - Loja Oficial MM2 e Sailor Piece</title>
        <meta name="description" content="Explore nosso inventário completo de itens Murder Mystery 2 e Sailor Piece com filtros avançados." />
      </Helmet>

      <section className="container">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-16">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 leading-none font-gamer">
              NOSSO <span className="neon-cyan">SHOP</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-neon-cyan shadow-[0_0_10px_#00FFFF]" />
              <p className="font-bebas text-xl text-gray-400 tracking-widest uppercase">
                {filteredItems.length} ITENS FILTRADOS
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
             <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="BUSCAR ITEM ESPECÍFICO..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bebas tracking-widest focus:outline-none focus:border-neon-cyan/50 transition-all text-lg"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
             </div>
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className="lg:hidden w-full flex items-center justify-center gap-2 bg-neon-cyan text-black py-5 rounded-2xl font-bebas text-xl tracking-widest uppercase shadow-[0_0_20px_#00FFFF44]"
             >
               <Filter className="w-6 h-6" /> FILTROS
             </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Advanced Sidebar Filters */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-40 space-y-12">
              {/* Categories */}
              <div>
                <h3 className="font-bebas text-2xl tracking-widest text-white mb-6 flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5 text-neon-cyan" /> CATEGORIAS
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl font-bebas text-lg tracking-widest border transition-all ${
                        activeCategory === cat.id 
                          ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.05)]' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {cat.icon}
                        <span>{cat.name}</span>
                      </div>
                      {activeCategory === cat.id && <Zap className="w-4 h-4 fill-current animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity Filter */}
              <div>
                <h3 className="font-bebas text-2xl tracking-widest text-white mb-6 flex items-center gap-3">
                  <Star className="w-5 h-5 text-gold" /> RARIDADE
                </h3>
                <div className="grid grid-cols-2 gap-2">
                   {rarities.map(rarity => (
                     <button
                        key={rarity}
                        onClick={() => setActiveRarity(rarity)}
                        className={`p-3 rounded-xl font-bebas text-sm tracking-widest border transition-all ${
                          activeRarity === rarity 
                            ? 'bg-gold/10 border-gold text-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]' 
                            : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                        }`}
                     >
                       {rarity}
                     </button>
                   ))}
                </div>
              </div>

              {/* Stock Toggle */}
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Clock className="w-5 h-5 text-neon-green" />
                       <span className="font-bebas text-xl tracking-widest text-gray-300">EM ESTOQUE</span>
                    </div>
                    <button 
                      onClick={() => setOnlyInStock(!onlyInStock)}
                      className={`w-12 h-6 rounded-full transition-all relative ${onlyInStock ? 'bg-neon-green' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${onlyInStock ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>
              </div>

              {/* Price Slider */}
              <div>
                <h3 className="font-bebas text-2xl tracking-widest text-white mb-6 flex items-center gap-3">
                  <ArrowUpDown className="w-5 h-5 text-neon-purple" /> PREÇO MÁXIMO
                </h3>
                <div className="space-y-6 px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    step="10"
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

              {/* Sort By */}
              <div>
                <h3 className="font-bebas text-2xl tracking-widest text-white mb-6 uppercase">ORDENAR POR</h3>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 font-bebas text-xl tracking-widest text-white focus:outline-none focus:border-neon-cyan/50"
                >
                  <option value="latest">Lançamentos</option>
                  <option value="price-low">Menor Preço</option>
                  <option value="price-high">Maior Preço</option>
                  <option value="az">Nome (A-Z)</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Grid Area */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-[32px] border border-white/5" />
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
                <AnimatePresence mode='popLayout'>
                  {filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 glass-card rounded-[40px] text-center border-dashed border-white/10 mx-auto max-w-2xl">
                <Ghost className="w-20 h-20 text-gray-700 mb-8 opacity-20" />
                <h2 className="font-bebas text-5xl text-gray-500 tracking-widest mb-6">NADA POR AQUI...</h2>
                <p className="text-gray-600 mb-10 max-w-sm uppercase font-bold text-xs tracking-widest leading-loose px-6">
                  Nenhum item corresponde aos filtros selecionados. Tente expandir sua busca ou mudar a categoria.
                </p>
                <button 
                  onClick={() => {
                    setActiveCategory('Todos');
                    setActiveRarity('Todas');
                    setLocalSearch('');
                    setOnlyInStock(false);
                    setPriceRange([0, 1000]);
                  }}
                  className="bg-white/5 border border-white/10 px-8 py-4 rounded-xl text-neon-cyan font-bebas text-2xl tracking-widest hover:bg-neon-cyan/10 transition-all uppercase"
                >
                  LIMPAR TODOS OS FILTROS
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed inset-x-0 bottom-0 max-h-[90vh] bg-[#05050a] border-t border-white/10 p-10 z-[101] lg:hidden overflow-y-auto rounded-t-[40px]"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-bebas text-4xl tracking-widest text-white">REFINAR BUSCA</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-3 bg-white/5 rounded-full"><X className="w-8 h-8 text-gray-400" /></button>
              </div>

              <div className="space-y-12">
                <div>
                   <h3 className="font-bebas text-2xl tracking-widest text-gray-500 mb-6 uppercase">Categorias</h3>
                   <div className="flex flex-wrap gap-3">
                      {categories.map(cat => (
                        <button 
                          key={cat.id} 
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-6 py-3 rounded-xl font-bebas text-lg tracking-widest border transition-all ${activeCategory === cat.id ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 border-white/10 text-gray-400'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <h3 className="font-bebas text-2xl tracking-widest text-gray-500 mb-6 uppercase">Preço Máximo: <span className="text-neon-cyan ml-2">R$ {priceRange[1]}</span></h3>
                   <input 
                     type="range" 
                     min="0" 
                     max="1000" 
                     value={priceRange[1]}
                     onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                     className="w-full accent-neon-cyan h-2 bg-white/10 rounded-full appearance-none"
                   />
                </div>

                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-neon-cyan text-black py-6 rounded-2xl font-bebas text-3xl tracking-widest shadow-[0_0_30px_#00FFFF66] uppercase italic"
                >
                  MOSTRAR RESULTADOS
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
