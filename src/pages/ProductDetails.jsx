import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import mm2Items from '../data/mm2Items';
import ItemCard from '../components/ItemCard';
import { ChevronLeft, ShoppingCart, ShieldCheck, Zap, ImageOff, Trophy, Star, Plus, Minus, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

const commentsData = [
  { id: 1, user: "GamerPro99", text: "Entrega super rápida! Recebi meu item em 5 minutos. Recomendo demais o Chefão.", rating: 5, date: "Hoje" },
  { id: 2, user: "RobloxKing", text: "Melhor preço do mercado. Comprei um Set Chroma e veio certinho.", rating: 5, date: "Ontem" },
  { id: 3, user: "Lari_MM2", text: "Vendedor confiável. Fiquei com receio no início mas o suporte no zap é nota 10.", rating: 4, date: "2 dias atrás" },
];

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const item = mm2Items.find(i => i.id === parseInt(id));
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Recommendations: same category, excluding current item, limit 4
  const recommendations = mm2Items
    .filter(i => i.category === item?.category && i.id !== item?.id)
    .slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setImgError(false);

    if (item) {
      // Dynamic SEO
      document.title = `${item.name} | O Chefão dos Cards - Loja Oficial MM2`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Compre ${item.name} (${item.category}) de Murder Mystery 2 com o melhor preço. Entrega imediata e garantida pelo Chefão dos Cards.`);
      }

      // Update OpenGraph for better social sharing
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', `${item.name} | Loja O Chefão dos Cards`);
      
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute('content', item.image);
    }

    return () => {
      // Reset to default on unmount
      document.title = "O Chefão dos Cards | Loja Oficial de Itens MM2";
    };
  }, [id, item]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-6">REGISTRO NÃO ENCONTRADO</h2>
          <Link to="/" className="neon-cyan font-bebas text-2xl hover:underline">VOLTAR PARA A DATABASE</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 relative overflow-hidden">
      <div className="cinematic-rays" />
      
      <div className="container relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 text-[#888888] hover:neon-cyan transition-all mb-12 font-bebas text-2xl tracking-widest">
          <ChevronLeft className="w-6 h-6" />
          VOLTAR PARA O CATÁLOGO
        </Link>

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
                alt={item.name} 
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
                DISPONÍVEL
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
              {item.name}
            </h1>
            
            <div className="text-6xl font-black neon-gold font-bebas tracking-tighter mb-10">
              R$ {item.price.toFixed(2).replace('.', ',')}
            </div>

            <p className="text-[#E0E0E0] text-xl mb-12 leading-relaxed font-light border-l-4 border-[#00FFFF]/30 pl-8">
              Adquira a lendária <span className="font-bold">{item.name}</span>. 
              Garantimos a entrega via trade oficial no Roblox em tempo recorde. 
            </p>

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
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-12 h-full flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <button 
                onClick={() => onAddToCart(item, quantity)}
                className="btn-viral flex-1 h-16 flex items-center justify-center gap-4 text-2xl"
              >
                <ShoppingCart className="w-8 h-8" />
                ADICIONAR AO CARRINHO
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-[#888888] font-bebas text-lg tracking-widest uppercase">
                <ShieldCheck className="w-5 h-5 text-[#00FFFF]" />
                Compra 100% Protegida
              </div>
              <div className="flex items-center gap-3 text-[#888888] font-bebas text-lg tracking-widest uppercase">
                <Zap className="w-5 h-5 text-[#BF00FF]" />
                Entrega em 5 Minutos
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mb-32">
            <h2 className="text-4xl font-black mb-12 tracking-tighter border-l-4 border-neon-cyan pl-6">
              QUEM VIU ESTE ITEM <span className="neon-cyan">TAMBÉM VIU</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendations.map(recItem => (
                <ItemCard key={recItem.id} item={recItem} />
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-black mb-12 tracking-tighter border-l-4 border-neon-purple pl-6">
              AVALIAÇÕES DOS <span className="neon-purple">COMPRADORES</span>
            </h2>
            <div className="space-y-8">
              {commentsData.map(comment => (
                <div key={comment.id} className="glass-card p-8 rounded-3xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center">
                        <User className="text-neon-purple w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{comment.user}</div>
                        <div className="text-xs text-[#888888] uppercase tracking-widest font-bebas">{comment.date}</div>
                      </div>
                    </div>
                    <div className="flex text-[#FFD700]">
                      {[...Array(comment.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#E0E0E0] leading-relaxed italic">"{comment.text}"</p>
                  <div className="absolute top-4 right-4 bg-neon-green/10 text-neon-green text-[10px] px-2 py-1 rounded-sm font-bold uppercase tracking-widest">
                    Compra Verificada
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card p-10 rounded-[40px] sticky top-32">
              <h3 className="text-2xl font-black mb-6 font-gamer tracking-tighter">O CHEFÃO É <span className="neon-green">CONFIÁVEL</span>?</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Trophy className="w-6 h-6 text-gold" />
                  <span className="text-sm text-[#888888] uppercase tracking-widest font-bold">+50.000 Itens Entregues</span>
                </div>
                <div className="flex items-center gap-4">
                  <Star className="w-6 h-6 text-gold fill-current" />
                  <span className="text-sm text-[#888888] uppercase tracking-widest font-bold">Avaliação 4.9/5 estrelas</span>
                </div>
                <div className="flex items-center gap-4">
                  <MessageSquare className="w-6 h-6 text-[#00FFFF]" />
                  <span className="text-sm text-[#888888] uppercase tracking-widest font-bold">Suporte 24/7 no WhatsApp</span>
                </div>
              </div>
              <hr className="my-8 border-white/5" />
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bebas text-xl tracking-widest">
                VER TODAS AS AVALIAÇÕES
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
