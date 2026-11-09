import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="pt-20 pb-28 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-rose-500 mx-auto flex items-center justify-center">
          <Heart className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Saved Tech Gear
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Save items you want to keep an eye on by clicking the heart icon on any product.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Saved For Later
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            My Wishlist ({wishlistItems.length})
          </h1>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between group hover:border-slate-300 transition-all shadow-xs"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <Link to={`/products/${product.slug}`} className="block w-full h-full">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1547932087-59a8f2be576e?auto=format&fit=crop&w=400&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-white/90 text-slate-400 hover:text-rose-600 shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="pt-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  {product.categoryName}
                </span>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug truncate">
                  <Link to={`/products/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{product.tagline || product.brand}</p>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="font-black text-sm text-slate-900">
                {formatCurrency(product.price)}
              </span>

              <button
                onClick={() => addToCart(product, 1, true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
