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
import EventTracker from './components/EventTracker';
import { useTracker } from './hooks/useTracker';
import { supabase } from './lib/supabaseClient';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackEvent } = useTracker();
  const [session, setSession] = useState(null);
  const [statusAcesso, setStatusAcesso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('chefao_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const startApp = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        const { data } = await supabase.from('profiles').select('role').eq('id', s.user.id).single();
        if (data) setStatusAcesso(data.role);
      }
      setLoading(false);
    };
    startApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s) {
        setLoading(true);
        const { data } = await supabase.from('profiles').select('role').eq('id', s.user.id).single();
        if (data) setStatusAcesso(data.role);
        setLoading(false);
      } else {
        setStatusAcesso(null);
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
        if (data) setOrders(data);
      });
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem('chefao_cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...p, quantity: 1 }];
    });
    setIsCartOpen(true);
    trackEvent('add_to_cart', { item_id: p.id, item_name: p.name });
  };

  const handleUpdateQuantity = (id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i));
  const handleRemoveItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const handleAddOrder = (o) => setOrders(prev => [o, ...prev]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setStatusAcesso(null);
    setCart([]);
    localStorage.removeItem('chefao_cart');
    setLoading(false);
    navigate('/login');
  };

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#050510]">
      <EventTracker />
      {!isAdmin && (
        <Navbar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)}
          session={session} onLogout={handleLogout}
        />
      )}
      
      <CartDrawer 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}
        cart={cart} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem}
        onCheckout={() => { setIsCartOpen(false); navigate('/checkout'); }}
      />

      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} />} />
        <Route path="/produto/:slug" element={<ProductDetails onAddToCart={handleAddToCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} onClearCart={() => setCart([])} onAddOrder={handleAddOrder} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={session ? <UserDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route 
          path="/admin" 
          element={
            session ? (
              loading ? (
                <div className="min-h-screen flex items-center justify-center text-neon-cyan font-bebas text-2xl tracking-widest">Verificando...</div>
              ) : statusAcesso === 'admin' ? (
                <AdminDashboard orders={orders} onLogout={handleLogout} />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : <Navigate to="/login" />
          } 
        />
        <Route path="/orders" element={session ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/privacidade" element={<Privacy />} />
      </Routes>

      {!isAdmin && <Footer />}
    </div>
  );
}
