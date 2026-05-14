import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, Zap, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Navbar = ({ searchQuery, setSearchQuery, cartCount, onOpenCart, session }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      fetchSearchResults();
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchQuery}%`)
      .eq('is_active', true)
      .limit(5);
    
    if (data) {
      setResults(data);
      setShowResults(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleResultClick = (slug) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/produto/${slug}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-2 sm:py-3' : 'py-4 sm:py-6'}`}>
      <div className={`absolute inset-0 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-black/20 backdrop-blur-sm'
      }`} />
      
      <nav className="container relative z-10 px-4 flex items-center justify-between gap-4 md:gap-8">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            <Zap className={`transition-all duration-500 text-[#00FFFF] drop-shadow-[0_0_12px_#00FFFF] group-hover:scale-110 ${isScrolled ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-10 sm:h-10'}`} />
            <div className="absolute inset-0 bg-[#00FFFF]/20 blur-xl rounded-full scale-150 animate-pulse" />
          </div>
          <span className={`font-gamer tracking-tighter leading-none transition-all duration-500 ${isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-4xl'}`}>
            O <span className="text-[#00FFFF] drop-shadow-[0_0_8px_#00FFFF]">CHEFÃO</span>
          </span>
        </Link>

        <div ref={searchRef} className="hidden sm:flex relative flex-1 max-w-md group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/10 to-[#BF00FF]/10 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            placeholder="O QUE VOCÊ BUSCA?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            className="relative w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-white font-bebas tracking-widest text-sm focus:outline-none focus:border-[#00FFFF]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-500 uppercase"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-[#00FFFF] transition-colors" />

          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-3 bg-[#0a0a1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-2 space-y-1">
                {results.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => handleResultClick(item.slug)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group/item"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/5 group-hover/item:border-[#00FFFF]/30 transition-colors">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bebas tracking-wider truncate group-hover/item:text-[#00FFFF] transition-colors">{item.name}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span style={{ color: item.rarity_color || '#fff' }} className="brightness-125">{item.rarity}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span>R$ {parseFloat(item.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-[#00FFFF] opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                  </div>
                ))}
                <div 
                  onClick={() => {
                    navigate('/shop');
                    setShowResults(false);
                  }}
                  className="p-3 text-center border-t border-white/5 mt-1 hover:bg-[#00FFFF]/5 transition-colors cursor-pointer"
                >
                  <span className="text-[10px] font-black text-[#00FFFF] tracking-[0.2em] uppercase">Ver todos os resultados</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          <div className="flex items-center gap-8">
            <Link to="/" className={`font-bebas text-lg tracking-widest transition-all hover:text-[#00FFFF] ${isActive('/') ? 'text-[#00FFFF]' : 'text-gray-300'}`}>INÍCIO</Link>
            <Link to="/shop" className={`font-bebas text-lg tracking-widest transition-all hover:text-[#00FFFF] ${isActive('/shop') ? 'text-[#00FFFF]' : 'text-gray-300'}`}>SHOP</Link>
          </div>

          <div className="flex items-center gap-6 border-l border-white/10 pl-6 lg:pl-10">
            <div onClick={onOpenCart} className="relative cursor-pointer group p-1">
              <ShoppingBag className="w-6 h-6 text-gray-300 group-hover:text-[#00FFFF] transition-all group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#00FFFF] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_12px_#00FFFF]">
                  {cartCount}
                </span>
              )}
            </div>

            {session ? (
              <div className="flex items-center gap-4">
                <Link to="/admin" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <User className="w-5 h-5 text-gray-300" />
                </Link>
                <button onClick={handleLogout} className="font-bebas text-sm tracking-widest text-red-500/70 hover:text-red-500 uppercase transition-colors">Sair</button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 font-bebas text-lg tracking-widest text-white bg-white/5 border border-white/10 px-5 py-2 rounded-lg hover:bg-[#00FFFF]/10 hover:border-[#00FFFF]/30 transition-all">
                <span>LOGIN</span>
              </Link>
            )}
          </div>
        </div>

        <div className="flex md:hidden items-center gap-4 shrink-0">
          <button onClick={() => navigate('/shop')} className="sm:hidden text-gray-300 p-2">
            <Search className="w-6 h-6" />
          </button>
          
          <div onClick={onOpenCart} className="relative cursor-pointer p-1">
            <ShoppingBag className="w-6 h-6 text-gray-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#00FFFF] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_8px_#00FFFF]">
                {cartCount}
              </span>
            )}
          </div>

          <Link to={session ? "/admin" : "/login"} className="p-1">
            <User className="w-6 h-6 text-gray-300" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
