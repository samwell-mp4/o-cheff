import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingCart, MessageSquare, Search, Filter, MoreHorizontal, CheckCircle, Clock, Send, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AdminDashboard = ({ orders }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [allMessages, setAllMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminInput, setAdminInput] = useState('');
  const adminScrollRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel('admin-chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setAllMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    if (adminScrollRef.current) {
      adminScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages, selectedUser]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (!error) setAllMessages(data);
  };

  const handleAdminSend = async (e) => {
    e.preventDefault();
    if (!adminInput.trim() || !selectedUser) return;

    const { error } = await supabase
      .from('messages')
      .insert([{
        text: adminInput,
        sender_id: selectedUser,
        is_admin: true,
        sender_name: 'Suporte Chefão'
      }]);

    if (!error) setAdminInput('');
  };

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);

  // Get unique users from messages
  const userChats = Object.entries(
    allMessages.reduce((acc, m) => {
      if (!m.sender_id) return acc;
      if (!acc[m.sender_id]) acc[m.sender_id] = [];
      acc[m.sender_id].push(m);
      return acc;
    }, {})
  ).map(([userId, msgs]) => ({
    userId,
    name: msgs.find(m => !m.is_admin)?.sender_name || 'Cliente',
    lastMessage: msgs[msgs.length - 1],
    messages: msgs
  })).sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));

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
            <div className="text-3xl font-black font-gamer tracking-tighter">{userChats.length}</div>
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
              {userChats.some(c => c.messages.some(m => !m.is_read && !m.is_admin)) && (
                <span className="w-2 h-2 bg-neon-green rounded-full ml-auto animate-pulse" />
              )}
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' ? (
              <div className="glass-card rounded-3xl overflow-hidden border-white/5">
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="text-2xl font-black font-gamer tracking-tighter uppercase">Gestão de <span className="neon-cyan">Pedidos</span></h3>
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
                              <div className="font-bold">{order.customer_name}</div>
                              <div className="text-xs text-neon-purple font-mono">@{order.roblox_nick}</div>
                            </td>
                            <td className="p-6 text-sm">
                              {order.items?.length || 0} item(s)
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[650px]">
                {/* Chat List */}
                <div className="lg:col-span-1 glass-card rounded-3xl overflow-hidden border-white/5 flex flex-col">
                  <div className="p-6 border-b border-white/10 bg-white/5">
                    <h4 className="font-bebas text-xl tracking-widest text-neon-purple">Conversas Ativas</h4>
                  </div>
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {userChats.map((chat) => (
                      <div 
                        key={chat.userId}
                        onClick={() => setSelectedUser(chat.userId)}
                        className={`p-6 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${selectedUser === chat.userId ? 'bg-neon-purple/10 border-l-4 border-l-neon-purple' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-white uppercase text-sm truncate pr-2">{chat.name}</div>
                          <div className="text-[9px] text-gray-500 whitespace-nowrap">
                            {new Date(chat.lastMessage.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{chat.lastMessage.text}</p>
                      </div>
                    ))}
                    {userChats.length === 0 && (
                      <div className="p-12 text-center text-gray-600 font-bebas tracking-widest uppercase">Nenhuma conversa</div>
                    )}
                  </div>
                </div>

                {/* Chat Window */}
                <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden border-white/5 flex flex-col shadow-2xl">
                  {selectedUser ? (
                    <>
                      <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neon-purple/20 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-neon-purple" />
                          </div>
                          <span className="font-bold uppercase tracking-tight">
                            {userChats.find(c => c.userId === selectedUser)?.name || 'Cliente'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-black/20">
                        {allMessages
                          .filter(m => m.sender_id === selectedUser)
                          .map(msg => (
                            <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${
                                msg.is_admin 
                                  ? 'bg-neon-purple text-white rounded-tr-none shadow-[0_0_10px_rgba(191,0,255,0.2)]' 
                                  : 'bg-white/10 text-gray-300 rounded-tl-none border border-white/5'
                              }`}>
                                {msg.text}
                                <div className="text-[9px] mt-2 opacity-40 uppercase font-bold tracking-tighter text-right">
                                  {new Date(msg.created_at).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        <div ref={adminScrollRef} />
                      </div>

                      <form onSubmit={handleAdminSend} className="p-6 border-t border-white/10 bg-black/60 flex gap-4">
                        <input 
                          type="text" 
                          value={adminInput}
                          onChange={(e) => setAdminInput(e.target.value)}
                          placeholder="Digite sua resposta..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-purple transition-all"
                        />
                        <button type="submit" className="w-12 h-12 bg-neon-purple rounded-xl flex items-center justify-center shadow-[0_0_15px_#BF00FF] active:scale-95 transition-all">
                          <Send className="w-5 h-5" />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-12 text-center">
                      <MessageSquare className="w-16 h-16 mb-6 opacity-10" />
                      <div className="font-bebas text-2xl tracking-[0.2em] uppercase opacity-40">Selecione uma conversa para começar o suporte</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
