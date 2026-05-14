import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CartDrawer from './components/CartDrawer';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import ChatWindow from './components/ChatWindow';
import Login from './pages/Login';
import Orders from './pages/Orders';

function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
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
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
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

  return (
    <div className="min-h-screen">
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)}
        session={session}
      />
      
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
        <Route path="/produto/:slug" element={<ProductDetails onAddToCart={handleAddToCart} />} />
        <Route 
          path="/checkout" 
          element={<Checkout cart={cart} onClearCart={() => setCart([])} onAddOrder={handleAddOrder} />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={session ? <AdminDashboard orders={orders} /> : <Navigate to="/login" />} />
        <Route path="/orders" element={session ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/chat" element={<ChatWindow />} />
      </Routes>

      <footer className="py-20 border-t border-white/5 text-center mt-20">
        <div className="container">
          <div className="text-3xl font-black font-gamer tracking-tighter mb-4">O <span className="neon-cyan">CHEFÃO</span> DOS CARDS</div>
          <p className="text-[#888888] max-w-md mx-auto mb-8 font-light">
            Plataforma de elite para itens de Murder Mystery 2. Tecnologia, segurança e velocidade.
          </p>
          <div className="flex justify-center gap-8 text-[#888888] font-bebas text-xl tracking-widest">
            <a href="#" className="hover:text-neon-cyan transition-colors">WhatsApp</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">Discord</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">Instagram</a>
          </div>
          <div className="mt-12 text-xs text-gray-700 uppercase tracking-[4px]">
            © 2026 O Chefão dos Cards. PROTOCOLO v2.0
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
