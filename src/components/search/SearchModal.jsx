import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Package, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { formatCurrency } from '../../utils/formatters';

export default function SearchModal() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useSearch();
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      categoryService.getCategories().then((cats) => setCategories(cats || []));
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await productService.getProducts({ search: searchQuery });
        if (isMounted) {
          setResults(data);
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
  }, [searchQuery]);

  const handleSelectProduct = (slug) => {
    closeSearch();
    setSearchQuery('');
    navigate(`/products/${slug}`);
  };

  const handleApplyCategory = (catSlug) => {
    closeSearch();
    setSearchQuery('');
    navigate(`/products?category=${catSlug}`);
  };

  const handleViewAllResults = () => {
    closeSearch();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleViewAllResults();
    }
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeSearch}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[80vh]"
        >
          {/* Header & Input */}
          <div className="flex items-center px-5 py-4 border-b border-slate-100 gap-3 bg-slate-50/50">
            <Search className="w-5 h-5 text-emerald-600 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search tech gear, headphones, smartwatches, keyboards..."
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-700 text-xs uppercase font-bold"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeSearch}
              className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Categories Bar */}
          {categories.length > 0 && (
            <div className="px-5 py-2.5 bg-slate-100/60 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Popular:
              </span>
              {categories.slice(0, 6).map((c) => (
                <button
                  key={c.id || c.slug}
                  onClick={() => handleApplyCategory(c.slug)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-500 hover:text-white border border-slate-200 text-slate-700 font-medium text-[11px] whitespace-nowrap transition-colors cursor-pointer"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-5">
            {loading ? (
              <div className="space-y-3 py-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : searchQuery.trim() && results.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Package className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  No products found for "{searchQuery}"
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try checking for typos or searching with broader tech keywords like "headphones", "wireless", or "charger".
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Matching Products ({results.length})
                </div>
                {results.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1547932087-59a8f2be576e?auto=format&fit=crop&w=300&q=80'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                        {product.categoryName}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-black text-slate-900">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}

                {results.length > 6 && (
                  <button
                    onClick={handleViewAllResults}
                    className="w-full mt-3 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View All {results.length} Results</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <p className="text-xs font-semibold text-slate-700">
                  Search NEXBUY Curated Tech Gear
                </p>
                <p className="text-[11px] text-slate-400">
                  Type a brand, category, or gadget name to begin searching.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
