import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingCart, MessageSquare, Search, Filter, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = ({ orders }) => {
  const [activeTab, setActiveTab] = useState('orders');

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="min-h-screen bg-[#050510] pt-24 pb-32">
      <div className="container">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6 rounded-2xl border-white/5">
            <div className="text-[#888888] font-bebas text-lg tracking-widest mb-2 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-neon-cyan" /> VENDAS TOTAIS
            </div>
            <div className="text-3xl font-black font-gamer tracking-tighter">R$ {totalSales.toFixed(2)}</div>
          </div>
          <div className="glass-card p-6 rounded-2xl border-white/5">
            <div className="text-[#888888] font-bebas text-lg tracking-widest mb-2 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-neon-purple" /> PEDIDOS
            </div>
            <div className="text-3xl font-black font-gamer tracking-tighter">{orders.length}</div>
          </div>
          <div className="glass-card p-6 rounded-2xl border-white/5">
            <div className="text-[#888888] font-bebas text-lg tracking-widest mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" /> NOVOS CLIENTES
            </div>
            <div className="text-3xl font-black font-gamer tracking-tighter">{[...new Set(orders.map(o => o.whatsapp))].length}</div>
          </div>
          <div className="glass-card p-6 rounded-2xl border-white/5">
            <div className="text-[#888888] font-bebas text-lg tracking-widest mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-neon-green" /> CHATS ATIVOS
            </div>
            <div className="text-3xl font-black font-gamer tracking-tighter">3</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bebas text-xl tracking-widest transition-all ${
                activeTab === 'orders' ? 'bg-neon-cyan text-black shadow-[0_0_15px_#00FFFF]' : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <LayoutDashboard className="w-6 h-6" /> DASHBOARD
            </button>
            <button 
              onClick={() => setActiveTab('chats')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bebas text-xl tracking-widest transition-all ${
                activeTab === 'chats' ? 'bg-neon-purple text-white shadow-[0_0_15px_#BF00FF]' : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <MessageSquare className="w-6 h-6" /> CHATS / SUPORTE
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' ? (
              <div className="glass-card rounded-3xl overflow-hidden border-white/5">
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="text-2xl font-black font-gamer tracking-tighter uppercase">Gestão de <span className="neon-cyan">Pedidos</span></h3>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="Buscar Nick ou ID..."
                        className="bg-black/50 border border-white/10 rounded-lg py-2 pl-12 pr-4 text-sm outline-none focus:border-neon-cyan"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[#888888] font-bebas text-sm tracking-widest uppercase">
                        <th className="p-6">Pedido ID</th>
                        <th className="p-6">Cliente / Nick</th>
                        <th className="p-6">Itens</th>
                        <th className="p-6">Valor</th>
                        <th className="p-6">Status</th>
                        <th className="p-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-20 text-center text-gray-600 uppercase tracking-widest font-bebas text-xl">
                            Nenhum pedido registrado ainda
                          </td>
                        </tr>
                      ) : (
                        orders.map(order => (
                          <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-6 font-mono text-neon-cyan text-sm">#{order.id}</td>
                            <td className="p-6">
                              <div className="font-bold">{order.name}</div>
                              <div className="text-xs text-neon-purple font-mono">@{order.robloxNick}</div>
                            </td>
                            <td className="p-6 text-sm">
                              {order.items.length} item(s)
                            </td>
                            <td className="p-6 font-bold">R$ {order.total.toFixed(2)}</td>
                            <td className="p-6">
                              <span className="flex items-center gap-2 text-xs bg-gold/10 text-gold px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                                <Clock className="w-3 h-3" /> {order.status}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <MoreHorizontal className="w-5 h-5 text-gray-500" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-12 text-center border-white/5 min-h-[400px] flex flex-col items-center justify-center">
                <MessageSquare className="w-20 h-20 text-neon-purple mb-6 opacity-20" />
                <h3 className="text-3xl font-black font-gamer mb-4 uppercase">Centro de <span className="neon-purple">Mensagens</span></h3>
                <p className="text-[#888888] max-w-md font-light leading-relaxed">
                  Os chats com os clientes aparecerão aqui assim que eles finalizarem o pagamento.
                  Você poderá enviar as trades diretamente pelo sistema.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
