import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext';
import { Boxes, Save, RefreshCw } from 'lucide-react';

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState({});
  const { addToast } = useToast();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await adminService.getInventory();
      setItems(res || []);
      const map = {};
      (res || []).forEach(item => {
        map[item.id] = item.currentStock;
      });
      setEditingStock(map);
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockUpdate = async (productId) => {
    const stockVal = editingStock[productId];
    try {
      await adminService.updateInventory(productId, {
        stock: Number(stockVal),
        inStock: Number(stockVal) > 0
      });
      addToast('Inventory count updated successfully in database.', 'success');
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to update stock', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Warehouse & Stock Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Real Inventory Levels
          </h1>
        </div>

        <button
          onClick={fetchInventory}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Stock</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Syncing Inventory...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Boxes className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-base font-bold text-slate-900">No inventory items available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Product Name</th>
                  <th className="py-3 px-4 font-bold">SKU</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Current Stock</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Quick Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{item.sku}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{item.categoryName}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{item.currentStock} units</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.isOutOfStock
                          ? 'bg-rose-100 text-rose-800'
                          : item.isLowStock
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.isOutOfStock ? 'Out of Stock' : item.isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          min="0"
                          value={editingStock[item.id] !== undefined ? editingStock[item.id] : item.currentStock}
                          onChange={(e) => setEditingStock({ ...editingStock, [item.id]: e.target.value })}
                          className="w-20 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => handleStockUpdate(item.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                          title="Save stock level"
                        >
                          <Save className="w-3.5 h-3.5" />
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
    </div>
  );
}
