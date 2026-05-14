import React from 'react';
import { ShoppingBag, Search, User, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Navbar = ({ searchQuery, setSearchQuery, cartCount, onOpenCart, session }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-[#00FFFF]/30 py-4 shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
      <nav className="container flex flex-wrap md:flex-nowrap items-center justify-between gap-x-4 gap-y-2">
        <Link to="/" className="text-xl sm:text-2xl font-black flex items-center gap-2 group">
          <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-[#00FFFF] drop-shadow-[0_0_8px_#00FFFF] group-hover:animate-pulse" />
          <span className="font-gamer tracking-tighter whitespace-nowrap">
            O <span className="neon-cyan">CHEFÃO</span>
          </span>
        </Link>

        <div className="relative flex-1 max-w-lg group order-last md:order-none w-full md:w-auto mt-4 md:mt-0">
          <input
            type="text"
            placeholder="BUSCAR NO INVENTÁRIO..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (window.location.pathname !== '/') navigate('/');
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 md:py-3 px-8 md:px-12 text-white font-bebas tracking-widest focus:outline-none focus:border-[#00FFFF]/60 focus:bg-white/10 transition-all text-xs md:text-lg shadow-inner"
          />
          <Search className="absolute left-2.5 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5 md:w-5 md:h-5 group-focus-within:text-[#00FFFF] transition-colors" />
        </div>

        <div className="flex items-center gap-8">
          <div 
            onClick={onOpenCart}
            className="relative cursor-pointer group"
          >
            <ShoppingBag className="w-6 h-6 text-gray-300 group-hover:text-[#00FFFF] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#00FFFF] text-black text-[10px] font-black px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_#00FFFF]">
                {cartCount}
              </span>
            )}
          </div>
          {session ? (
            <div className="flex items-center gap-6">
              <Link to="/orders" className="flex items-center gap-2 font-bebas text-xl tracking-widest text-[#E0E0E0] hover:text-[#00FFFF] transition-colors">
                <Zap className="w-5 h-5 text-neon-purple" />
                <span>MEUS PEDIDOS</span>
              </Link>
              <Link to="/admin" className="flex items-center gap-2 font-bebas text-xl tracking-widest text-[#E0E0E0] hover:text-[#00FFFF] transition-colors border-l border-white/10 pl-6">
                <User className="w-5 h-5" />
                <span>ADMIN</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="font-bebas text-xl tracking-widest text-red-500 hover:text-red-400 transition-colors"
              >
                SAIR
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 font-bebas text-xl tracking-widest text-[#E0E0E0] hover:text-[#00FFFF] transition-colors border-l border-white/10 pl-6">
              <User className="w-5 h-5" />
              <span>LOGIN</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
