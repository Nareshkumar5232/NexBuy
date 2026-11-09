import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { productsData } from '../../../data/productsData';
import { formatCurrency } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import ProductModal from './ProductModal';
import { Layers, Plus, Search, Edit2, Trash2, RefreshCw, Sparkles, Filter } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { addToast } = useToast();

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        adminService.getProducts({ category: categoryFilter, search }),
        adminService.getCategories()
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [categoryFilter]);

  const handleAddDemoProducts = async () => {
    try {
      setSeeding(true);
      try {
        const seedResult = await adminService.seedDemoProducts();
        if (seedResult?.addedCount > 0) {
          addToast(`Successfully synced ${seedResult.addedCount} NEXBUY tech products! They are live on the storefront.`, 'success');
          await fetchCatalog();
          return;
        }
      } catch {}

      const allCurrent = await adminService.getProducts();
      let count = 0;
      for (const demo of productsData) {
        const exists = (allCurrent || []).some(
          p => p.slug === demo.slug || p.name?.toLowerCase() === demo.name?.toLowerCase()
        );
        if (!exists) {
          await adminService.createProduct(demo);
          count++;
        }
      }

      if (count > 0) {
        addToast(`Successfully added ${count} tech products to the database!`, 'success');
      } else {
        const targetCategory = categoryFilter !== 'all' ? categoryFilter : null;
        const candidates = targetCategory
          ? productsData.filter(p => p.categorySlug === targetCategory)
          : productsData;
        const base = candidates[Math.floor(Math.random() * candidates.length)] || productsData[0];
        const randId = Math.floor(100 + Math.random() * 900);
        const newDemo = {
          ...base,
          id: undefined,
          name: `${base.name} (Unit #${randId})`,
          slug: `${base.slug}-unit-${randId}`,
          sku: `NB-DEMO-${randId}`,
        };
        await adminService.createProduct(newDemo);
        addToast(`Added new product "${newDemo.name}" in ${newDemo.categoryName}!`, 'success');
      }

      await fetchCatalog();
    } catch (err) {
      addToast(err.message || 'Failed to add demo products', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the product catalog?`)) {
      return;
    }
    try {
      await adminService.deleteProduct(id);
      addToast(`Product "${name}" removed successfully.`, 'info');
      fetchCatalog();
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              NEXBUY Inventory Management
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
              {products.length} Products Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Products Catalog
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchCatalog}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleAddDemoProducts}
            disabled={seeding}
            className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
            title="Seed tech products"
          >
            <Sparkles className={`w-3.5 h-3.5 text-emerald-600 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding...' : 'Seed Tech Gear'}</span>
          </button>

          <button
            onClick={() => { setEditingProduct(null); setModalOpen(true); }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCatalog()}
            placeholder="Search products by title, SKU, brand..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium w-full sm:w-auto focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Tech Categories ({categories.length})</option>
          {categories.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Syncing Product Catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <div>
              <p className="text-base font-bold text-slate-900">No products found in catalog.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Add products from the preset tech catalog or create custom gadgets.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleAddDemoProducts}
                disabled={seeding}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add Tech Gear</span>
              </button>
              <button
                onClick={() => { setEditingProduct(null); setModalOpen(true); }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Product</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Brand</th>
                  <th className="py-3 px-4 font-bold">Price</th>
                  <th className="py-3 px-4 font-bold">Stock</th>
                  <th className="py-3 px-4 font-bold">SKU</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900 truncate max-w-xs">{p.name}</p>
                            {p.featured && (
                              <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] rounded font-bold uppercase tracking-wider">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{p.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{p.categoryName}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{p.brand}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{formatCurrency(p.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock === 0
                          ? 'bg-rose-100 text-rose-800'
                          : p.stock <= 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{p.sku}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setEditingProduct(p); setModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSaved={fetchCatalog}
        />
      )}
    </div>
  );
}
