import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Lock, Mail, AlertCircle, ShieldCheck, UserPlus, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else navigate('/admin');
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) {
        setError(error.message);
      } else {
        if (data?.user?.identities?.length === 0) {
          setError("Este e-mail já está cadastrado!");
        } else {
          setMessage("Cadastro realizado! Verifique seu e-mail ou faça login.");
          setIsLogin(true);
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-40 pb-20 flex items-center justify-center relative overflow-hidden">
      <div className="cinematic-rays opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-md relative z-10"
      >
        <div className="glass-card p-10 rounded-[40px] border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border transition-all duration-500 ${isLogin ? 'bg-neon-cyan/20 border-neon-cyan/30' : 'bg-neon-purple/20 border-neon-purple/30'}`}>
              {isLogin ? <ShieldCheck className="text-neon-cyan w-10 h-10" /> : <UserPlus className="text-neon-purple w-10 h-10" />}
            </div>
            <h1 className="text-4xl font-black font-gamer tracking-tighter mb-2">
              {isLogin ? 'ACESSO ' : 'CRIAR '} 
              <span className={isLogin ? 'neon-cyan' : 'neon-purple'}>{isLogin ? 'SISTEMA' : 'CONTA'}</span>
            </h1>
            <p className="text-[#888888] font-bebas text-xl tracking-widest uppercase">
              {isLogin ? 'Bem-vindo de volta' : 'Junte-se à elite MM2'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-[#888888] font-bebas text-lg tracking-widest mb-2">NOME COMPLETO</label>
                  <div className="relative">
                    <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Ex: Samuel Alencar"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:border-neon-purple outline-none transition-all"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[#888888] font-bebas text-lg tracking-widest mb-2">EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="seu@email.com"
                  className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 outline-none transition-all ${isLogin ? 'focus:border-neon-cyan' : 'focus:border-neon-purple'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#888888] font-bebas text-lg tracking-widest mb-2">SENHA</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 outline-none transition-all ${isLogin ? 'focus:border-neon-cyan' : 'focus:border-neon-purple'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center gap-3 text-green-500 text-sm">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                {message}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-5 flex items-center justify-center gap-3 text-xl transition-all font-gamer font-black shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 rounded-2xl ${
                isLogin ? 'bg-neon-cyan text-black shadow-neon-cyan/20' : 'bg-neon-purple text-white shadow-neon-purple/20'
              }`}
            >
              {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              {loading ? 'AGUARDE...' : (isLogin ? 'ENTRAR AGORA' : 'CRIAR CONTA')}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}
              className="text-[#888888] hover:text-white font-bebas text-lg tracking-widest uppercase transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="mt-8 w-full text-center text-gray-500 hover:text-white font-bebas text-lg tracking-widest uppercase transition-colors"
        >
          Voltar para a Loja
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
