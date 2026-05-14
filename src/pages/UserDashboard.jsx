import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Package, User, LogOut, ExternalLink, 
  Clock, CheckCircle2, AlertCircle, ChevronRight
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

      // Busca pedidos por Email OU UserID para garantir que apareça
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
      case 'cancelado': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pago': return <CheckCircle2 className="w-4 h-4" />;
      case 'pendente': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#050510]">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl md:text-7xl font-black italic font-gamer tracking-tighter uppercase mb-2">
              MINHA <span className="neon-cyan">CONTA</span>
            </h1>
            <p className="font-bebas text-xl text-gray-400 tracking-widest uppercase flex items-center gap-2">
              <User className="w-5 h-5 text-neon-cyan" /> {user?.email}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            onClick={onLogout}
            className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-8 py-4 rounded-2xl font-bebas text-xl tracking-widest hover:bg-red-500 hover:text-white transition-all uppercase italic"
          >
            <LogOut className="w-5 h-5" /> Sair da Conta
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 rounded-[32px] border-white/10">
              <h3 className="font-bebas text-2xl tracking-widest mb-6 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-neon-purple" /> RESUMO
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-gray-400 font-bebas tracking-widest uppercase">Pedidos</span>
                  <span className="text-2xl font-black neon-purple">{orders.length}</span>
                </div>
              </div>
            </div>

            <Link to="/shop" className="block group">
              <div className="glass-card p-8 rounded-[32px] border-neon-cyan/20 bg-neon-cyan/5 group-hover:bg-neon-cyan/10 transition-all text-center">
                <Package className="w-10 h-10 text-neon-cyan mx-auto mb-4 animate-bounce" />
                <h3 className="font-bebas text-2xl tracking-widest text-neon-cyan">IR PARA A LOJA</h3>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card p-8 rounded-[32px] border-white/10 min-h-[500px]">
              <h3 className="font-bebas text-2xl tracking-widest mb-8 flex items-center gap-3">
                <Clock className="w-6 h-6 text-gold" /> ÚLTIMOS PEDIDOS
              </h3>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />)}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div 
                      key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="group p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bebas text-xl tracking-widest text-white">#{order.id.slice(0, 8)}</span>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)} {order.status}
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-8 text-right">
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-bebas tracking-widest">Total</p>
                            <p className="text-2xl font-black text-white text-nowrap">R$ {parseFloat(order.total).toFixed(2)}</p>
                          </div>
                          <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-neon-cyan" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <ShoppingBag className="w-16 h-16 mb-6" />
                  <p className="font-bebas text-2xl tracking-widest">NENHUM PEDIDO ENCONTRADO</p>
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
