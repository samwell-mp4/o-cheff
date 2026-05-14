import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ChatWindow from './components/ChatWindow';
import CartDrawer from './components/CartDrawer';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { supabase } from './lib/supabaseClient';
import { Loader2 } from 'lucide-react';

const LogoutHandler = ({ onLogout }) => {
  useEffect(() => { onLogout(); }, [onLogout]);
  return <div className="min-h-screen bg-[#050510] flex items-center justify-center text-red-500 font-bebas text-2xl animate-pulse">Deslogando...</div>;
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('chefao_cart') || '[]'));
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const syncAuth = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      await handleAuthChange(s);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      handleAuthChange(s);
    });

    syncAuth();
    return () => subscription.unsubscribe();
  }, []);

  const handleAuthChange = async (s) => {
    setSession(s);
    if (s) {
      try {
        const { data, error } = await supabase.from('profiles').select('role').eq('id', s.user.id).single();
        setUserRole(!error && data ? data.role : 'user');
      } catch (e) {
        setUserRole('user');
      }
    } else {
      setUserRole(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    localStorage.setItem('chefao_cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCart([]);
    localStorage.removeItem('chefao_cart');
    navigate('/login');
  };

  const onAddToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...p, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
        <span className="font-bebas text-2xl tracking-[0.3em] text-white animate-pulse uppercase">Autenticando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510]">
      <ScrollToTop />
      {!isAdminPage && (
        <Navbar 
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)}
          session={session} 
          userRole={userRole}
          onLogout={handleLogout}
        />
      )}
      
      <CartDrawer 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}
        cart={cart} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i))}
        onRemoveItem={(id) => setCart(prev => prev.filter(i => i.id !== id))}
        onCheckout={() => { setIsCartOpen(false); navigate('/checkout'); }}
      />

      <Routes>
        <Route path="/" element={<Home onAddToCart={onAddToCart} />} />
        <Route path="/shop" element={<Shop onAddToCart={onAddToCart} />} />
        <Route path="/produto/:slug" element={<ProductDetails onAddToCart={onAddToCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout cart={cart} session={session} onClearCart={() => setCart([])} />} />
        <Route path="/orders" element={session ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={session ? <UserDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/admin/*" element={
          session ? (
            userRole === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/dashboard" />
          ) : <Navigate to="/login" />
        } />
        <Route path="/logout" element={<LogoutHandler onLogout={handleLogout} />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </div>
  );
}
