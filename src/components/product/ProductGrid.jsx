import React from 'react';
import ProductCard from './ProductCard';
import { RotateCcw, PackageSearch } from 'lucide-react';

export function ProductSkeleton() {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 animate-pulse space-y-4">
      <div className="aspect-square bg-slate-100 rounded-xl" />
      <div className="space-y-2 pt-1">
        <div className="h-3 w-20 bg-slate-100 rounded" />
        <div className="h-4 w-5/6 bg-slate-100 rounded" />
        <div className="h-3 w-3/4 bg-slate-100 rounded" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-5 w-24 bg-slate-100 rounded" />
        <div className="h-8 w-16 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  products = [],
  loading = false,
  onResetFilters,
  onReset,
  columns = 4,
  emptyMessage = 'No technology gear found in this section.',
}) {
  const handleResetAction = onResetFilters || onReset;

  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
          columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        } gap-6`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4 p-8 bg-slate-50 rounded-3xl border border-slate-200/80">
        <div className="w-14 h-14 rounded-2xl bg-slate-200/70 text-slate-500 mx-auto flex items-center justify-center">
          <PackageSearch className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{emptyMessage}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Try adjusting your search criteria or explore our featured technology collections.
        </p>
        {handleResetAction && (
          <button
            onClick={handleResetAction}
            className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      } gap-6`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
