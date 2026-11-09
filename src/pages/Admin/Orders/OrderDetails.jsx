import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../../services/orderService';
import { adminService } from '../../../services/adminService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Save,
  AlertCircle
} from 'lucide-react';

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const { addToast } = useToast();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrderById(orderId);
      setOrder(res);
      setSelectedStatus(res.orderStatus || 'Confirmed');
      setSelectedPaymentStatus(res.paymentStatus || 'Pending (Pay on Delivery)');
    } catch (err) {
      console.error('Failed to load order', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      const updated = await adminService.updateOrderStatus(orderId, {
        orderStatus: selectedStatus,
        paymentStatus: selectedPaymentStatus,
      });
      setOrder(updated);
      addToast(`Order status updated to ${selectedStatus}.`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update order status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
        <p className="font-bold text-rose-900">Order #{orderId} not found in database.</p>
        <Link to="/admin/orders" className="text-xs font-bold text-emerald-600 hover:underline">
          ← Return to Orders List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders List</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Order #{order.id}
          </h1>
          <p className="text-xs text-slate-500">Placed on {formatDate(order.createdAt)}</p>
        </div>

        {/* Status Quick Updater */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
              Order Status
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
              Payment State
            </span>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="Paid">Paid</option>
              <option value="Pending (Pay on Delivery)">Pending (Pay on Delivery)</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <button
            onClick={handleStatusUpdate}
            disabled={updating}
            className="self-end px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{updating ? 'Saving...' : 'Update Status'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ordered Items & Shipping */}
        <div className="lg:col-span-7 space-y-6">
          {/* Items Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">
              Purchased Items ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1547932087-59a8f2be576e?auto=format&fit=crop&w=300&q=80'}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                    />
                    <div className="space-y-0.5 text-xs min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-emerald-600 font-semibold">{item.categoryName || 'Tech Gear'}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-slate-900 shrink-0">
                    {formatCurrency(item.subtotal || item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <MapPin className="w-4 h-4" />
              <span>Shipping Destination</span>
            </div>
            <div className="text-xs space-y-1 text-slate-600">
              <p className="font-bold text-sm text-slate-900">{order.shippingAddress?.name}</p>
              <p className="leading-relaxed">
                {order.shippingAddress?.house}, {order.shippingAddress?.street}, {order.shippingAddress?.area}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
              </p>
              <p className="text-slate-900 font-semibold pt-1">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Price Breakdown & Payment Audit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">Financial Breakdown</h2>

            <div className="space-y-3 text-xs border-b border-slate-100 pb-4">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">{formatCurrency(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span>{order.deliveryCharge > 0 ? formatCurrency(order.deliveryCharge) : 'Free Delivery'}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Tax / GST</span>
                <span>{order.tax > 0 ? formatCurrency(order.tax) : '₹0'}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline text-slate-900">
              <span className="font-bold text-sm">Grand Total</span>
              <span className="font-black text-2xl text-emerald-600">{formatCurrency(order.total)}</span>
            </div>

            {/* Payment Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900">
                  {order.paymentMethod === 'ONLINE' ? 'Online Payment (Razorpay / UPI / Card)' : 'Cash on Delivery (COD)'}
                </span>
              </div>
              <p className="text-[11px]">Payment Status: <strong className="text-emerald-700">{order.paymentStatus}</strong></p>
              {order.transactionId && (
                <p className="text-[11px] text-slate-500">Transaction ID: <code className="text-slate-900 font-mono">{order.transactionId}</code></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
