import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, MessageSquare } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, onCheckout }) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-bg-dark border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-neon-cyan" />
                <h2 className="text-2xl font-black font-gamer tracking-tighter">MEU <span className="neon-cyan">CARRINHO</span></h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <ShoppingBag className="w-16 h-16 mb-4" />
                  <p className="font-bebas text-2xl tracking-widest">CARRINHO VAZIO</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 glass-card p-4 rounded-xl border-white/5 relative group">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-contain drop-shadow-lg" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <div className="text-neon-cyan font-bebas text-xl mb-3">R$ {item.price.toFixed(2)}</div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white/10 text-gray-400 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white/10 text-gray-400 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/40">
                <div className="flex justify-between items-end mb-6">
                  <div className="text-[#888888] font-bebas text-xl tracking-widest">SUBTOTAL</div>
                  <div className="text-3xl font-black neon-cyan font-bebas tracking-tighter">R$ {subtotal.toFixed(2)}</div>
                </div>
                <button 
                  onClick={onCheckout}
                  className="btn-viral w-full py-4 flex items-center justify-center gap-3 text-xl"
                >
                  FINALIZAR COMPRA
                </button>
                <p className="text-center text-gray-600 text-xs mt-4 uppercase tracking-widest">
                  Processamento instantâneo de pedido
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
