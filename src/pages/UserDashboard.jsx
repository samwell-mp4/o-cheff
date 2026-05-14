import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Package, User, LogOut, ExternalLink, 
  Clock, CheckCircle2, AlertCircle, ChevronRight, MessageSquare, Phone
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = ({ onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`customer_email.eq.${session.user.email},user_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar pedidos:", error);
        setOrders([]);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pago': return 'text-neon-green bg-neon-green/10 border-neon-green/20';
      case 'pendente': return 'text-gold bg-gold/10 border-gold/20';
      default: return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 bg-[#050510]">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl sm:text-7xl font-black italic font-gamer tracking-tighter uppercase mb-2">
              MINHA <span className="neon-cyan">CONTA</span>
            </h1>
            <p className="font-bebas text-lg sm:text-xl text-gray-400 tracking-widest uppercase flex items-center gap-2">
              <User className="w-5 h-5 text-neon-cyan" /> {user?.email}
            </p>
          </motion.div>

          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-8 py-4 rounded-2xl font-bebas text-xl tracking-widest hover:bg-red-500 hover:text-white transition-all uppercase italic w-full md:w-auto"
          >
            <LogOut className="w-5 h-5" /> Sair da Conta
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 rounded-[32px] border-white/10">
              <h3 className="font-bebas text-2xl tracking-widest mb-6 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-neon-purple" /> RESUMO
              </h3>
              <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-gray-400 font-bebas tracking-widest uppercase">Pedidos</span>
                <span className="text-3xl font-black neon-purple">{orders.length}</span>
              </div>
            </div>

            <Link to="/shop" className="block group">
              <div className="glass-card p-8 rounded-[32px] border-neon-cyan/20 bg-neon-cyan/5 group-hover:bg-neon-cyan/10 transition-all text-center">
                <Package className="w-10 h-10 text-neon-cyan mx-auto mb-4 animate-bounce" />
                <h3 className="font-bebas text-2xl tracking-widest text-neon-cyan">VOLTAR PARA A LOJA</h3>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card p-8 rounded-[32px] border-white/10 min-h-[500px]">
              <h3 className="font-bebas text-2xl tracking-widest mb-8 flex items-center gap-3">
                <Clock className="w-6 h-6 text-gold" /> HISTÓRICO DE COMPRAS
              </h3>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl" />)}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <motion.div 
                      key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="group p-6 sm:p-8 bg-white/5 rounded-[24px] border border-white/5 hover:border-neon-cyan/30 transition-all relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-8 relative z-10">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <span className="font-gamer text-2xl tracking-tighter text-white">#{order.order_id || order.id.slice(0, 8)}</span>
                            <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                              {order.status || 'Pago'}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                            <p className="text-neon-purple text-xs uppercase tracking-widest font-bold">Nick: {order.roblox_nick}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-6">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-bebas tracking-widest mb-1">Valor do Pedido</p>
                            <p className="text-3xl font-black text-white">R$ {parseFloat(order.total || 0).toFixed(2)}</p>
                          </div>
                          
                          <div className="flex gap-3 w-full sm:w-auto">
                            <button 
                              onClick={() => {
                                const chatBtn = document.getElementById('chat-trigger');
                                if(chatBtn) chatBtn.click();
                              }}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-neon-cyan text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_#00FFFF44]"
                            >
                              <MessageSquare className="w-4 h-4" /> Bate-papo
                            </button>
                            <button 
                              onClick={() => window.open(`https://wa.me/5531988868362?text=Suporte para o pedido #${order.order_id || order.id.slice(0,8)}`, '_blank')}
                              className="bg-white/5 border border-white/10 text-white p-3 rounded-xl hover:bg-neon-green hover:text-black transition-all"
                              title="WhatsApp"
                            >
                              <Phone className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan opacity-50" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <ShoppingBag className="w-16 h-16 mb-6" />
                  <p className="font-bebas text-2xl tracking-widest uppercase">Você ainda não fez nenhum pedido</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
