import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { CreditCard, RefreshCw } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPayments();
      setPayments(res || []);
    } catch (err) {
      console.error('Failed to fetch payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Financial Transactions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Payment Audit & Verification
          </h1>
        </div>

        <button
          onClick={fetchPayments}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Payments</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Loading Transactions...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-base font-bold text-slate-900">No payment records found.</p>
            <p className="text-xs text-slate-500">Verified online payments and COD transactions will log here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Payment ID</th>
                  <th className="py-3 px-4 font-bold">Order Reference</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Method</th>
                  <th className="py-3 px-4 font-bold">Gateway</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">#{p.orderId}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{p.customerName}</p>
                      <p className="text-[10px] text-slate-400">{p.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{formatCurrency(p.amount)}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{p.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-slate-500">{p.gateway}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(p.createdAt)}</td>
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
