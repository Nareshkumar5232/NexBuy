import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Truck,
  RotateCcw,
  Headphones,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Flame,
  Send,
  Zap,
  ArrowUpRight,
  Laptop
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { feedbackService } from '../../services/feedbackService';
import { apiRequest } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import ProductCard from '../../components/product/ProductCard';
import { useToast } from '../../context/ToastContext';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState('');

  const { addToast } = useToast();
  const [updateTick, setUpdateTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setUpdateTick((t) => t + 1);
    window.addEventListener('nexbuy_products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nexbuy_products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [allProds, cats, storeSettings] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
          apiRequest('/settings').catch(() => null)
        ]);

        const products = Array.isArray(allProds) ? allProds : [];
        setFeaturedProducts(products.filter((p) => p.featured).slice(0, 8));
        setNewArrivals(products.slice(0, 4));
        setBestSellers(products.filter((p) => p.badge?.toLowerCase().includes('seller') || p.rating >= 4.9).slice(0, 4));
        setCategories(Array.isArray(cats) ? cats : []);
        if (storeSettings) setSettings(storeSettings);
      } catch (err) {
        console.error('Error fetching home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [updateTick]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    setNewsletterSubmitting(true);
    setNewsletterSuccess('');
    try {
      const res = await feedbackService.subscribeNewsletter(newsletterEmail);
      setNewsletterSuccess(res.message || 'Thank you for subscribing to NEXBUY updates!');
      addToast(res.message || 'Subscribed successfully!', 'success');
      setNewsletterEmail('');
    } catch (err) {
      addToast(err.message || 'Failed to subscribe. Please try again.', 'error');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const promoBanner = settings?.promotionalBanner || {
    heading: 'Boost Your Productivity',
    subheading: 'High-performance computing accessories, mechanical peripherals, and ergonomic tech setups.',
    ctaText: 'Browse Now',
    ctaLink: '/products',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1600&q=80'
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* =========================================================================
          1. HERO SECTION — Dark Cinematic Technology Banner (TechNest Inspired)
          ========================================================================= */}
      <section className="relative bg-[#0B0F17] text-white overflow-hidden pt-8 pb-16 sm:py-20 lg:py-28 border-b border-zinc-800/80">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Supporting Text & Green CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6 sm:space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Next-Gen Audio & Smart Devices</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-white">
                  Top Tech Gear <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200">
                    for Your Lifestyle
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-zinc-400 max-w-xl font-normal leading-relaxed">
                  Explore the latest gadgets & accessories. From studio-grade noise-canceling headphones to flagship smartwatches and workspace peripherals.
                </p>
              </div>

              {/* Green "Shop Now" CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 text-sm font-extrabold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center gap-2 group cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/products?filter=new"
                  className="px-6 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 text-sm font-bold uppercase tracking-wider transition-all duration-200"
                >
                  New Arrivals
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 text-xs text-zinc-400">
                <div>
                  <span className="text-white font-bold block text-sm">100% Genuine</span>
                  <span>Brand Warranty</span>
                </div>
                <div>
                  <span className="text-white font-bold block text-sm">Free Express</span>
                  <span>Orders Over ₹1,999</span>
                </div>
                <div>
                  <span className="text-white font-bold block text-sm">Chennai Hub</span>
                  <span>2 Physical Stores</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Premium Technology Product Imagery Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative"
            >
              <div className="relative aspect-4/3 sm:aspect-16/11 rounded-3xl overflow-hidden bg-gradient-to-tr from-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl p-2 sm:p-3">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
                  alt="Sony WH-1000XM5 Premium Headphones & Tech Gear"
                  className="w-full h-full object-cover rounded-2xl tech-img-hover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl" />

                {/* Floating Showcase Pill 1: Featured Flagship Gear */}
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-[#121824]/90 backdrop-blur-md p-4 rounded-2xl border border-zinc-700/70 shadow-xl max-w-sm flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                      FLAGSHIP SOUND
                    </span>
                    <p className="font-bold text-sm sm:text-base text-white">
                      Sony WH-1000XM5 Wireless
                    </p>
                    <p className="text-xs text-zinc-400">Active Noise Cancellation • 30h Battery</p>
                  </div>
                  <Link
                    to="/products/sony-wh-1000xm5-wireless-noise-canceling-headphones"
                    className="w-9 h-9 rounded-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400 flex items-center justify-center transition-colors shrink-0 font-bold"
                  >
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>

                {/* Floating Showcase Pill 2: Wearable Tech Badge */}
                <div className="hidden sm:flex absolute top-6 right-6 bg-zinc-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-700/80 items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-zinc-200">Apple Watch Ultra 2 In Stock</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SERVICE BENEFITS BAR — Genuine supported business benefits
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs">
          {/* Benefit 1 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Truck className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Free Shipping</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Free delivery on all eligible orders over ₹1,999 across India.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <RotateCcw className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">7-Day Return Policy</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hassle-free replacement for damaged or defective gadgets.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Headphones className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Customer Support</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct phone & email support from our Chennai tech team.
              </p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900">100% Genuine Gear</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Official manufacturer warranty backed by GST invoicing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED PRODUCTS — Clean White Background & Responsive Cards
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Featured Tech Products
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-emerald-600 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-emerald-500" />
          </Link>
        </div>

        {/* Product Grid — Real Backend Products */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-pulse space-y-4">
                <div className="aspect-square bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-600 font-medium">No featured products currently in catalog.</p>
            <Link to="/products" className="mt-3 inline-block text-xs font-bold uppercase text-emerald-600 hover:underline">
              Explore All Tech Gear
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          4. PROMOTIONAL BANNER — Dark Tech Banner ("Boost Your Productivity")
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#0B0F17] text-white border border-zinc-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Laptop className="w-3.5 h-3.5" />
                <span>Workspace Optimization</span>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  {promoBanner.heading}
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed font-light">
                  {promoBanner.subheading}
                </p>
              </div>

              <div>
                <Link
                  to={promoBanner.ctaLink || '/products'}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-emerald-500/20 group"
                >
                  <span>{promoBanner.ctaText || 'Browse Now'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-6 relative aspect-16/10 lg:aspect-auto lg:h-full min-h-[300px]">
              <img
                src={promoBanner.image}
                alt="Productivity Workstation Setup"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17] via-transparent to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. NEW ARRIVALS & BEST SELLERS — Two Promotional Cards Linking Collections
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: New Arrivals */}
          <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0D1117] to-zinc-900 border border-zinc-800 p-8 sm:p-10 flex flex-col justify-between min-h-[340px] text-white">
            <div className="space-y-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Just Dropped</span>
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                New Arrivals
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
                Explore the freshest smartwatches, earbuds, high-speed SSDs, and accessories in stock.
              </p>
            </div>

            <div className="pt-6 z-10 flex items-center justify-between">
              <Link
                to="/products?filter=new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Decorative background image */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"
                alt="New Arrivals"
                className="w-full h-full object-cover object-right"
              />
            </div>
          </div>

          {/* Card 2: Best Sellers */}
          <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-[#0B0F17] border border-zinc-800 p-8 sm:p-10 flex flex-col justify-between min-h-[340px] text-white">
            <div className="space-y-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                <Flame className="w-3.5 h-3.5" />
                <span>Customer Favorites</span>
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Best Sellers
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
                Top-rated audio gear, mechanical keyboards, and daily tech essentials loved by Chennai creators.
              </p>
            </div>

            <div className="pt-6 z-10 flex items-center justify-between">
              <Link
                to="/products?filter=bestseller"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Shop Best Sellers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Decorative background image */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
                alt="Best Sellers"
                className="w-full h-full object-cover object-right"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. PRODUCT CATEGORIES QUICK BROWSE
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Explore By Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tech Taxonomy
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 group"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.id || cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center space-y-2.5"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h4>
                {cat.itemCount && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    {cat.itemCount}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. NEWSLETTER SECTION — Dark Background with Real API Integration
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#0B0F17] text-white p-8 sm:p-14 border border-zinc-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>NEXBUY Community</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Stay Ahead of the Tech Curve
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light max-w-lg mx-auto">
                Subscribe to receive early notifications on exclusive hardware drops, limited inventory arrivals, and seasonal tech promotions.
              </p>
            </div>

            {newsletterSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{newsletterSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={newsletterSubmitting}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 text-zinc-950 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-md"
                >
                  {newsletterSubmitting ? (
                    <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-[11px] text-zinc-500">
              We respect your privacy. No spam, only genuine technology updates. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
