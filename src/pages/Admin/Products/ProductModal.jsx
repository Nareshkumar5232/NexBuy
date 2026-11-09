import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext';
import { productsData } from '../../../data/productsData';
import { X, Save, Sparkles, Cpu, Layers } from 'lucide-react';

export default function ProductModal({ product, categories = [], onClose, onSaved }) {
  const defaultCat = categories[0]?.slug || 'headphones';
  const defaultCatName = categories[0]?.name || 'Headphones';

  const [formData, setFormData] = useState({
    name: '',
    categorySlug: defaultCat,
    categoryName: defaultCatName,
    brand: 'NEXBUY',
    price: '',
    originalPrice: '',
    stock: 15,
    inStock: true,
    sku: '',
    tagline: '',
    description: '',
    images: '',
    weight: '',
    warranty: '1 Year Official Warranty',
    // Flexible Specs
    spec1Key: 'Connectivity',
    spec1Val: 'Bluetooth 5.3 / USB-C',
    spec2Key: 'Battery Life',
    spec2Val: 'Up to 30 Hours',
    spec3Key: 'Audio / Driver',
    spec3Val: '40mm Titanium Drivers',
    spec4Key: 'Compatibility',
    spec4Val: 'iOS, Android, Windows, Mac',
  });

  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (product) {
      const specsEntries = Object.entries(product.specs || {});
      setFormData({
        name: product.name || '',
        categorySlug: product.categorySlug || defaultCat,
        categoryName: product.categoryName || defaultCatName,
        brand: product.brand || 'NEXBUY',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stock: product.stock !== undefined ? product.stock : 15,
        inStock: product.inStock !== false,
        sku: product.sku || '',
        tagline: product.tagline || '',
        description: product.description || '',
        images: Array.isArray(product.images) ? product.images.join(', ') : (product.images || ''),
        weight: product.weight || '',
        warranty: product.warranty || '1 Year Official Warranty',
        spec1Key: specsEntries[0]?.[0] || 'Connectivity',
        spec1Val: specsEntries[0]?.[1] || '',
        spec2Key: specsEntries[1]?.[0] || 'Battery Life',
        spec2Val: specsEntries[1]?.[1] || '',
        spec3Key: specsEntries[2]?.[0] || 'Feature / Driver',
        spec3Val: specsEntries[2]?.[1] || '',
        spec4Key: specsEntries[3]?.[0] || 'Compatibility',
        spec4Val: specsEntries[3]?.[1] || '',
      });
    }
  }, [product, categories]);

  const handleFillDemoPreset = (presetIndex = 0) => {
    const preset = productsData[presetIndex] || productsData[0];
    if (!preset) return;
    const catMatch = categories.find(c => c.slug === preset.categorySlug);
    const randSuffix = Math.floor(100 + Math.random() * 900);
    const specsEntries = Object.entries(preset.specs || {});

    setFormData({
      name: `${preset.name} (Unit ${randSuffix})`,
      categorySlug: preset.categorySlug,
      categoryName: catMatch?.name || preset.categoryName,
      brand: preset.brand || 'NEXBUY',
      price: preset.price,
      originalPrice: preset.originalPrice,
      stock: preset.stock,
      inStock: preset.inStock,
      sku: `${preset.sku}-${randSuffix}`,
      tagline: preset.tagline,
      description: preset.description,
      images: Array.isArray(preset.images) ? preset.images.join(', ') : preset.images,
      weight: preset.weight || '',
      warranty: preset.warranty || '1 Year Official Warranty',
      spec1Key: specsEntries[0]?.[0] || 'Connectivity',
      spec1Val: specsEntries[0]?.[1] || '',
      spec2Key: specsEntries[1]?.[0] || 'Battery / Power',
      spec2Val: specsEntries[1]?.[1] || '',
      spec3Key: specsEntries[2]?.[0] || 'Feature / Display',
      spec3Val: specsEntries[2]?.[1] || '',
      spec4Key: specsEntries[3]?.[0] || 'Compatibility',
      spec4Val: specsEntries[3]?.[1] || '',
    });
    addToast(`Loaded preset specs from "${preset.name}"`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categorySlug) {
      addToast('Name, price, and category are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const categoryObj = categories.find(c => c.slug === formData.categorySlug);
      const imagesArray = formData.images
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const specs = {};
      if (formData.spec1Key && formData.spec1Val) specs[formData.spec1Key] = formData.spec1Val;
      if (formData.spec2Key && formData.spec2Val) specs[formData.spec2Key] = formData.spec2Val;
      if (formData.spec3Key && formData.spec3Val) specs[formData.spec3Key] = formData.spec3Val;
      if (formData.spec4Key && formData.spec4Val) specs[formData.spec4Key] = formData.spec4Val;

      const payload = {
        name: formData.name,
        categorySlug: formData.categorySlug,
        categoryName: categoryObj?.name || formData.categoryName || formData.categorySlug,
        brand: formData.brand || 'NEXBUY',
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        stock: Number(formData.stock),
        inStock: Boolean(formData.inStock),
        sku: formData.sku || ('SKU-' + Date.now().toString().slice(-6)),
        tagline: formData.tagline,
        description: formData.description,
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1547932087-59a8f2be576e?auto=format&fit=crop&w=800&q=80'],
        weight: formData.weight,
        warranty: formData.warranty,
        specs
      };

      if (product) {
        await adminService.updateProduct(product.id, payload);
        addToast('Product updated successfully in NEXBUY database.', 'success');
      } else {
        await adminService.createProduct(payload);
        addToast('New product added to NEXBUY catalog & immediately visible.', 'success');
      }

      onSaved();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {product ? 'Edit Tech Product' : 'Add New Tech Product'}
            </h2>
            <p className="text-xs text-slate-500">Configure product specifications for the NEXBUY store catalog</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Fill Presets */}
        {!product && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick-Fill from Tech Template:</span>
              </div>
              <span className="text-[10px] text-slate-400">{productsData.length} Presets Available</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value !== '') {
                    handleFillDemoPreset(Number(e.target.value));
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="" disabled>Select a template to auto-populate...</option>
                {productsData.map((p, idx) => (
                  <option key={p.id} value={idx}>
                    [{p.categoryName}] {p.name} — ₹{p.price.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. ApexPro Wireless Studio Headphones"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">Category *</label>
              <select
                value={formData.categorySlug}
                onChange={e => {
                  const selSlug = e.target.value;
                  const catMatch = categories.find(c => c.slug === selSlug);
                  setFormData({
                    ...formData,
                    categorySlug: selSlug,
                    categoryName: catMatch?.name || selSlug
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">Brand / Manufacturer</label>
              <input
                type="text"
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. NEXBUY, Sony, Apple, Bose"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">SKU Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="NB-89217"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="14999"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">Original / MRP Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="19999"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">Stock Units</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">Warranty</label>
              <input
                type="text"
                value={formData.warranty}
                onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                placeholder="1 Year Official Brand Warranty"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Marketing Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Flagship active noise cancellation with 40-hour playback"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Detailed Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full product overview, audio engineering, battery specifications, design highlights..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Image URLs (comma separated)</label>
            <input
              type="text"
              value={formData.images}
              onChange={e => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://images.unsplash.com/..., https://..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Technical Specifications */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <p className="font-bold uppercase tracking-wider text-[11px] text-emerald-600 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Key Technical Specifications</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.spec1Key}
                  onChange={e => setFormData({ ...formData, spec1Key: e.target.value })}
                  placeholder="Key (e.g. Connectivity)"
                  className="w-1/3 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px]"
                />
                <input
                  type="text"
                  value={formData.spec1Val}
                  onChange={e => setFormData({ ...formData, spec1Val: e.target.value })}
                  placeholder="Value (e.g. Bluetooth 5.3)"
                  className="w-2/3 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px]"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.spec2Key}
                  onChange={e => setFormData({ ...formData, spec2Key: e.target.value })}
                  placeholder="Key (e.g. Battery)"
                  className="w-1/3 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px]"
                />
                <input
                  type="text"
                  value={formData.spec2Val}
                  onChange={e => setFormData({ ...formData, spec2Val: e.target.value })}
                  placeholder="Value (e.g. 30 Hours)"
                  className="w-2/3 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px]"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.spec3Key}
                  onChange={e => setFormData({ ...formData, spec3Key: e.target.value })}
                  placeholder="Key (e.g. Driver)"
                  className="w-1/3 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px]"
                />
                <input
                  type="text"
                  value={formData.spec3Val}
                  onChange={e => setFormData({ ...formData, spec3Val: e.target.value })}
                  placeholder="Value (e.g. 40mm Hi-Res)"
                  className="w-2/3 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px]"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.spec4Key}
                  onChange={e => setFormData({ ...formData, spec4Key: e.target.value })}
                  placeholder="Key (e.g. Compatibility)"
                  className="w-1/3 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px]"
                />
                <input
                  type="text"
                  value={formData.spec4Val}
                  onChange={e => setFormData({ ...formData, spec4Val: e.target.value })}
                  placeholder="Value (e.g. iOS & Android)"
                  className="w-2/3 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
