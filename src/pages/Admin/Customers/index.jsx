import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../../services/adminService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Users, RefreshCw } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCustomers();
      setCustomers(res || []);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Registered Client Accounts
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Customer Directory ({customers.length})
          </h1>
        </div>

        <button
          onClick={fetchCustomers}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Loading Customer Accounts...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-base font-bold text-slate-900">No customer accounts registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Phone</th>
                  <th className="py-3 px-4 font-bold">Total Orders</th>
                  <th className="py-3 px-4 font-bold">Lifetime Spend</th>
                  <th className="py-3 px-4 font-bold">Joined Date</th>
                  <th className="py-3 px-4 font-bold text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{c.phone || '—'}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.totalOrders} orders</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{formatCurrency(c.totalSpent)}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(c.createdAt)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/customers/${c.id}`}
                        className="px-3 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase hover:bg-emerald-600 transition-colors"
                      >
                        Details
                      </Link>
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
