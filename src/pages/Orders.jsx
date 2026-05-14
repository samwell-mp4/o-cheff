import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, ChevronRight, ShoppingBag, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!error) setOrders(data);
      }
      setLoading(false);
    };

    fetchMyOrders();

    // Subscribe to changes
    const channel = supabase
      .channel('my-orders')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bebas text-2xl tracking-widest animate-pulse">CARREGANDO MEUS PEDIDOS...</div>;
  }

  return (
    <div className="min-h-screen pt-40 pb-32 relative overflow-hidden">
      <div className="cinematic-rays opacity-20" />
      
      <div className="container relative z-10 max-w-5xl">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-black font-gamer tracking-tighter">MEUS <span className="neon-cyan">PEDIDOS</span></h1>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-neon-cyan font-bebas text-xl tracking-widest transition-colors"
          >
            <ShoppingBag className="w-5 h-5" /> CONTINUAR COMPRANDO
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="glass-card p-20 rounded-[40px] text-center opacity-50">
            <Package className="w-20 h-20 mx-auto mb-6 text-gray-700" />
            <p className="font-bebas text-3xl tracking-widest text-gray-600 uppercase">Você ainda não possui pedidos</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 rounded-3xl border-white/5 group hover:border-white/10 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                      <Package className="text-neon-cyan w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-widest">Pedido #{order.order_id}</div>
                      <div className="font-bold text-xl uppercase tracking-tight">
                        {order.items.length} item(s) • <span className="neon-gold">R$ {parseFloat(order.total).toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-neon-purple font-bold mt-1 uppercase tracking-widest">Para: {order.roblox_nick}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${
                      order.status === 'Pago' 
                        ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' 
                        : 'bg-gold/10 text-gold border border-gold/20'
                    }`}>
                      {order.status === 'Pago' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      {order.status}
                    </div>
                    
                    <button 
                      onClick={() => navigate('/chat')}
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group-hover:border-neon-cyan/30"
                    >
                      <MessageSquare className="w-6 h-6 text-neon-cyan" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="text-[10px] text-gray-500 uppercase tracking-widest truncate bg-black/20 px-3 py-1 rounded">
                      {item.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
