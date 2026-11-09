import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Sparkles } from 'lucide-react';
import { categoryService } from '../../services/categoryService';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await categoryService.getCategories();
        setCategories(list || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="pt-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3 border-b border-slate-200 pb-8 pt-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
          <Sparkles className="w-4 h-4" />
          <span>Product Taxonomy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Technology Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
          Explore NEXBUY's specialized ranges of headphones, earbuds, smartwatches, speakers, computer accessories, storage, and networking gear.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-4/3 bg-slate-100 rounded-3xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-slate-50 rounded-3xl border border-slate-200 p-8">
          <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-600 mx-auto flex items-center justify-center">
            <Package className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No categories found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Categories configured in the catalogue will be displayed here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id || idx}
              to={`/products?category=${cat.slug}`}
              className="group rounded-3xl p-5 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-100">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Package className="w-8 h-8 stroke-[1.2]" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-xs text-white text-[9px] uppercase font-bold tracking-widest">
                    0{idx + 1}
                  </span>
                  {cat.itemCount && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] uppercase font-bold tracking-wider shadow-xs">
                      {cat.itemCount}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.tagline && (
                    <p className="text-xs text-emerald-600 font-semibold">
                      {cat.tagline}
                    </p>
                  )}
                </div>

                {cat.description && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-emerald-600">
                <span>View Products</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
