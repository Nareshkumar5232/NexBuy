import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryCharge,
    discount,
    tax,
    total,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-20 pb-28 max-w-md mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            NEXBUY Cart
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Your shopping cart is empty
          </h1>
          <p className="text-xs text-slate-500">
            Discover top technology gear, headphones, smartwatches, and computer accessories.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-md"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6 pt-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Order Review
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Shopping Cart ({items.length} {items.length === 1 ? 'Item' : 'Items'})
          </h1>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="divide-y divide-slate-200 border-b border-slate-200">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
              >
                {/* Image & Title */}
                <div className="flex items-center gap-4 min-w-0">
                  <Link
                    to={`/products/${product.slug}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 shrink-0"
                  >
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1547932087-59a8f2be576e?auto=format&fit=crop&w=800&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      {product.categoryName}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      <Link to={`/products/${product.slug}`} className="hover:text-emerald-600 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{product.tagline || product.brand}</p>
                    <span className="text-xs font-bold text-slate-900 block sm:hidden pt-1">
                      {formatCurrency(product.price)} each
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 text-slate-600 hover:text-slate-900"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-xs font-bold text-slate-900 min-w-5 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1 text-slate-600 hover:text-slate-900"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      {formatCurrency(product.price * quantity)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {formatCurrency(product.price)} ea
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Reassurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Free Express Delivery</p>
                <p className="text-slate-500 text-[11px]">Free delivery on orders over ₹1,999</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Official Brand Warranty</p>
                <p className="text-slate-500 text-[11px]">Authentic products with GST invoice</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900">Order Summary</h2>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code (e.g. NEXBUY10)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white hover:bg-emerald-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>

            {appliedPromo && (
              <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                <span>Code <strong>{appliedPromo.code}</strong> applied ({appliedPromo.percentage}% off)</span>
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-slate-500 hover:text-slate-800 text-[11px] font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
          </form>

          {/* Calculations */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Delivery</span>
              <span className="text-emerald-600 font-bold">
                {subtotal >= 1999 ? 'Complimentary' : formatCurrency(deliveryCharge || 0)}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Tax / GST</span>
              <span>{tax > 0 ? formatCurrency(tax) : '₹0'}</span>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Amount</span>
              <span className="text-xl text-slate-900">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-emerald-500/25"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-slate-400 leading-relaxed">
            Encrypted checkout • Orders fulfilled from Chennai headquarters.
          </p>
        </div>
      </div>
    </div>
  );
}
