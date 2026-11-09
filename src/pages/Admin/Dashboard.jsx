import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ShoppingBag,
  CreditCard,
  Layers,
  Users,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  Boxes
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getDashboardStats();
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Syncing NEXBUY Database Metrics...</p>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalCustomers: 0,
    unreadFeedback: 0,
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(kpis.totalRevenue),
      subtitle: 'Recorded across completed orders',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-white border-slate-200'
    },
    {
      title: 'Total Orders',
      value: kpis.totalOrders,
      subtitle: `${kpis.pendingOrders} pending · ${kpis.completedOrders} completed`,
      icon: ShoppingBag,
      color: 'text-slate-900',
      bgColor: 'bg-white border-slate-200'
    },
    {
      title: 'Tech Products',
      value: kpis.totalProducts,
      subtitle: `${kpis.lowStockProducts} items low on stock`,
      icon: Layers,
      color: 'text-emerald-600',
      bgColor: 'bg-white border-slate-200'
    },
    {
      title: 'Registered Customers',
      value: kpis.totalCustomers,
      subtitle: 'Active user accounts',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-white border-slate-200'
    },
    {
      title: 'Customer Feedback',
      value: kpis.unreadFeedback,
      subtitle: 'Inquiries & support tickets',
      icon: MessageSquare,
      color: kpis.unreadFeedback > 0 ? 'text-amber-600' : 'text-slate-600',
      bgColor: 'bg-white border-slate-200'
    },
    {
      title: 'Payment Verifications',
      value: `${kpis.successfulPayments} Paid`,
      subtitle: `${kpis.pendingPayments} pending confirmation`,
      icon: CreditCard,
      color: 'text-emerald-600',
      bgColor: 'bg-white border-slate-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alert if offline */}
      {(error && !data) && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Database Connection Notice:</span>{' '}
              <span className="text-amber-800">
                {error || 'Displaying cached metrics.'}
              </span>
            </div>
          </div>
          <button
            onClick={fetchStats}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold tracking-wider uppercase hover:bg-emerald-600 cursor-pointer shrink-0 transition-colors"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            NEXBUY Enterprise Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Executive Dashboard
          </h1>
        </div>

        <button
          onClick={fetchStats}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${card.bgColor} space-y-3 shadow-xs hover:border-slate-300 transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-slate-100">
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-black ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500">Live backend synchronized order pipeline</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!data?.recentOrders || data.recentOrders.length === 0) ? (
          <div className="py-12 text-center space-y-2 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No orders currently on record</p>
            <p className="text-xs text-slate-500">Orders placed by customers will update here instantly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Items</th>
                  <th className="pb-3 font-bold">Total</th>
                  <th className="pb-3 font-bold">Payment</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-black text-slate-900">#{order.id}</td>
                    <td className="py-3 font-bold text-slate-800">
                      {order.customerName}
                      <span className="block text-[10px] text-slate-400 font-normal">{order.customerEmail}</span>
                    </td>
                    <td className="py-3 text-slate-500">{formatDate(order.createdAt)}</td>
                    <td className="py-3 text-slate-600 font-medium">{order.items?.length || 0} items</td>
                    <td className="py-3 font-black text-slate-900">{formatCurrency(order.total)}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.paymentStatus === 'Paid' || order.paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="px-3 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase hover:bg-emerald-600 transition-colors"
                      >
                        Inspect
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
