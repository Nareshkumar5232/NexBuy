import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, ChevronRight, ShoppingBag } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export default function MyOrders() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { redirect: '/my-orders' }, replace: true });
      return;
    }

    async function loadOrders() {
      if (!user) return;
      setLoading(true);
      try {
        const list = await orderService.getOrders(user.id);
        setOrders(list || []);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadOrders();
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Packed':
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="pt-8 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="h-44 bg-slate-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-6 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 pb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
          Account Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track real-time shipment status, view invoices, and monitor your NEXBUY orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Package className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            When you purchase tech gear, headphones, smartwatches, or accessories from NEXBUY, your dispatch updates and receipts will show up here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4 hover:border-slate-300 transition-all shadow-xs"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-base text-slate-900">
                      Order #{order.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-baseline sm:items-end justify-between sm:flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total</span>
                  <span className="font-black text-base sm:text-lg text-slate-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 pr-4 border-r border-slate-100 last:border-none shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-200/80"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <Package className="w-4 h-4" />
                        </div>
                      )}
                      <div className="text-xs">
                        <p className="font-bold text-slate-900 truncate max-w-[160px]">{item.name}</p>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity} • {formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View Details Button */}
                <Link
                  to={`/my-orders/${order.id}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
