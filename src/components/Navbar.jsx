import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, Zap, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Navbar = ({ cartCount, onOpenCart, session, userRole, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
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
      supabase.from('products').select('*').ilike('name', `%${searchQuery}%`).limit(5).then(({ data }) => {
        if (data) { setResults(data); setShowResults(true); }
      });
    } else setShowResults(false);
  }, [searchQuery]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className={`absolute inset-0 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-black/20 backdrop-blur-sm'}`} />
      
      <nav className="container relative z-10 px-4 flex items-center justify-between gap-4 md:gap-8">
        <Link to="/" className="flex items-center gap-3 group">
          <Zap className={`text-[#00FFFF] drop-shadow-[0_0_12px_#00FFFF] ${isScrolled ? 'w-6 h-6' : 'w-8 h-8'}`} />
          <span className={`font-gamer tracking-tighter ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
            O <span className="text-[#00FFFF]">CHEFÃO</span>
          </span>
        </Link>

        <div ref={searchRef} className="hidden sm:flex relative flex-1 max-w-md">
          <input
            type="text" placeholder="BUSCAR ITEM..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-white font-bebas tracking-widest text-sm focus:outline-none focus:border-[#00FFFF]/50 uppercase"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          {showResults && (results?.length || 0) > 0 && (
            <div className="absolute top-full left-0 w-full mt-3 bg-[#0a0a1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-2 space-y-1">
                {results.map(item => (
                  <div key={item.id} onClick={() => { navigate(`/produto/${item.slug}`); setShowResults(false); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="text-white font-bebas tracking-wider">{item.name}</div>
                      <div className="text-[10px] text-gray-500 font-bold tracking-widest">R$ {parseFloat(item.price).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`font-bebas text-lg tracking-widest ${isActive('/') ? 'text-[#00FFFF]' : 'text-gray-300'}`}>INÍCIO</Link>
            <Link to="/shop" className={`font-bebas text-lg tracking-widest ${isActive('/shop') ? 'text-[#00FFFF]' : 'text-gray-300'}`}>SHOP</Link>
          </div>

          <div className="flex items-center gap-4">
            <div onClick={onOpenCart} className="relative cursor-pointer p-1">
              <ShoppingBag className="w-6 h-6 text-gray-300 hover:text-[#00FFFF] transition-colors" />
              {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-[#00FFFF] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg">{cartCount}</span>}
            </div>

            {session ? (
              <div className="flex items-center gap-4">
                <Link to={userRole === 'admin' ? "/admin" : "/dashboard"} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-[#00FFFF]/30 transition-all">
                  <User className="w-5 h-5 text-gray-300" />
                </Link>
                <button onClick={onLogout} className="font-bebas text-sm tracking-widest text-red-500/70 hover:text-red-500 transition-colors uppercase">Sair</button>
              </div>
            ) : (
              <Link to="/login" className="font-bebas text-lg tracking-widest text-white bg-[#00FFFF]/10 border border-[#00FFFF]/30 px-5 py-2 rounded-lg hover:bg-[#00FFFF]/20 transition-all">LOGIN</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
