import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Zap, ShieldCheck, CheckCircle } from 'lucide-react';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá! Recebi seu pedido. Estou validando o pagamento no sistema.", sender: "bot", time: "Agora" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), text: input, sender: "user", time: "Agora" };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulated auto-response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Perfeito! Já identifiquei seu Nick. Por favor, aceite a solicitação de amizade do usuário 'ChefaoDelivery_BOT' para receber o item.",
        sender: "bot",
        time: "Agora"
      }]);
    }, 2000);
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
            className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
          >
            {messages.map(msg => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-neon-cyan text-black font-bold rounded-tr-none' 
                    : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                }`}>
                  {msg.text}
                  <div className={`text-[9px] mt-2 opacity-50 uppercase tracking-widest ${
                    msg.sender === 'user' ? 'text-black' : 'text-gray-400'
                  }`}>
                    {msg.time}
                  </div>
                </div>
              </motion.div>
            ))}
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
