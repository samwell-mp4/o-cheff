import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, ShoppingCart, MessageSquare, Search, Filter, 
  MoreHorizontal, CheckCircle, Clock, Send, User as UserIcon, 
  Package, Plus, Trash2, Edit3, X as CloseIcon, Eye, EyeOff,
  TrendingUp, Calendar, ArrowUpRight, ChevronRight, Settings, Bell,
  Menu, LogOut, Info, AlertTriangle, Check, Zap, Activity, MousePointer2, 
  Eye as ViewIcon, ShoppingCart as CartIcon, CheckSquare, Square, RefreshCcw,
  Image as ImageIcon, Megaphone
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AdminDashboard = ({ orders }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [allMessages, setAllMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminInput, setAdminInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const adminScrollRef = useRef(null);

  // Marketing State
  const [newBannerUrl, setNewBannerUrl] = useState('');

  // Inventory Management State
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('Todas');
  const [inventoryRarity, setInventoryRarity] = useState('Todas');

  // Form State for Products
  const [productForm, setProductForm] = useState({
    name: '', price: '', category: 'Godly', rarity: 'Legendary', 
    image: '', stock: 99, is_active: true
  });

  useEffect(() => {
    fetchMessages();
    fetchProducts();
    fetchEvents();
    fetchBanners();
    
    const msgChannel = supabase
      .channel('admin-chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setAllMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    const prodChannel = supabase
      .channel('admin-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    const eventChannel = supabase
      .channel('admin-events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_events' }, (payload) => {
        setEvents(prev => [payload.new, ...prev].slice(0, 100));
      })
      .subscribe();

    const bannerChannel = supabase
      .channel('admin-banners')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, () => {
        fetchBanners();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(prodChannel);
      supabase.removeChannel(eventChannel);
      supabase.removeChannel(bannerChannel);
    };
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

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setProducts(data);
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error) setEvents(data);
  };

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('order_index', { ascending: true });
    if (!error) setBanners(data);
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBannerUrl.trim()) return;
    const { error } = await supabase.from('banners').insert([{ url: newBannerUrl, order_index: banners.length }]);
    if (!error) {
      setNewBannerUrl('');
    } else {
      alert('Erro ao adicionar banner: ' + error.message);
      console.error(error);
    }
  };

  const deleteBanner = async (id) => {
    await supabase.from('banners').delete().eq('id', id);
  };

  const toggleBannerStatus = async (banner) => {
    await supabase.from('banners').update({ is_active: !banner.is_active }).eq('id', banner.id);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const slug = productForm.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const payload = { ...productForm, slug };

    if (editingProduct) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
      if (!error) setIsModalOpen(false);
    } else {
      const { error } = await supabase.from('products').insert([payload]);
      if (!error) setIsModalOpen(false);
    }
    setEditingProduct(null);
    setProductForm({ name: '', price: '', category: 'Godly', rarity: 'Legendary', image: '', stock: 99, is_active: true });
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      await supabase.from('products').delete().eq('id', id);
    }
  };

  const toggleProductStatus = async (product) => {
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id);
  };

  // Bulk Actions
  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredInventory.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredInventory.map(p => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Excluir ${selectedProductIds.length} produtos permanentemente?`)) {
      const { error } = await supabase.from('products').delete().in('id', selectedProductIds);
      if (!error) setSelectedProductIds([]);
    }
  };

  const handleBulkStatus = async (status) => {
    const { error } = await supabase.from('products').update({ is_active: status }).in('id', selectedProductIds);
    if (!error) setSelectedProductIds([]);
  };

  const handleAdminSend = async (e) => {
    e.preventDefault();
    if (!adminInput.trim() || !selectedUser) return;
    const { error } = await supabase.from('messages').insert([{
      text: adminInput,
      sender_id: selectedUser,
      is_admin: true,
      sender_name: 'Suporte Chefão'
    }]);
    if (!error) setAdminInput('');
  };

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);

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

  const filteredInventory = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCategory = inventoryCategory === 'Todas' || p.category === inventoryCategory;
    const matchesRarity = inventoryRarity === 'Todas' || p.rarity === inventoryRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Vendas', icon: ShoppingCart },
    { id: 'inventory', label: 'Estoque', icon: Package },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'chats', label: 'Atendimento', icon: MessageSquare },
    { id: 'analytics', label: 'Rastreamento', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white flex">
      {/* Sidebar SaaS Style */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-[#080812] border-r border-white/5 z-50 flex flex-col"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-cyan rounded-xl flex items-center justify-center shadow-[0_0_20px_#00FFFF66]">
            <Zap className="w-6 h-6 text-black" />
          </div>
          {sidebarOpen && <span className="font-gamer text-xl tracking-tighter">O CHEFÃO <span className="text-neon-cyan">ADMIN</span></span>}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="font-bebas text-lg tracking-widest">{item.label}</span>}
              {activeTab === item.id && sidebarOpen && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button className="flex items-center gap-4 text-gray-500 hover:text-red-500 transition-colors w-full px-4 py-2">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-bebas text-lg tracking-widest">Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
        <header className="h-20 bg-[#080812]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400"><Menu className="w-6 h-6" /></button>
            <h2 className="font-bebas text-2xl tracking-widest uppercase">{menuItems.find(m => m.id === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            </button>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="w-8 h-8 bg-neon-purple rounded-lg flex items-center justify-center font-bold text-xs uppercase">A</div>
              <span className="text-xs font-bold text-gray-300">ADMINISTRADOR</span>
            </div>
          </div>
        </header>

        <div className="p-10">
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Receita Total', val: `R$ ${totalSales.toFixed(2)}`, icon: TrendingUp, color: 'text-neon-cyan', trend: '+12.5%' },
                  { label: 'Pedidos Realizados', val: orders.length, icon: ShoppingCart, color: 'text-neon-purple', trend: '+5.2%' },
                  { label: 'Usuários Ativos', val: userChats.length, icon: Users, color: 'text-gold', trend: '+24%' },
                  { label: 'Taxa de Conversão', val: '64%', icon: ArrowUpRight, color: 'text-neon-green', trend: '+3.1%' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0a0a1a] p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                    <div className={`${stat.color} mb-6 p-3 bg-white/5 w-fit rounded-xl`}><stat.icon className="w-6 h-6" /></div>
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</div>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-black font-gamer tracking-tighter">{stat.val}</div>
                      <div className="text-neon-green text-[10px] font-bold">{stat.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0a0a1a] rounded-3xl border border-white/5 overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bebas text-xl tracking-widest uppercase">Pedidos Recentes</h3>
                  </div>
                  <div className="p-0">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-gray-500 uppercase font-bebas tracking-widest text-[10px]">
                          <th className="p-8 pb-4">Cliente</th>
                          <th className="p-8 pb-4">Valor</th>
                          <th className="p-8 pb-4">Status</th>
                          <th className="p-8 pb-4">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-8 flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold">{o.customer_name?.[0] || 'U'}</div>
                              <div><div className="font-bold">{o.customer_name}</div><div className="text-[10px] text-gray-500 font-mono">@{o.roblox_nick}</div></div>
                            </td>
                            <td className="p-8 font-bold">R$ {o.total.toFixed(2)}</td>
                            <td className="p-8"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${o.status === 'Pago' ? 'bg-neon-green/10 text-neon-green' : 'bg-gold/10 text-gold'}`}>{o.status}</span></td>
                            <td className="p-8 text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-[#0a0a1a] rounded-3xl border border-white/5 p-8 flex flex-col h-full">
                   <h3 className="font-bebas text-xl tracking-widest uppercase mb-8 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-neon-purple" /> Alertas de Estoque</h3>
                   <div className="space-y-4 flex-1">
                      {products.filter(p => p.stock < 10).slice(0, 4).map(p => (
                        <div key={p.id} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5">
                           <div className="flex items-center gap-3">
                             <img src={p.image} className="w-10 h-10 object-contain" alt="" />
                             <div><div className="font-bold text-sm truncate max-w-[120px]">{p.name}</div><div className="text-neon-purple text-[10px] font-bold">{p.stock} RESTANTES</div></div>
                           </div>
                           <button className="p-2 hover:bg-white/10 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="space-y-8">
              <div className="bg-[#0a0a1a] p-10 rounded-[40px] border border-white/5 shadow-2xl">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-neon-cyan/20 rounded-2xl flex items-center justify-center">
                       <ImageIcon className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black font-gamer tracking-tighter uppercase">Configurar <span className="text-neon-cyan">Carrossel</span></h3>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Gerencie os banners da homepage (Até 5 recomendados)</p>
                    </div>
                 </div>

                 <form onSubmit={handleAddBanner} className="flex gap-4 mb-10">
                    <input 
                      type="text" 
                      placeholder="Cole a URL da imagem aqui (Google Drive, Imgur, etc)..."
                      value={newBannerUrl}
                      onChange={(e) => setNewBannerUrl(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-cyan transition-all"
                    />
                    <button type="submit" className="bg-neon-cyan text-black px-8 py-4 rounded-2xl font-bebas text-xl tracking-widest shadow-[0_0_20px_#00FFFF44] hover:scale-105 transition-all">
                       ADICIONAR BANNER
                    </button>
                 </form>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {banners.map((banner, index) => (
                      <div key={banner.id} className="relative group">
                         <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 bg-black/40">
                            <img src={banner.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" alt="" />
                         </div>
                         <div className="absolute top-4 right-4 flex gap-2">
                            <button 
                              onClick={() => toggleBannerStatus(banner)}
                              className={`p-2 rounded-xl transition-all ${banner.is_active ? 'bg-neon-green text-black shadow-[0_0_15px_#00FF0088]' : 'bg-gray-800 text-gray-400'}`}
                            >
                               {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => deleteBanner(banner.id)}
                              className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl shadow-[0_0_15px_#FF000044] transition-all"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                         <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] font-black tracking-widest">
                            ORDEM: #{index + 1}
                         </div>
                      </div>
                    ))}
                    {banners.length === 0 && (
                       <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-10" />
                          <p className="text-gray-600 font-bebas text-xl tracking-widest uppercase">Nenhum banner cadastrado</p>
                       </div>
                    )}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="bg-[#0a0a1a] p-6 rounded-3xl border border-white/5 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                   <input type="text" placeholder="Pesquisar produto..." value={inventorySearch} onChange={(e) => setInventorySearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-neon-cyan" />
                </div>
                <select value={inventoryCategory} onChange={(e) => setInventoryCategory(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-neon-cyan font-bebas tracking-widest uppercase">
                  <option value="Todas">Todas Categorias</option>
                  <option value="Godly">Godly</option>
                  <option value="Ancient">Ancient</option>
                  <option value="Chroma">Chroma</option>
                  <option value="Sailor Piece">Sailor Piece</option>
                </select>
                <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: '', category: 'Godly', rarity: 'Legendary', image: '', stock: 99, is_active: true }); setIsModalOpen(true); }} className="bg-neon-green text-black px-6 py-3 rounded-2xl font-bebas text-lg tracking-widest flex items-center gap-2"><Plus className="w-4 h-4" /> NOVO ITEM</button>
              </div>

              <AnimatePresence>
                {selectedProductIds.length > 0 && (
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-neon-cyan text-black px-8 py-4 rounded-3xl shadow-[0_0_40px_#00FFFF44] flex items-center gap-8 z-[100]">
                    <div className="font-bebas text-xl tracking-widest">{selectedProductIds.length} ITENS SELECIONADOS</div>
                    <div className="flex items-center gap-4">
                       <button onClick={() => handleBulkStatus(true)} className="flex items-center gap-2 hover:bg-black/10 px-3 py-1 rounded-lg transition-all font-bold text-xs uppercase"><Eye className="w-4 h-4" /> ATIVAR</button>
                       <button onClick={() => handleBulkStatus(false)} className="flex items-center gap-2 hover:bg-black/10 px-3 py-1 rounded-lg transition-all font-bold text-xs uppercase"><EyeOff className="w-4 h-4" /> OCULTAR</button>
                       <button onClick={handleBulkDelete} className="flex items-center gap-2 hover:bg-black/10 px-3 py-1 rounded-lg transition-all font-bold text-xs uppercase text-red-600"><Trash2 className="w-4 h-4" /> EXCLUIR</button>
                    </div>
                    <button onClick={() => setSelectedProductIds([])} className="p-1 hover:bg-black/10 rounded-full transition-all"><CloseIcon className="w-5 h-5" /></button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-[#0a0a1a] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-500 font-bebas text-xs tracking-[0.3em] uppercase">
                        <th className="p-6 w-16"><button onClick={toggleSelectAll} className="p-1">{selectedProductIds.length === filteredInventory.length && filteredInventory.length > 0 ? <CheckSquare className="w-5 h-5 text-neon-cyan" /> : <Square className="w-5 h-5" />}</button></th>
                        <th className="p-6">Produto</th>
                        <th className="p-6">Preço</th>
                        <th className="p-6">Estoque</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredInventory.map(product => (
                        <tr key={product.id} className={`hover:bg-white/[0.02] transition-colors group ${selectedProductIds.includes(product.id) ? 'bg-neon-cyan/5' : ''}`}>
                          <td className="p-6"><button onClick={() => toggleSelectOne(product.id)} className="p-1">{selectedProductIds.includes(product.id) ? <CheckSquare className="w-5 h-5 text-neon-cyan" /> : <Square className="w-5 h-5" />}</button></td>
                          <td className="p-6"><div className="flex items-center gap-4"><img src={product.image} className="w-10 h-10 object-contain" alt="" /><div><div className="font-bold">{product.name}</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">{product.category} | {product.rarity}</div></div></div></td>
                          <td className="p-6 font-bold text-lg">R$ {parseFloat(product.price).toFixed(2)}</td>
                          <td className="p-6"><div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-neon-green'}`} /><span className="font-mono text-gray-300">{product.stock} UN</span></div></td>
                          <td className="p-6"><button onClick={() => toggleProductStatus(product)}>{product.is_active ? <span className="text-[10px] bg-neon-green/10 text-neon-green px-3 py-1 rounded-full font-bold uppercase">Ativo</span> : <span className="text-[10px] bg-red-500/10 text-red-500 px-3 py-1 rounded-full font-bold uppercase">Oculto</span>}</button></td>
                          <td className="p-6 text-right"><div className="flex gap-2 justify-end"><button onClick={() => { setEditingProduct(product); setProductForm(product); setIsModalOpen(true); }} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white"><Edit3 className="w-4 h-4" /></button><button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-500/30 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-[#0a0a1a] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]"><h3 className="text-2xl font-black font-gamer tracking-tighter uppercase">Gestão de <span className="neon-cyan">Pedidos</span></h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-white/5 text-gray-500 font-bebas text-sm tracking-widest uppercase"><th className="p-8">ID / Data</th><th className="p-8">Cliente</th><th className="p-8">Itens</th><th className="p-8">Valor</th><th className="p-8">Status</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors"><td className="p-8"><div className="font-mono text-neon-cyan text-xs">#{order.id}</div><div className="text-[10px] text-gray-500 mt-1 uppercase">{new Date(order.created_at).toLocaleString()}</div></td><td className="p-8"><div className="font-bold">{order.customer_name}</div><div className="text-xs text-neon-purple font-mono">@{order.roblox_nick}</div></td><td className="p-8 text-sm">{order.items?.length || 0} item(s)</td><td className="p-8 font-bold text-lg">R$ {order.total.toFixed(2)}</td><td className="p-8"><span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${order.status === 'Pago' ? 'bg-neon-green/10 text-neon-green' : 'bg-gold/10 text-gold'}`}>{order.status}</span></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}

          {activeTab === 'chats' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[750px] bg-[#0a0a1a] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
                <div className="lg:col-span-1 border-r border-white/5 flex flex-col bg-black/20">
                  <div className="p-8 border-b border-white/10 flex items-center justify-between"><h4 className="font-bebas text-2xl tracking-widest text-neon-purple">Conversas</h4><span className="bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded text-[10px] font-bold">{userChats.length}</span></div>
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {userChats.map((chat) => (
                      <div key={chat.userId} onClick={() => setSelectedUser(chat.userId)} className={`p-6 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.03] ${selectedUser === chat.userId ? 'bg-neon-purple/10 border-l-4 border-l-neon-purple' : ''}`}><div className="flex justify-between items-start mb-2"><div className="font-bold text-white uppercase text-sm truncate pr-2">{chat.name}</div><div className="text-[9px] text-gray-500 whitespace-nowrap">{new Date(chat.lastMessage.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div></div><p className="text-[11px] text-gray-500 truncate">{chat.lastMessage.text}</p></div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 flex flex-col bg-black/40">{selectedUser ? (<><div className="p-8 border-b border-white/10 bg-white/2 flex justify-between items-center"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-neon-purple/20 rounded-2xl flex items-center justify-center"><UserIcon className="w-6 h-6 text-neon-purple" /></div><div><span className="font-bold uppercase text-lg block leading-none">{userChats.find(c => c.userId === selectedUser)?.name || 'Cliente'}</span><span className="text-[10px] text-neon-green font-bold uppercase tracking-widest">Online</span></div></div></div><div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">{allMessages.filter(m => m.sender_id === selectedUser).map(msg => (<div key={msg.id} className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] p-5 rounded-3xl text-sm leading-relaxed ${msg.is_admin ? 'bg-neon-purple text-white rounded-tr-none shadow-[0_10px_20px_rgba(191,0,255,0.2)]' : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'}`}>{msg.text}<div className="text-[9px] mt-3 opacity-30 uppercase font-black tracking-tighter text-right">{new Date(msg.created_at).toLocaleTimeString()}</div></div></div>))}<div ref={adminScrollRef} /></div><div className="p-8 border-t border-white/10 bg-black/60"><form onSubmit={handleAdminSend} className="relative flex items-center"><input type="text" value={adminInput} onChange={(e) => setAdminInput(e.target.value)} placeholder="Escreva sua mensagem aqui..." className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-20 py-5 outline-none focus:border-neon-purple transition-all placeholder:text-gray-700" /><button type="submit" className="absolute right-4 w-12 h-12 bg-neon-purple rounded-xl flex items-center justify-center shadow-[0_0_20px_#BF00FF99] hover:scale-105 active:scale-95 transition-all"><Send className="w-5 h-5" /></button></form></div></>) : (<div className="flex-1 flex flex-col items-center justify-center text-gray-700 text-center p-20"><MessageSquare className="w-16 h-16 mb-8 opacity-20" /><h3 className="font-bebas text-3xl tracking-widest uppercase opacity-40">Selecione uma conversa</h3></div>)}</div>
              </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0a1a] p-8 rounded-3xl border border-white/5"><div className="flex items-center gap-4 mb-4"><ViewIcon className="w-6 h-6 text-neon-cyan" /><h4 className="font-bebas text-xl tracking-widest uppercase">Page Views</h4></div><div className="text-4xl font-black font-gamer tracking-tighter">{events.filter(e => e.event_type === 'page_view').length}</div></div>
                <div className="bg-[#0a0a1a] p-8 rounded-3xl border border-white/5"><div className="flex items-center gap-4 mb-4"><CartIcon className="w-6 h-6 text-neon-purple" /><h4 className="font-bebas text-xl tracking-widest uppercase">Add to Cart</h4></div><div className="text-4xl font-black font-gamer tracking-tighter">{events.filter(e => e.event_type === 'add_to_cart').length}</div></div>
                <div className="bg-[#0a0a1a] p-8 rounded-3xl border border-white/5"><div className="flex items-center gap-4 mb-4"><MousePointer2 className="w-6 h-6 text-neon-green" /><h4 className="font-bebas text-xl tracking-widest uppercase">Cliques Reais</h4></div><div className="text-4xl font-black font-gamer tracking-tighter">{events.filter(e => e.event_type === 'click').length}</div></div>
              </div>
              <div className="bg-[#0a0a1a] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/10 bg-white/5 flex justify-between items-center"><h3 className="text-2xl font-black font-gamer tracking-tighter uppercase">Live <span className="text-neon-cyan">Activity Feed</span></h3><div className="flex items-center gap-2 text-[10px] font-bold text-neon-green animate-pulse"><span className="w-2 h-2 bg-neon-green rounded-full" /> MONITORANDO AO VIVO</div></div>
                <div className="h-[600px] overflow-y-auto p-0 no-scrollbar divide-y divide-white/5">
                  {events.map((event, i) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={event.id} className="p-6 hover:bg-white/[0.02] transition-all flex items-center justify-between group"><div className="flex items-center gap-6"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 ${event.event_type === 'add_to_cart' ? 'bg-neon-purple/10 text-neon-purple' : event.event_type === 'page_view' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-white/5 text-gray-400'}`}>{event.event_type === 'add_to_cart' ? <CartIcon className="w-5 h-5" /> : event.event_type === 'page_view' ? <ViewIcon className="w-5 h-5" /> : <MousePointer2 className="w-5 h-5" />}</div><div><div className="font-bold text-sm uppercase tracking-tight">{event.event_type === 'page_view' ? 'Visualizou uma página' : event.event_type === 'add_to_cart' ? 'Adicionou item ao carrinho' : 'Interagiu com o site'}</div><div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{event.item_name ? <span className="text-white">{event.item_name}</span> : <span className="opacity-50">{event.page_url}</span>}</div></div></div><div className="text-right"><div className="text-[10px] text-gray-500 font-mono mb-1">{new Date(event.created_at).toLocaleTimeString()}</div></div></motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-[#0a0a1a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-white/10 bg-white/5 flex justify-between items-center"><h3 className="text-3xl font-black font-gamer tracking-tighter uppercase">{editingProduct ? 'Editar' : 'Novo'} Item</h3><button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors"><CloseIcon className="w-6 h-6" /></button></div>
            <form onSubmit={handleProductSubmit} className="p-10 space-y-8"><div className="grid grid-cols-2 gap-8"><div className="col-span-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Nome</label><input type="text" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-cyan" /></div><div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Preço</label><input type="number" step="0.01" required value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-cyan" /></div><div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Estoque</label><input type="number" required value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-cyan" /></div><div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Categoria</label><select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full bg-[#0d0d1f] border border-white/10 rounded-2xl px-6 py-4 outline-none text-white"><option value="Godly">Godly</option><option value="Ancient">Ancient</option><option value="Chroma">Chroma</option><option value="Sailor Piece">Sailor Piece</option></select></div><div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Raridade</label><select value={productForm.rarity} onChange={(e) => setProductForm({...productForm, rarity: e.target.value})} className="w-full bg-[#0d0d1f] border border-white/10 rounded-2xl px-6 py-4 outline-none text-white"><option value="Common">Common</option><option value="Legendary">Legendary</option><option value="Godly">Godly</option><option value="Ancient">Ancient</option></select></div><div className="col-span-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Imagem URL</label><input type="text" required value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-cyan" /></div></div><button type="submit" className="w-full bg-neon-green text-black py-4 rounded-2xl font-bebas text-2xl tracking-widest shadow-[0_0_30px_#00FF0066]">{editingProduct ? 'Salvar' : 'Cadastrar'}</button></form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
