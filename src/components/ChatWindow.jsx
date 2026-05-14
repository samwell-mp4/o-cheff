import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Zap, ShieldCheck, CheckCircle, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [session, setSession] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchMessages(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchMessages(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMessages = async (userId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId}`)
      .order('created_at', { ascending: true });
    
    if (!error) setMessages(data);

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-${userId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${userId}`
      }, (payload) => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !session) return;

    const { error } = await supabase
      .from('messages')
      .insert([{
        text: input,
        sender_id: session.user.id,
        sender_name: session.user.user_metadata?.full_name || 'Cliente',
        is_admin: false
      }]);

    if (!error) setInput('');
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#050510]">
      <div className="container max-w-2xl">
        <div className="glass-card rounded-[32px] overflow-hidden flex flex-col h-[700px] border-white/10 shadow-2xl">
          {/* Header */}
          <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neon-cyan/20 rounded-full flex items-center justify-center relative">
                <Zap className="text-neon-cyan w-6 h-6" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-neon-green rounded-full border-2 border-bg-dark" />
              </div>
              <div>
                <h3 className="font-bold text-lg">SUPORTE CHEFÃO</h3>
                <div className="text-[10px] text-neon-green font-bold uppercase tracking-widest">Atendimento Ativo</div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 font-bebas tracking-widest">
              <ShieldCheck className="w-4 h-4 text-neon-purple" /> 100% SEGURO
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth no-scrollbar"
          >
            {messages.map(msg => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${!msg.is_admin ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed ${
                  !msg.is_admin 
                    ? 'bg-neon-cyan text-black font-bold rounded-tr-none' 
                    : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                }`}>
                  {msg.text}
                  <div className={`text-[9px] mt-2 opacity-50 uppercase tracking-widest ${
                    !msg.is_admin ? 'text-black' : 'text-gray-400'
                  }`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                <MessageSquare className="w-16 h-16 mb-4" />
                <p className="font-bebas text-xl tracking-widest uppercase">Envie uma mensagem para começar o atendimento</p>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-black/40 border-t border-white/10">
            <form onSubmit={handleSend} className="flex gap-4">
              <input 
                type="text" 
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 outline-none focus:border-neon-cyan transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                className="w-14 h-14 bg-neon-cyan text-black rounded-xl flex items-center justify-center shadow-[0_0_15px_#00FFFF] hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              <CheckCircle className="w-3 h-3" /> Chat Criptografado de Ponta a Ponta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
