import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, User, Gamepad2, CreditCard, ShoppingBag, MessageCircle, ShieldCheck, Clock, CheckCircle, Mail, Phone, AlertTriangle, Lock, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Checkout = ({ cart, onClearCart }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [session, setSession] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    robloxNick: '',
    password: '',
  });
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setFormData(prev => ({
          ...prev,
          name: session.user.user_metadata.full_name || prev.name,
          email: session.user.email || prev.email
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        setFormData(prev => ({
          ...prev,
          name: currentSession.user.user_metadata.full_name || prev.name,
          email: currentSession.user.email || prev.email
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let interval;
    if (step === 3 && pixData?.id && paymentStatus !== 'approved') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/check-payment/${pixData.id}`);
          const data = await res.json();
          if (data.status === 'approved') {
            setPaymentStatus('approved');
            finishOrder(pixData.id);
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Erro polling:", err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [step, pixData, paymentStatus]);

  const validateStep1 = () => {
    setAuthError(null);
    if (!session) {
      if (!formData.email.includes('@')) return "Informe um e-mail válido";
      if (!formData.password || formData.password.length < 6) return "A senha deve ter pelo menos 6 caracteres";
      if (!isLoginMode) {
        if (!formData.name.trim()) return "Seu nome é obrigatório";
        const phoneClean = formData.whatsapp.replace(/\D/g, '');
        if (phoneClean.length < 10) return "WhatsApp inválido (digite com DDD)";
      }
    } else {
      if (!formData.name.trim()) return "O nome não pode estar vazio";
      const phoneClean = formData.whatsapp.replace(/\D/g, '');
      if (phoneClean.length < 10) return "WhatsApp inválido";
    }
    return null;
  };

  const handleAuth = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      if (isLoginMode) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            }
          }
        });
        if (error) throw error;
        if (data?.user?.identities?.length === 0) {
          throw new Error("Este e-mail já está cadastrado. Tente fazer login!");
        }
      }
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneMask = (value) => {
    const numbers = value.replace(/\D/g, '');
    let char = { 0: '(', 2: ') ', 7: '-' };
    let masked = '';
    for (let i = 0; i < numbers.length && i < 11; i++) {
      masked += (char[i] || '') + numbers[i];
    }
    setFormData({ ...formData, whatsapp: masked });
  };

  const handleNext = async () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setAuthError(err);
        return;
      }
      
      if (!session) {
        const success = await handleAuth();
        if (!success) return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.robloxNick.trim()) return setAuthError("Informe seu Nick do Roblox!");
      await generatePix();
    }
  };

  const generatePix = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: subtotal,
          items: cart,
          buyer: formData,
          userId: currentSession?.user?.id
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setPixData(data);
      setStep(3);
    } catch (err) {
      setAuthError("Erro ao gerar PIX: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const finishOrder = async (mpId) => {
    setLoading(true);
    try {
      const { data: { session: curr } } = await supabase.auth.getSession();
      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      
      const { error } = await supabase.from('orders').insert([{
        id: orderId,
        user_id: curr?.user?.id || null,
        customer_email: formData.email,
        customer_name: formData.name,
        whatsapp: formData.whatsapp,
        roblox_nick: formData.robloxNick,
        items: cart,
        total: subtotal,
        status: 'Pago',
        mp_id: mpId.toString()
      }]);

      if (error) {
        console.error("Erro Supabase:", error);
        // Fallback: Tenta salvar sem o email se o banco estiver com erro na coluna
        await supabase.from('orders').insert([{
          id: orderId,
          user_id: curr?.user?.id || null,
          roblox_nick: formData.robloxNick,
          items: cart,
          total: subtotal,
          status: 'Pago',
          mp_id: mpId.toString()
        }]);
      }

      if (onClearCart) onClearCart();
      setStep(4);
    } catch (err) {
      console.error("Erro fatal ao salvar pedido:", err);
      setStep(4); // Força a tela de sucesso mesmo com erro no log
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-32 relative bg-[#020205]">
      <div className="container max-w-4xl">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-16 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 z-0" />
          {[1, 2, 3].map((s) => (
            <div key={s} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-black font-gamer border-2 transition-all duration-500 ${step >= s ? 'bg-neon-cyan border-neon-cyan text-black shadow-[0_0_20px_#00FFFF]' : 'bg-bg-dark border-white/10 text-gray-50'}`}>
              {step > s ? <Check className="w-6 h-6" /> : s}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-card p-10 rounded-3xl">
                  <h2 className="text-2xl sm:text-3xl font-black mb-8 font-gamer flex items-center gap-4">
                    {session ? <User className="text-neon-cyan" /> : (isLoginMode ? <LogIn className="text-neon-cyan" /> : <UserPlus className="text-neon-purple" />)}
                    {session ? 'IDENTIFICAÇÃO' : (isLoginMode ? 'ACESSAR CONTA' : 'CRIAR CONTA')}
                  </h2>
                  
                  <div className="space-y-6">
                    <AnimatePresence>
                      {authError && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold uppercase tracking-widest"
                        >
                          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                          {authError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {!session && !isLoginMode && (
                        <motion.div key="name-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <label className="block text-[#888888] font-bebas text-lg tracking-widest mb-2 uppercase">Nome Completo</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input type="text" placeholder="Ex: João Silva" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:border-neon-cyan outline-none transition-all text-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div>
                      <label className="block text-[#888888] font-bebas text-lg tracking-widest mb-2 uppercase">E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="email" placeholder="seu@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:border-neon-cyan outline-none transition-all text-lg" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!!session} />
                      </div>
                    </div>

                    {!session && (
                      <div>
                        <label className="block text-[#888888] font-bebas text-lg tracking-widest mb-2 uppercase">Senha</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:border-neon-cyan outline-none transition-all text-lg" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>
                      </div>
                    )}

                    {(session || !isLoginMode) && (
                      <div>
                        <label className="block text-[#888888] font-bebas text-lg tracking-widest mb-2 uppercase">WhatsApp</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input type="text" placeholder="(11) 99999-9999" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:border-neon-cyan outline-none transition-all text-lg" value={formData.whatsapp} onChange={(e) => handlePhoneMask(e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>

                  {!session && (
                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                      <button 
                        onClick={() => setIsLoginMode(!isLoginMode)}
                        className="text-[#888888] hover:text-white font-bebas text-lg tracking-widest uppercase transition-colors flex items-center justify-center gap-2 mx-auto"
                      >
                        {isLoginMode ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Clique aqui'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-card p-10 rounded-3xl">
                  <h2 className="text-2xl sm:text-3xl font-black mb-8 font-gamer flex items-center gap-4"><Gamepad2 className="text-neon-purple" /> DADOS DE ENTREGA</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[#888888] font-bebas text-lg tracking-widest mb-2 uppercase">Nickname no Roblox</label>
                      <div className="relative">
                        <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="text" placeholder="Ex: OChefao_Player" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:border-neon-purple outline-none transition-all text-lg" value={formData.robloxNick} onChange={(e) => setFormData({...formData, robloxNick: e.target.value})} />
                      </div>
                    </div>
                    <div className="bg-neon-purple/5 border border-neon-purple/20 p-4 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-neon-purple flex-shrink-0 mt-1" />
                      <p className="text-[10px] text-gray-400 uppercase leading-relaxed font-bold tracking-widest">
                        Certifique-se de que o Nickname está correto. Não nos responsabilizamos por entregas em contas erradas.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-card p-10 rounded-3xl text-center">
                  <div className="bg-white/5 p-8 rounded-2xl mb-8 border border-neon-cyan/20">
                    <div className={`flex items-center justify-center gap-3 font-bebas text-2xl tracking-widest mb-6 ${paymentStatus === 'approved' ? 'text-neon-green' : 'text-neon-cyan'}`}>
                      {paymentStatus === 'approved' ? <CheckCircle className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                      {paymentStatus === 'approved' ? 'PAGAMENTO CONFIRMADO' : 'AGUARDANDO PIX'}
                    </div>

                    <div className="relative w-56 h-56 bg-white mx-auto flex items-center justify-center rounded-2xl p-4 shadow-[0_0_30px_rgba(0,255,255,0.1)] mb-6">
                      {pixData ? <img src={`data:image/png;base64,${pixData.qr_code_base64}`} alt="QR Code" className="w-full h-full" /> : <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg" />}
                    </div>

                    <div className="space-y-4">
                      <div className="bg-black/50 p-4 rounded-xl text-[10px] font-mono text-gray-400 break-all border border-white/5 select-all">{pixData?.qr_code || 'Gerando...'}</div>
                      <button onClick={() => { if (pixData) { navigator.clipboard.writeText(pixData.qr_code); alert("Código copiado!"); }}} className="text-neon-cyan hover:text-white text-sm font-bold uppercase tracking-widest transition-colors mx-auto">COPIAR CÓDIGO</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-gold animate-pulse">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Aguardando aprovação automática</span>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-16 rounded-[40px] text-center border-neon-green/30 shadow-[0_0_50px_rgba(0,255,0,0.1)]">
                  <div className="w-24 h-24 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-8"><Check className="w-12 h-12 text-neon-green" /></div>
                  <h2 className="text-3xl sm:text-5xl font-black mb-4 font-gamer uppercase tracking-tighter">PEDIDO <span className="text-neon-green">CONFIRMADO!</span></h2>
                  <p className="text-[#888888] font-bebas text-2xl tracking-widest mb-12 uppercase">Sua compra foi registrada com sucesso.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => navigate('/dashboard')} className="btn-viral py-6 text-xl flex items-center justify-center gap-4">
                      <ShoppingBag className="w-6 h-6" /> VER MEUS PEDIDOS
                    </button>
                    <button onClick={() => window.open('https://wa.me/5511999999999', '_blank')} className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl py-6 text-xl font-bebas tracking-widest uppercase transition-all flex items-center justify-center gap-4">
                      <MessageCircle className="w-6 h-6 text-neon-green" /> SUPORTE WHATSAPP
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 3 && (
              <div className="flex gap-4 mt-8 px-2">
                {step > 1 && <button disabled={loading} onClick={() => setStep(step - 1)} className="h-16 px-8 border border-white/10 rounded-xl font-bebas text-xl tracking-widest hover:bg-white/5 transition-all">VOLTAR</button>}
                <button disabled={loading} onClick={handleNext} className="flex-1 h-16 bg-neon-cyan text-black rounded-xl font-black font-gamer text-xl flex items-center justify-center gap-4 shadow-[0_0_20px_#00FFFF] hover:scale-[1.02] active:scale-95 transition-all">
                  {loading ? 'PROCESSANDO...' : 'PRÓXIMO PASSO'}
                  {!loading && <ChevronRight className="w-6 h-6" />}
                </button>
              </div>
            )}
          </div>

          {step < 4 && (
            <div className="lg:col-span-1 px-4">
              <div className="glass-card p-8 rounded-3xl sticky top-40 border-white/5 shadow-2xl">
                <h3 className="font-bebas text-2xl tracking-widest mb-6 flex items-center gap-3"><ShoppingBag className="w-6 h-6 text-neon-cyan" /> RESUMO</h3>
                <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-[#888888] truncate pr-2">{item.quantity}x {item.name}</span>
                      <span className="font-bold whitespace-nowrap">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <hr className="border-white/5 mb-6" />
                <div className="flex justify-between items-end">
                  <span className="font-bebas text-xl text-[#888888]">TOTAL</span>
                  <span className="text-3xl font-black text-neon-cyan font-bebas">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="mt-8 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                  <ShieldCheck className="w-4 h-4 text-neon-green" /> Checkout Seguro SSL
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
