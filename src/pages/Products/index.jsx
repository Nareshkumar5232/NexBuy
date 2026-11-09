import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, SlidersHorizontal, Sparkles, Flame, Check } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import ProductGrid from '../../components/product/ProductGrid';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || 'all';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState(initialFilter); // 'all', 'new', 'bestseller'
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const s = searchParams.get('search') || '';
    const f = searchParams.get('filter') || 'all';
    setSelectedCategory(cat);
    setSearchQuery(s);
    setActiveFilter(f);
  }, [searchParams]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const catData = await categoryService.getCategories();
        setCategories(catData || []);
      } catch (e) {
        console.error('Error fetching categories', e);
      }
    }
    loadCategories();
  }, []);

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
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        let results = await productService.getProducts({
          category: selectedCategory,
          search: searchQuery,
          sortBy: sortBy,
        });

        // Filter by Special Collection: 'new' or 'bestseller'
        if (activeFilter === 'new') {
          results = results.slice(0, 10);
        } else if (activeFilter === 'bestseller') {
          results = results.filter(
            (p) =>
              p.badge?.toLowerCase().includes('seller') ||
              p.badge?.toLowerCase().includes('top') ||
              p.rating >= 4.9
          );
        }

        // Price filter
        if (priceRange === 'under-15k') {
          results = results.filter((p) => p.price < 15000);
        } else if (priceRange === '15k-35k') {
          results = results.filter((p) => p.price >= 15000 && p.price <= 35000);
        } else if (priceRange === '35k-60k') {
          results = results.filter((p) => p.price > 35000 && p.price <= 60000);
        } else if (priceRange === 'above-60k') {
          results = results.filter((p) => p.price > 60000);
        }

        if (isMounted) {
          setProducts(results);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery, activeFilter, sortBy, priceRange, updateTick]);

  const handleCategorySelect = (catSlug) => {
    setSelectedCategory(catSlug);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (catSlug === 'all') next.delete('category');
      else next.set('category', catSlug);
      return next;
    });
  };

  const handleFilterSelect = (filterName) => {
    setActiveFilter(filterName);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (filterName === 'all') next.delete('filter');
      else next.set('filter', filterName);
      return next;
    });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!val) next.delete('search');
      else next.set('search', val);
      return next;
    });
  };

  const handleReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveFilter('all');
    setSortBy('featured');
    setPriceRange('all');
    setSearchParams({});
  };

  return (
    <div className="pt-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8 pt-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span>NEXBUY Technology Store</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {activeFilter === 'new'
              ? 'New Arrivals'
              : activeFilter === 'bestseller'
              ? 'Best Sellers'
              : selectedCategory !== 'all'
              ? categories.find((c) => c.slug === selectedCategory)?.name || 'Products'
              : 'All Tech Gear'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            Browse authentic noise-canceling headphones, smartwatches, speakers, computer accessories, and daily productivity gear.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0">
          Showing <span className="text-slate-900 font-bold">{products.length}</span> Products
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-4">
        {/* Quick Filter Pills (All, New Arrivals, Best Sellers) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => handleFilterSelect('all')}
            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              activeFilter === 'all'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Collections
          </button>
          <button
            onClick={() => handleFilterSelect('new')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              activeFilter === 'new'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Arrivals</span>
          </button>
          <button
            onClick={() => handleFilterSelect('bestseller')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              activeFilter === 'bestseller'
                ? 'bg-amber-500 text-zinc-950 shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Best Sellers</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs border-b border-slate-200 pt-2">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-white font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat.slug}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.shortName || cat.name}
            </button>
          ))}
        </div>

        {/* Search, Price & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search gear, brands, specs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="all">All Prices</option>
              <option value="under-15k">Under ₹15,000</option>
              <option value="15k-35k">₹15,000 – ₹35,000</option>
              <option value="35k-60k">₹35,000 – ₹60,000</option>
              <option value="above-60k">Above ₹60,000</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">New Releases</option>
            </select>

            {/* Reset Button */}
            {(selectedCategory !== 'all' || searchQuery || activeFilter !== 'all' || priceRange !== 'all') && (
              <button
                onClick={handleReset}
                className="p-2.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Reset all filters"
                aria-label="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        onReset={handleReset}
        columns={4}
      />
    </div>
  );
}
