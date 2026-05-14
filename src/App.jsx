import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import CartDrawer from './components/CartDrawer';
import Checkout from './pages/Checkout';
import FloatingCart from './components/FloatingCart';
import AdminDashboard from './pages/AdminDashboard';
import ChatWindow from './components/ChatWindow';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Footer from './components/Footer';
import EventTracker from './components/EventTracker';
import { useTracker } from './hooks/useTracker';

function App() {
  const navigate = useNavigate();
  const { trackEvent } = useTracker();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('chefao_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      const fetchOrders = async () => {
        // If admin, fetch all. If user, fetch only theirs.
        // For now, let's just fetch all for the admin dashboard and filter in the Orders page.
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error) setOrders(data);
      };

      fetchOrders();

      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
          }
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem('chefao_cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (item, quantity = 1) => {
    trackEvent('add_to_cart', { itemName: item.name, price: item.price, quantity });
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleAddOrder = async (newOrder) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        user_id: session?.user?.id,
        order_id: newOrder.id,
        customer_name: newOrder.name,
        whatsapp: newOrder.whatsapp,
        roblox_nick: newOrder.robloxNick,
        items: newOrder.items,
        total: newOrder.total,
        status: newOrder.status,
        mp_id: newOrder.mp_id
      }])
      .select()
      .single();
    
    if (error) console.error('Error saving order:', error);
    return data;
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen">
      <EventTracker />
      {!isAdminPage && (
        <Navbar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          cartCount={cartCount} 
          onOpenCart={() => setIsCartOpen(true)}
          session={session}
        />
      )}
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          navigate('/checkout');
        }}
      />

      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} onAddToCart={handleAddToCart} />} />
        <Route path="/shop" element={<Shop searchQuery={searchQuery} onAddToCart={handleAddToCart} />} />
        <Route path="/produto/:slug" element={<ProductDetails onAddToCart={handleAddToCart} />} />
        <Route 
          path="/checkout" 
          element={<Checkout cart={cart} onClearCart={() => setCart([])} onAddOrder={handleAddOrder} />} 
        />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            loading ? <div className="min-h-screen bg-[#050510]" /> : 
            session ? <AdminDashboard orders={orders} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/orders" 
          element={
            loading ? <div className="min-h-screen bg-[#050510]" /> : 
            session ? <Orders /> : <Navigate to="/login" />
          } 
        />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/reembolso" element={<Refund />} />
      </Routes>

      <Footer />
      <FloatingCart count={cartCount} onOpenCart={() => setIsCartOpen(true)} />
    </div>
  );
}

export default App;
