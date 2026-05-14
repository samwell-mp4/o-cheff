import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, Zap, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Navbar = ({ searchQuery, setSearchQuery, cartCount, onOpenCart, session, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [statusAcesso, setStatusAcesso] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    if (session) {
      supabase.from('profiles').select('role').eq('id', session.user.id).single().then(({ data }) => {
        if (data) setStatusAcesso(data.role);
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [session]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      supabase.from('products').select('*').ilike('name', `%${searchQuery}%`).eq('is_active', true).limit(5).then(({ data }) => {
        if (data) { setResults(data); setShowResults(true); }
      });
    } else setShowResults(false);
  }, [searchQuery]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-2 sm:py-3' : 'py-4 sm:py-6'}`}>
      <div className={`absolute inset-0 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-black/20 backdrop-blur-sm'}`} />
      
      <nav className="container relative z-10 px-4 flex items-center justify-between gap-4 md:gap-8">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <Zap className={`transition-all duration-500 text-[#00FFFF] drop-shadow-[0_0_12px_#00FFFF] group-hover:scale-110 ${isScrolled ? 'w-6 h-6' : 'w-8 h-8'}`} />
          <span className={`font-gamer tracking-tighter transition-all duration-500 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
            O <span className="text-[#00FFFF]">CHEFÃO</span>
          </span>
        </Link>

        <div ref={searchRef} className="hidden sm:flex relative flex-1 max-w-md group">
          <input
            type="text" placeholder="O QUE VOCÊ BUSCA?" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-white font-bebas tracking-widest text-sm focus:outline-none focus:border-[#00FFFF]/50 transition-all uppercase"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-3 bg-[#0a0a1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2">
              <div className="p-2 space-y-1">
                {results.map(item => (
                  <div key={item.id} onClick={() => { navigate(`/produto/${item.slug}`); setShowResults(false); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bebas tracking-wider truncate">{item.name}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">R$ {parseFloat(item.price).toFixed(2)}</div>
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
            <div onClick={onOpenCart} className="relative cursor-pointer group p-1">
              <ShoppingBag className="w-6 h-6 text-gray-300 group-hover:text-[#00FFFF]" />
              {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-[#00FFFF] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg">{cartCount}</span>}
            </div>

            {session ? (
              <div className="flex items-center gap-4">
                <Link to={statusAcesso === 'admin' ? "/admin" : "/dashboard"} className="p-2 bg-white/5 rounded-lg">
                  <User className="w-5 h-5 text-gray-300" />
                </Link>
                <button onClick={onLogout} className="font-bebas text-sm tracking-widest text-red-500/70 hover:text-red-500 uppercase">Sair</button>
              </div>
            ) : (
              <Link to="/login" className="font-bebas text-lg tracking-widest text-white bg-white/5 border border-white/10 px-5 py-2 rounded-lg hover:bg-[#00FFFF]/10 transition-all">LOGIN</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
