import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ItemCard from '../components/ItemCard';
import SEO from '../components/SEO';
import FAQ from '../components/FAQ';
import { ChevronLeft, ShoppingCart, ShieldCheck, Zap, ImageOff, Trophy, Star, Plus, Minus, MessageSquare, User, Home as HomeIcon, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetails = ({ onAddToCart }) => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (data) {
      setItem(data);
      // Fetch recommendations
      const { data: recs } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(4);
      setRecommendations(recs || []);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-6 uppercase">REGISTRO NÃO ENCONTRADO</h2>
          <Link to="/" className="text-neon-cyan font-bebas text-2xl hover:underline uppercase">VOLTAR PARA A DATABASE</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 relative overflow-hidden">
      <SEO item={item} />
      <div className="cinematic-rays" />
      
      <div className="container relative z-10">
        {/* Breadcrumb Visual */}
        <nav className="flex items-center gap-4 mb-8 text-xs font-bebas tracking-[0.2em] text-[#888888]">
          <Link to="/shop" className="hover:text-white flex items-center gap-1">
            <HomeIcon className="w-3 h-3" /> VOLTAR AO SHOP
          </Link>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <Link to={`/shop?category=${item.category === 'Sailor Piece' ? 'Sailor Piece' : 'Godly'}`} className="hover:text-white cursor-pointer uppercase">
            {item.category}
          </Link>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <span className="text-neon-cyan uppercase truncate max-w-[150px] sm:max-w-none">{item.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-32">
          {/* Elite Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-[40px] p-16 flex items-center justify-center relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/10 to-[#BF00FF]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {imgError ? (
              <div className="flex flex-col items-center text-gray-800 gap-4">
                <ImageOff className="w-32 h-32" />
                <span className="font-bebas text-2xl">PREVIEW OFFLINE</span>
              </div>
            ) : (
              <img 
                src={item.image} 
                alt={`${item.name} original ${item.category} comprar online`}
                fetchpriority="high"
                decoding="async"
                width="500"
                height="500"
                onError={() => setImgError(true)}
                className="w-full max-w-[500px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all duration-700" 
              />
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-[#00FFFF] text-black px-4 py-1 rounded-sm font-bebas text-xl tracking-widest shadow-[0_0_15px_#00FFFF]">
                {item.category}
              </span>
              <div className="indicator-success font-bebas text-xl tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00FF00] rounded-full animate-ping" />
                {item.stock > 0 ? 'ESTOQUE DISPONÍVEL' : 'SEM ESTOQUE'}
              </div>
            </div>

            <h1 className={`${item.name.length > 40 ? 'text-xl sm:text-2xl md:text-4xl' : 'text-2xl sm:text-3xl md:text-5xl'} font-black mb-6 tracking-tight leading-tight uppercase font-bebas`}>
              {item.name}
            </h1>
            
            <div className="text-6xl font-black neon-gold font-bebas tracking-tighter mb-10">
              R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}
            </div>

            <div className="mb-12 border-l-4 border-[#00FFFF]/30 pl-8">
              <h2 className="text-2xl font-bebas tracking-widest mb-4">DESCRIÇÃO DO ITEM</h2>
              <div className="text-[#E0E0E0] text-xl leading-relaxed font-light">
                <p className={!showFullDescription && item.name.length > 50 ? "line-clamp-3" : ""}>
                  Adquira agora a lendária <span className="font-bold text-white">{item.name}</span> original de Murder Mystery 2. 
                  Garantimos a melhor procedência e entrega segura via trade oficial. Perfeito para colecionadores de elite.
                </p>
                {!showFullDescription && item.name.length > 50 && (
                  <button 
                    onClick={() => setShowFullDescription(true)}
                    className="text-neon-cyan font-bebas tracking-widest mt-2 hover:underline"
                  >
                    VER TUDO...
                  </button>
                )}
              </div>
              <ul className="mt-6 space-y-2 text-[#888888] font-bebas text-lg tracking-widest">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-neon-cyan" /> ENTREGA IMEDIATA</li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-neon-cyan" /> GARANTIA VITALÍCIA</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-neon-cyan" /> ITEM 100% ORIGINAL</li>
                <li className="flex items-center gap-2"><Package className="w-4 h-4 text-neon-green" /> {item.stock} UNIDADES EM ESTOQUE</li>
              </ul>
            </div>

            {/* Quantity and Cart */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-2 h-16">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-12 h-full flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-16 bg-transparent text-center text-2xl font-bold font-gamer"
                />
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, Math.min(item.stock, prev + 1)))}
                  className="w-12 h-full flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <button 
                onClick={() => item.stock > 0 && onAddToCart(item, quantity)}
                disabled={item.stock <= 0}
                className={`btn-viral flex-1 h-16 flex items-center justify-center gap-4 text-2xl ${item.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                <ShoppingCart className="w-8 h-8" />
                {item.stock > 0 ? 'COMPRAR AGORA' : 'ESGOTADO'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-[#888888] font-bebas text-lg tracking-widest uppercase">
                <ShieldCheck className="w-5 h-5 text-[#00FFFF]" />
                Checkout Seguro & Oficial
              </div>
              <div className="flex items-center gap-3 text-[#888888] font-bebas text-lg tracking-widest uppercase">
                <Zap className="w-5 h-5 text-[#BF00FF]" />
                Entrega Flash (5-10min)
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <section className="mb-32">
            <h2 className="text-4xl font-black mb-12 tracking-tighter border-l-4 border-neon-cyan pl-6">
              PRODUTOS <span className="neon-cyan">RELACIONADOS</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendations.map(recItem => (
                <ItemCard key={recItem.id} item={recItem} onAddToCart={onAddToCart} />
              ))}
            </div>
          </section>
        )}

        {/* Global FAQ - Discreet Variant */}
        <FAQ variant="discreet" />
      </div>
    </div>
  );
};

export default ProductDetails;
