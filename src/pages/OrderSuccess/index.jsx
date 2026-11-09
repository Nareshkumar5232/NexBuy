import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, MapPin, Truck, ShieldCheck, Mail } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const found = await orderService.getOrderById(orderId);
        setOrder(found);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-36 pb-28 max-w-md mx-auto px-4 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Retrieving order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="pt-10 pb-28 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
      {/* Confirmation Icon & Title */}
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-8 h-8 stroke-[2]" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Thank you for choosing NEXBUY.
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Your order has been recorded in our system. Our Chennai fulfillment operations are preparing your technology gear for swift dispatch.
        </p>
      </div>

      {/* Order Info Card */}
      {order && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 text-left space-y-6 shadow-sm">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-5 border-b border-slate-100 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Reference</span>
              <p className="text-xl font-black text-slate-900">#{order.id}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Paid</span>
              <p className="text-xl font-black text-emerald-600">{formatCurrency(order.total)}</p>
            </div>
          </div>

          {/* Delivery & Payment details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] uppercase tracking-wider">Shipping Address</span>
              </div>
              <p className="font-bold text-slate-800">{order.shippingAddress?.name}</p>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                {order.shippingAddress?.house}, {order.shippingAddress?.street}, {order.shippingAddress?.area}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
              </p>
              {order.shippingAddress?.phone && (
                <p className="text-slate-500 text-[11px]">Phone: {order.shippingAddress.phone}</p>
              )}
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] uppercase tracking-wider">Payment Details</span>
              </div>
              <p className="font-bold text-slate-800">
                {order.paymentMethod === 'ONLINE' ? 'Online Payment (Razorpay / UPI / Card)' : 'Cash on Delivery (COD)'}
              </p>
              <p className="text-slate-500 text-[11px]">
                Payment Status: <span className="font-bold text-emerald-600">{order.paymentStatus || 'Completed'}</span>
              </p>
              {order.transactionId && (
                <p className="text-[10px] font-mono text-slate-400">Txn: {order.transactionId}</p>
              )}
            </div>
          </div>

          {/* Items Purchased */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Purchased Items</span>
            <div className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1547932087-59a8f2be576e?auto=format&fit=crop&w=300&q=80'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200/80"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">{formatCurrency(item.subtotal || (item.price * item.quantity))}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Order confirmation and tracking details will be dispatched to your registered email & phone.</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          to={`/my-orders/${orderId}`}
          className="px-6 py-3 rounded-xl bg-[#0B0F17] hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          Track & View Order
        </Link>
        <Link
          to="/products"
          className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
