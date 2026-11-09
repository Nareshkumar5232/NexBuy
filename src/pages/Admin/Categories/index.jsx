import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext';
import { FolderTree, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCategories();
      setCategories(res || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      setSaving(true);
      await adminService.createCategory({
        name: newName.trim(),
        description: newDesc.trim(),
      });
      addToast(`Category "${newName}" created successfully.`, 'success');
      setNewName('');
      setNewDesc('');
      fetchCategories();
    } catch (err) {
      addToast(err.message || 'Failed to create category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Products in this category will remain.`)) return;
    try {
      await adminService.deleteCategory(id);
      addToast(`Category "${name}" deleted.`, 'info');
      fetchCategories();
    } catch (err) {
      addToast(err.message || 'Failed to delete category.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Catalog Taxonomy
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Technology Categories ({categories.length})
          </h1>
        </div>

        <button
          onClick={fetchCategories}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900">Create New Technology Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <input
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category Name (e.g. Virtual Reality, Drones)"
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description summary..."
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-500/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{saving ? 'Creating...' : 'Add Category'}</span>
          </button>
        </div>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id || c.slug} className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-xs hover:border-slate-300 transition-all">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-2">{c.description || 'Consumer technology'}</p>
              <code className="text-[10px] text-emerald-600 font-mono font-bold block pt-1">/{c.slug}</code>
            </div>
            <button
              onClick={() => handleDelete(c.id || c.slug, c.name)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
