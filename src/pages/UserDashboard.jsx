import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Package, User, LogOut, ExternalLink, 
  Clock, CheckCircle2, AlertCircle, ChevronRight, Search
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
        .eq('customer_email', session.user.email)
        .order('created_at', { ascending: false });

      if (!error) setOrders(data);
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
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="container max-w-6xl">
        {/* Header de Boas-vindas */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black italic font-gamer tracking-tighter uppercase mb-2">
              MINHA <span className="neon-cyan">CONTA</span>
            </h1>
            <p className="font-bebas text-xl text-gray-400 tracking-widest uppercase flex items-center gap-2">
              <User className="w-5 h-5 text-neon-cyan" /> {user?.email}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onLogout}
            className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-8 py-4 rounded-2xl font-bebas text-xl tracking-widest hover:bg-red-500 hover:text-white transition-all uppercase italic shadow-[0_0_20px_rgba(239,68,68,0.1)]"
          >
            <LogOut className="w-5 h-5" /> Sair da Conta
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda: Resumo */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 rounded-[32px] border-white/10">
              <h3 className="font-bebas text-2xl tracking-widest mb-6 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-neon-purple" /> RESUMO GERAL
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-gray-400 font-bebas tracking-widest uppercase">Total de Pedidos</span>
                  <span className="text-2xl font-black neon-purple">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-gray-400 font-bebas tracking-widest uppercase">Status da Conta</span>
                  <span className="text-sm font-bold bg-neon-green/20 text-neon-green px-3 py-1 rounded-full uppercase tracking-tighter">Ativa</span>
                </div>
              </div>
            </div>

            <Link to="/shop" className="block group">
              <div className="glass-card p-8 rounded-[32px] border-neon-cyan/20 bg-neon-cyan/5 group-hover:bg-neon-cyan/10 transition-all text-center">
                <Package className="w-10 h-10 text-neon-cyan mx-auto mb-4 animate-bounce" />
                <h3 className="font-bebas text-2xl tracking-widest text-neon-cyan">CONTINUAR COMPRANDO</h3>
                <p className="text-xs text-neon-cyan/60 font-bold uppercase tracking-widest mt-2">Novos itens MM2 chegaram!</p>
              </div>
            </Link>
          </div>

          {/* Coluna da Direita: Meus Pedidos */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 rounded-[32px] border-white/10 min-h-[500px]">
              <h3 className="font-bebas text-2xl tracking-widest mb-8 flex items-center gap-3">
                <Clock className="w-6 h-6 text-gold" /> MEUS ÚLTIMOS PEDIDOS
              </h3>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bebas text-xl tracking-widest text-white">#{order.id.slice(0, 8).toUpperCase()}</span>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm font-medium">
                            {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-8">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-bebas tracking-widest">Valor Total</p>
                            <p className="text-2xl font-black text-white">R$ {parseFloat(order.total).toFixed(2)}</p>
                          </div>
                          <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-neon-cyan transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-700 mb-6 opacity-20" />
                  <p className="font-bebas text-2xl text-gray-500 tracking-widest">Você ainda não fez nenhum pedido.</p>
                  <Link to="/shop" className="mt-6 text-neon-cyan hover:underline font-bebas text-xl tracking-widest uppercase">
                    Ir para a Loja <ExternalLink className="w-4 h-4 inline-block ml-2" />
                  </Link>
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
