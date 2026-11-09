import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext';
import { Tag, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBrands();
      setBrands(res || []);
    } catch (err) {
      console.error('Failed to fetch brands', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      await adminService.createBrand({ name: name.trim() });
      addToast(`Brand "${name}" registered successfully.`, 'success');
      setName('');
      fetchBrands();
    } catch (err) {
      addToast(err.message || 'Failed to create brand.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, brandName) => {
    if (!window.confirm(`Remove brand "${brandName}"?`)) return;
    try {
      await adminService.deleteBrand(id);
      addToast(`Brand "${brandName}" removed.`, 'info');
      fetchBrands();
    } catch (err) {
      addToast(err.message || 'Failed to delete brand.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Tech Partner Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Technology Brands ({brands.length})
          </h1>
        </div>

        <button
          onClick={fetchBrands}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-white border border-slate-200 flex gap-3 text-xs shadow-xs">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Brand Name (e.g. Sony, Apple, Bose, Logitech, Razer)"
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{saving ? 'Adding...' : 'Add Brand'}</span>
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((b) => (
          <div key={b.id || b.name} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
            <span className="font-bold text-xs text-slate-900">{b.name}</span>
            <button
              onClick={() => handleDelete(b.id, b.name)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete brand"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
