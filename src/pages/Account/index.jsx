import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ArrowRight,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { addressService } from '../../services/addressService';
import { formatCurrency } from '../../utils/formatters';

export default function Account() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [recentOrders, setRecentOrders] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { redirect: '/account' }, replace: true });
      return;
    }

    async function loadAccountData() {
      if (!user) return;
      setLoading(true);
      try {
        const [ordersList, addressesList] = await Promise.all([
          orderService.getOrders(user.id),
          addressService.getAddresses(user.id),
        ]);
        setRecentOrders((ordersList || []).slice(0, 2));
        setDefaultAddress((addressesList || []).find((a) => a.isDefault) || addressesList?.[0] || null);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadAccountData();
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="pt-8 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse">
        <div className="h-20 bg-slate-100 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hello, {user?.name || 'Customer'}
          </h1>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors self-start sm:self-auto cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Account Navigation Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link
          to="/my-orders"
          className="p-5 rounded-2xl bg-white hover:border-emerald-500 border border-slate-200 transition-all space-y-3 block group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            My Orders
          </h3>
          <p className="text-xs text-slate-500">Track shipments, live delivery progress, and previous purchases.</p>
        </Link>

        <Link
          to="/account/addresses"
          className="p-5 rounded-2xl bg-white hover:border-emerald-500 border border-slate-200 transition-all space-y-3 block group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            Saved Addresses
          </h3>
          <p className="text-xs text-slate-500">Manage shipping addresses for fast and seamless checkout.</p>
        </Link>

        <Link
          to="/account/profile"
          className="p-5 rounded-2xl bg-white hover:border-emerald-500 border border-slate-200 transition-all space-y-3 block group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            Profile & Security
          </h3>
          <p className="text-xs text-slate-500">Update your name, contact phone, and account password.</p>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
          {recentOrders.length > 0 && (
            <Link
              to="/my-orders"
              className="text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700"
            >
              View All Orders →
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500 shadow-xs">
            You haven't placed any orders yet. Discover our latest tech collection!
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">#{order.id}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-white">
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {order.items?.length} {order.items?.length === 1 ? 'Item' : 'Items'} • {formatCurrency(order.total)}
                  </p>
                </div>

                <Link
                  to={`/my-orders/${order.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700"
                >
                  <span>Order Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Default Address Snapshot */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Default Shipping Address</h2>
        {defaultAddress ? (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Primary Destination
              </span>
              <Link
                to="/account/addresses"
                className="text-xs text-slate-500 hover:text-slate-900 underline font-medium"
              >
                Manage
              </Link>
            </div>
            <p className="font-bold text-sm text-slate-900">{defaultAddress.name} ({defaultAddress.tag})</p>
            <p className="text-xs text-slate-500">
              {defaultAddress.house}, {defaultAddress.street}, {defaultAddress.area}, {defaultAddress.city} – {defaultAddress.pincode}
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <p className="text-xs text-slate-500">No saved address yet.</p>
            <Link
              to="/account/addresses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Address</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
