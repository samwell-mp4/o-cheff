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
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-[#00FFFF]/20 py-2 sm:py-4">
      <nav className="container px-4">
        {/* Top Tier: Logo & Actions */}
        <div className="flex items-center justify-between mb-3 md:mb-0 md:flex-row w-full gap-4">
          <Link to="/" className="text-xl sm:text-2xl font-black flex items-center gap-2 group shrink-0">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-[#00FFFF] drop-shadow-[0_0_8px_#00FFFF] group-hover:animate-pulse" />
            <span className="font-gamer tracking-tighter whitespace-nowrap">
              O <span className="neon-cyan">CHEFÃO</span>
            </span>
          </Link>

          {/* Actions Icons (Visible on Mobile & Desktop) */}
          <div className="flex items-center gap-4 sm:gap-6 ml-auto">
            <div 
              onClick={onOpenCart}
              className="relative cursor-pointer group p-1"
            >
              <ShoppingBag className="w-6 h-6 text-gray-300 group-hover:text-[#00FFFF] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00FFFF] text-black text-[10px] font-black px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_#00FFFF]">
                  {cartCount}
                </span>
              )}
            </div>

            {session ? (
              <div className="flex items-center gap-3 sm:gap-6">
                <Link to="/orders" className="flex items-center gap-1.5 font-bebas text-lg sm:text-xl tracking-widest text-[#E0E0E0] hover:text-[#00FFFF] transition-colors">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-neon-purple hidden xs:block" />
                  <span>PEDIDOS</span>
                </Link>
                <Link to="/admin" className="flex items-center gap-1.5 font-bebas text-lg sm:text-xl tracking-widest text-[#E0E0E0] hover:text-[#00FFFF] transition-colors border-l border-white/10 pl-3 sm:pl-6">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 hidden xs:block" />
                  <span>ADM</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="font-bebas text-lg sm:text-xl tracking-widest text-red-500 hover:text-red-400 transition-colors hidden sm:block"
                >
                  SAIR
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 font-bebas text-lg sm:text-xl tracking-widest text-[#E0E0E0] hover:text-[#00FFFF] transition-colors border-l border-white/10 pl-3 sm:pl-6">
                <User className="w-5 h-5" />
                <span>LOGIN</span>
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Tier / Desktop Middle: Search Bar */}
        <div className="relative w-full md:max-w-md lg:max-w-lg md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2">
          <input
            type="text"
            placeholder="BUSCAR NO INVENTÁRIO..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (window.location.pathname !== '/') navigate('/');
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 md:py-3 px-10 md:px-12 text-white font-bebas tracking-widest focus:outline-none focus:border-[#00FFFF]/60 focus:bg-white/10 transition-all text-sm md:text-lg shadow-inner placeholder:text-gray-600"
          />
          <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 md:w-5 md:h-5 group-focus-within:text-[#00FFFF] transition-colors" />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
