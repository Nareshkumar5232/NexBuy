import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWished = isInWishlist(product?.id);

  if (!product) return null;

  const imageUrl =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 p-4 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between h-full">
      {/* Top Badges & Wishlist */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {discountPercent && (
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white tracking-wide shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.badge && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-100 tracking-wide">
              {product.badge}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isWished
              ? 'bg-rose-50 text-rose-500 shadow-xs'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title="Save to wishlist"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <Link
        to={`/products/${product.slug}`}
        className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center mb-4 block"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      {/* Information Section */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-emerald-600">
              {product.categoryName || product.categorySlug}
            </span>
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-slate-400">({product.reviewsCount || 18})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Tagline / Subtitle */}
          {product.tagline && (
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-normal">
              {product.tagline}
            </p>
          )}
        </div>

        {/* Price & Shopping Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Green Accent Shopping Button — matching TechNest */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_4px_12px_rgba(16,185,129,0.35)] shrink-0"
            title="Add to shopping cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
