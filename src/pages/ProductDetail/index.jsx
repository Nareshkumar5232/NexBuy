import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Share2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
  Star,
  CheckCircle2,
  Package,
  RotateCcw
} from 'lucide-react';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import ProductCard from '../../components/product/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setDirectBuyItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const item = await productService.getProductBySlug(slug);
        if (!item) {
          setProduct(null);
          setLoading(false);
          return;
        }
        setProduct(item);
        setSelectedImageIndex(0);
        setQuantity(1);

        const related = await productService.getRelatedProducts(item.slug, item.categorySlug, 4);
        setRelatedProducts(related || []);
      } catch (e) {
        console.error('Error loading product details', e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard', 'info');
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, true);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      setDirectBuyItem({ product, quantity });
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
          <div className="lg:col-span-7 aspect-square bg-slate-100 rounded-3xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-10 w-3/4 bg-slate-100 rounded" />
            <div className="h-6 w-32 bg-slate-100 rounded" />
            <div className="h-24 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 pb-24 max-w-md mx-auto px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
          <Package className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested product could not be found in our current catalogue.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </Link>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="pt-4 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Link to="/products" className="hover:text-slate-900 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.categorySlug}`}
            className="hover:text-slate-900 font-medium"
          >
            {product.categoryName}
          </Link>
          <span className="hidden sm:inline">/</span>
          <span className="hidden sm:inline text-slate-900 font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleWishlist(product)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              isWished
                ? 'border-rose-300 bg-rose-50 text-rose-600'
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-current' : ''}`} />
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {isWished ? 'Saved' : 'Wishlist'}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Share product"
            aria-label="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Product Images Gallery (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square sm:aspect-4/3 rounded-3xl overflow-hidden bg-slate-50 relative border border-slate-200/80 shadow-xs">
            <img
              src={product.images?.[selectedImageIndex] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {discountPercent && (
              <span className="absolute top-5 left-5 text-[11px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full bg-emerald-500 text-white shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
            {product.badge && (
              <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-950 text-white">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 transition-all cursor-pointer border-2 shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 opacity-100'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase & Specifications (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                {product.brand || 'NEXBUY Curated'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                {product.categoryName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900">{product.rating || '4.9'}</span>
              </div>
              <span className="text-slate-400">({product.reviewsCount || 24} customer reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-400 text-[11px]">{product.sku}</span>
            </div>

            {/* Price block */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Quick Spec Highlights */}
          <div className="border-y border-slate-200 py-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Stock Status</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {product.inStock !== false ? 'In Stock (Ships in 24h)' : 'Temporarily Out of Stock'}
              </span>
            </div>
            {product.warranty && (
              <div className="flex justify-between">
                <span className="text-slate-500">Official Warranty</span>
                <span className="font-semibold text-slate-900">{product.warranty}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between">
                <span className="text-slate-500">Dimensions</span>
                <span className="font-medium text-slate-900">{product.dimensions}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between">
                <span className="text-slate-500">Weight</span>
                <span className="font-medium text-slate-900">{product.weight}</span>
              </div>
            )}
          </div>

          {/* Actions: Quantity, Add to Cart & Direct Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-slate-600 hover:text-slate-900"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-slate-900 min-w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-slate-600 hover:text-slate-900"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-xl border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Add to Cart
              </button>
            </div>

            {/* Direct Buy Now Button with green accent */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <span>Buy Now • {formatCurrency(product.price * quantity)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-2 grid grid-cols-2 gap-3 text-[11px] text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free Delivery Over ₹1,999</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>GST Tax Invoice Included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Technical Specifications */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="border-t border-slate-200 pt-10 space-y-6">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([specKey, specVal]) => (
              <div
                key={specKey}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {specKey}
                </span>
                <span className="text-xs font-semibold text-slate-800 mt-1">
                  {specVal}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <div className="flex justify-between items-end">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Related Tech Gear
            </h3>
            <Link
              to="/products"
              className="text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700"
            >
              Explore Full Collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
