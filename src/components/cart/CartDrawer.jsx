import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItemsCount,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-[#0B0F17] text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-base font-bold tracking-tight text-white block">
                      Shopping Bag
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-8 h-8 stroke-[1.4]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-900">
                        Your bag is currently empty
                      </p>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Discover top tech gear, audio equipment, smart devices, and productivity essentials.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeCart();
                        navigate('/products');
                      }}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 divide-y divide-slate-100">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="pt-4 first:pt-0 flex items-center gap-4 group"
                      >
                        {/* Image */}
                        <Link
                          to={`/products/${product.slug}`}
                          onClick={closeCart}
                          className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0"
                        >
                          <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1547932087-59a8f2be576e?auto=format&fit=crop&w=400&q=80'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                            {product.categoryName}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            <Link
                              to={`/products/${product.slug}`}
                              onClick={closeCart}
                              className="hover:text-emerald-600 transition-colors"
                            >
                              {product.name}
                            </Link>
                          </h4>
                          <p className="text-xs font-black text-slate-900">
                            {formatCurrency(product.price)}
                          </p>

                          {/* Quantity selector */}
                          <div className="flex items-center gap-3 pt-1">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 px-1 py-0.5">
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity - 1)
                                }
                                className="p-1 text-slate-500 hover:text-slate-900"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-slate-900 min-w-5 text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity + 1)
                                }
                                className="p-1 text-slate-500 hover:text-slate-900"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Remove product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-black text-slate-900 text-sm">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-bold">
                        {subtotal >= 1999 ? 'Free Delivery' : 'Calculated at checkout'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleViewCartClick}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      View Cart
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NEXBUY Verified Authentic & Official Warranty</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
