import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, ShieldCheck, CheckCircle, MessageSquare, X, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [session, setSession] = useState(null);
  const scrollRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && isOpen) {
      fetchMessages(session.user.id);
      setupRealtime(session.user.id);
    }
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [session, isOpen]);

  const fetchMessages = async (userId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId}`)
      .order('created_at', { ascending: true });
    
    if (!error) setMessages(data || []);
  };

  const setupRealtime = (userId) => {
    if (channelRef.current) return;

    channelRef.current = supabase
      .channel(`chat-realtime-${userId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${userId}`
      }, (payload) => {
        setMessages(prev => {
          const exists = prev.some(m => m.id === payload.new.id);
          if (exists) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

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
    else console.error("Erro ao enviar:", error);
  };

  if (!session) return null;

  return (
    <>
      <button id="chat-trigger" onClick={() => setIsOpen(true)} className="hidden" />

      <button 
        onClick={() => window.open('https://wa.me/5531988868362', '_blank')}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all z-[9999]"
      >
        <MessageCircle className="w-8 h-8" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-neon-cyan rounded-full border-2 border-[#050510] flex items-center justify-center">
           <div className="w-2 h-2 bg-black rounded-full animate-ping" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[90vw] max-w-[400px] h-[600px] glass-card rounded-[32px] overflow-hidden flex flex-col z-[9999] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neon-cyan/20 rounded-full flex items-center justify-center relative">
                  <Zap className="text-neon-cyan w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neon-green rounded-full border-2 border-[#1a1a2e]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-tighter">Atendimento Chefão</h3>
                  <div className="text-[9px] text-neon-green font-bold uppercase tracking-widest">Suporte Direto</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[#050510]/50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${!msg.is_admin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                    !msg.is_admin ? 'bg-neon-cyan text-black font-bold rounded-tr-none shadow-[0_0_15px_#00FFFF22]' : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                    <div className="text-[8px] mt-2 opacity-50 text-right uppercase font-bold">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <MessageSquare className="w-12 h-12 mb-4" />
                  <p className="font-bebas text-lg tracking-widest uppercase">Olá! Como podemos ajudar hoje?</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-black/60 border-t border-white/10 backdrop-blur-md">
              <form onSubmit={handleSend} className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Digite sua dúvida aqui..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-cyan transition-all text-xs text-white"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="w-12 h-12 bg-neon-cyan text-black rounded-xl flex items-center justify-center shadow-[0_0_15px_#00FFFF] hover:scale-105 active:scale-95 transition-all">
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <div className="mt-3 flex items-center justify-center gap-2 text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-neon-purple" /> Protegido pelo Chefão
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWindow;
