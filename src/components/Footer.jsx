import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, CreditCard, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="pt-32 pb-12 border-t border-white/5 bg-black/40 backdrop-blur-3xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <div className="text-3xl font-black font-gamer tracking-tighter">O <span className="neon-cyan">CHEFÃO</span> DOS CARDS</div>
            <p className="text-[#888888] leading-relaxed font-light">
              Plataforma de elite especializada no comércio de itens raros de Murder Mystery 2. Tecnologia, segurança e velocidade absoluta em cada trade.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-neon-cyan/20 transition-colors cursor-pointer group">
                <Zap className="w-5 h-5 text-gray-500 group-hover:text-neon-cyan" />
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-neon-purple/20 transition-colors cursor-pointer group">
                <MessageSquare className="w-5 h-5 text-gray-500 group-hover:text-neon-purple" />
              </div>
            </div>
          </div>

          {/* Categories / Navigation */}
          <div>
            <h4 className="font-bebas text-2xl tracking-widest mb-8 text-white uppercase italic">Categorias</h4>
            <ul className="space-y-4 text-[#888888] font-bebas text-lg tracking-widest uppercase">
              <li><Link to="/shop" className="hover:text-neon-cyan transition-colors">Ver Todo o Inventário</Link></li>
              <li><Link to="/shop?category=Godly" className="hover:text-neon-cyan transition-colors">Murder Mystery 2 (MM2)</Link></li>
              <li><Link to="/shop?category=Sailor%20Piece" className="hover:text-neon-cyan transition-colors">Sailor Piece</Link></li>
              <li><Link to="/orders" className="hover:text-neon-cyan transition-colors">Meus Pedidos</Link></li>
            </ul>
          </div>

          {/* Institutional Links */}
          <div>
            <h4 className="font-bebas text-2xl tracking-widest mb-8 text-white uppercase italic">Institucional</h4>
            <ul className="space-y-4 text-[#888888] font-bebas text-lg tracking-widest uppercase">
              <li><Link to="/termos" className="hover:text-neon-cyan transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="hover:text-neon-cyan transition-colors">Privacidade</Link></li>
              <li><Link to="/reembolso" className="hover:text-neon-cyan transition-colors">Reembolso & Devolução</Link></li>
            </ul>
          </div>

          {/* Security & Payment */}
          <div>
            <h4 className="font-bebas text-2xl tracking-widest mb-8 text-white uppercase italic">Segurança</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-[#888888]">
                <ShieldCheck className="w-6 h-6 text-neon-green" />
                <span className="text-xs font-bold uppercase tracking-widest">Protocolo SSL Seguro</span>
              </div>
              <div className="flex items-center gap-4 text-[#888888]">
                <CreditCard className="w-6 h-6 text-neon-cyan" />
                <span className="text-xs font-bold uppercase tracking-widest">Pagamento via PIX Oficial</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bebas text-2xl tracking-widest mb-8 text-white uppercase italic">Suporte</h4>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <p className="text-[10px] text-[#888888] uppercase tracking-[0.2em] mb-2 font-bold">Atendimento 24/7</p>
              <div className="text-neon-cyan font-bebas text-2xl tracking-widest mb-4">ONLINE AGORA</div>
              <button className="w-full py-3 bg-neon-cyan/10 border border-neon-cyan/20 rounded-xl text-neon-cyan font-bold uppercase text-xs tracking-widest hover:bg-neon-cyan hover:text-black transition-all">
                ABRIR CHAMADO
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[10px] text-gray-700 uppercase tracking-[4px]">
            © 2026 O Chefão dos Cards. PROTOCOLO v2.5 FINAL
          </div>
          <div className="flex gap-8 text-[10px] text-gray-700 uppercase tracking-[4px]">
            <span>Powered by Roblox Ecosystem</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
