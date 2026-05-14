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
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Background with advanced glassmorphism */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.8)]" />
      
      <nav className="container relative z-10 px-4 py-3 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Main row: Logo & Actions */}
        <div className="flex items-center justify-between w-full md:w-auto gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Zap className="w-7 h-7 sm:w-9 sm:h-9 text-[#00FFFF] drop-shadow-[0_0_12px_#00FFFF] group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-[#00FFFF]/20 blur-xl rounded-full scale-150 animate-pulse" />
            </div>
            <span className="font-gamer text-2xl sm:text-3xl tracking-tighter leading-none">
              O <span className="text-[#00FFFF] drop-shadow-[0_0_8px_#00FFFF]">CHEFÃO</span>
            </span>
          </Link>

          {/* Icons for Mobile (Actions) */}
          <div className="flex items-center gap-5 md:hidden">
            <div onClick={onOpenCart} className="relative cursor-pointer">
              <ShoppingBag className="w-6 h-6 text-gray-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#00FFFF] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_8px_#00FFFF]">
                  {cartCount}
                </span>
              )}
            </div>
            <Link to={session ? "/orders" : "/login"}>
              <User className="w-6 h-6 text-gray-200" />
            </Link>
          </div>
        </div>

        {/* Search Bar - Center / Dynamic width */}
        <div className="relative w-full md:max-w-md lg:max-w-lg group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/20 to-[#BF00FF]/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            placeholder="PROCURAR NO INVENTÁRIO..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (window.location.pathname !== '/') navigate('/');
            }}
            className="relative w-full bg-white/5 border border-white/10 rounded-xl py-2.5 sm:py-3.5 px-11 text-white font-bebas tracking-[0.2em] text-sm sm:text-lg focus:outline-none focus:border-[#00FFFF]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-500 uppercase shadow-2xl"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#00FFFF] transition-colors" />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-8">
          <div onClick={onOpenCart} className="relative cursor-pointer group p-2">
            <ShoppingBag className="w-7 h-7 text-gray-300 group-hover:text-[#00FFFF] transition-all group-hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0 bg-[#00FFFF] text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_12px_#00FFFF]">
                {cartCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 border-l border-white/10 pl-8">
            {session ? (
              <>
                <Link to="/orders" className="font-bebas text-xl tracking-widest text-gray-300 hover:text-[#00FFFF] transition-colors">PEDIDOS</Link>
                <Link to="/admin" className="font-bebas text-xl tracking-widest text-gray-300 hover:text-[#00FFFF] transition-colors">ADM</Link>
                <button onClick={handleLogout} className="font-bebas text-xl tracking-widest text-red-500 hover:text-red-400">SAIR</button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 font-bebas text-xl tracking-widest text-white bg-[#00FFFF]/10 border border-[#00FFFF]/30 px-6 py-2 rounded-lg hover:bg-[#00FFFF]/20 transition-all shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                <User className="w-5 h-5 text-[#00FFFF]" />
                <span>ENTRAR</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
