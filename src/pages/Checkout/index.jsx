import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  Plus,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Banknote,
  MapPin,
  Lock,
  User,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { addressService } from '../../services/addressService';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/formatters';

export default function Checkout() {
  const {
    checkoutItems,
    subtotal,
    deliveryCharge,
    discount,
    tax,
    total,
    clearCart,
    directBuyItem,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Multi-step: 1 = Address, 2 = Payment & Review
  const [currentStep, setCurrentStep] = useState(1);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);

  // New address form
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    tag: 'HOME',
    house: '',
    street: '',
    area: '',
    landmark: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    isDefault: false,
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('ONLINE'); // 'ONLINE' or 'COD'
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load addresses
  useEffect(() => {
    async function loadAddresses() {
      setAddressLoading(true);
      try {
        const list = await addressService.getAddresses(user?.id);
        setAddresses(list || []);
        if (list && list.length > 0) {
          const def = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(def.id);
        } else {
          setIsAddingNewAddress(true);
        }
      } finally {
        setAddressLoading(false);
      }
    }
    loadAddresses();
  }, [user]);

  // Sync user info into new address
  useEffect(() => {
    if (user) {
      setNewAddress((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // If no items in checkout
  if (checkoutItems.length === 0) {
    return (
      <div className="pt-24 pb-28 max-w-md mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">No items to checkout</h2>
        <p className="text-xs text-slate-500">Your cart is empty. Please select technology gear to proceed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Handle saving new address
  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.phone || !newAddress.house || !newAddress.street || !newAddress.city || !newAddress.pincode) {
      addToast('Please fill all required address fields.', 'error');
      return;
    }

    try {
      const created = await addressService.addAddress({
        ...newAddress,
        userId: user?.id || 'usr-guest',
      });
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setIsAddingNewAddress(false);
      addToast('Delivery address saved.', 'success');
    } catch {
      addToast('Failed to save address.', 'error');
    }
  };

  // Step 1 to Step 2
  const handleProceedToPayment = () => {
    if (isAddingNewAddress) {
      addToast('Please save or select a delivery address.', 'error');
      return;
    }
    if (!selectedAddressId) {
      addToast('Please select a delivery address.', 'error');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Place Order
  const handlePlaceOrder = async () => {
    setErrorMsg('');
    setIsProcessingOrder(true);

    const activeAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!activeAddress) {
      setErrorMsg('Please select a valid delivery address.');
      setIsProcessingOrder(false);
      return;
    }

    try {
      let transactionId = null;

      if (paymentMethod === 'ONLINE') {
        const session = await paymentService.initializePaymentSession({
          amount: total,
          customerEmail: user?.email || 'reach2nexbuy@gmail.com',
          customerPhone: activeAddress.phone,
          customerName: activeAddress.name,
        });

        const verification = await paymentService.verifyPaymentSignature({
          paymentId: 'PAY_RZP_' + Date.now(),
          orderId: session.sessionId,
          signature: 'sig_verified_nexbuy',
        });

        transactionId = verification.transactionId;
      }

      const createdOrder = await orderService.createOrder({
        userId: user?.id || 'usr-guest',
        items: checkoutItems,
        shippingAddress: activeAddress,
        subtotal,
        deliveryCharge,
        discount,
        tax,
        total,
        paymentMethod,
        transactionId,
      });

      clearCart();
      navigate(`/order-success/${createdOrder.id}`);
    } catch (err) {
      setErrorMsg(err.message || 'Payment or order processing failed. Please try again.');
      addToast('Unable to complete order. Please retry.', 'error');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="pt-4 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Checkout Progress Header */}
      <div className="border-b border-slate-200 pb-6 pt-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              NEXBUY Official Store
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Secure Checkout
            </h1>
          </div>

          {/* Step Badges */}
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-colors ${
                currentStep === 1
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Delivery Address</span>
            </button>

            <span className="text-slate-300">→</span>

            <button
              onClick={() => {
                if (selectedAddressId) setCurrentStep(2);
              }}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-colors ${
                currentStep === 2
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Payment & Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guest Notice */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-800">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Checking out as Guest. Have an existing NEXBUY account?</span>
          </div>
          <Link
            to="/login"
            state={{ redirect: '/checkout' }}
            className="px-4 py-1.5 rounded-xl bg-zinc-950 text-white font-bold uppercase tracking-wider text-[10px] hover:bg-emerald-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Multi-Step Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: DELIVERY ADDRESS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">
                  Select Delivery Address
                </h2>
                {!isAddingNewAddress && (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {/* Saved Address Cards */}
              {!isAddingNewAddress && (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        selectedAddressId === addr.id
                          ? 'bg-emerald-50/50 border-emerald-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border ${
                              selectedAddressId === addr.id
                                ? 'border-emerald-600 bg-emerald-600'
                                : 'border-slate-300'
                            }`}
                          >
                            {selectedAddressId === addr.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{addr.name}</span>
                              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-950 text-white">
                                {addr.tag || 'HOME'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-emerald-600 font-bold">Default</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {addr.house}, {addr.street}, {addr.area ? addr.area + ', ' : ''}{addr.city} – {addr.pincode}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                              Phone: {addr.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleProceedToPayment}
                    className="w-full mt-4 py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-emerald-500/25"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Add New Address Form */}
              {isAddingNewAddress && (
                <form onSubmit={handleSaveNewAddress} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Enter New Delivery Address
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-slate-600">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        placeholder="Recipient Name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-slate-600">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="+91 98400 12345"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-slate-600">Flat / House / Suite *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.house}
                        onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                        placeholder="Flat 2B, Block A"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-slate-600">Street / Road *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="18th Main Road, Anna Nagar"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-slate-600">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="Chennai"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-slate-600">State *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        placeholder="Tamil Nadu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-slate-600">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="600040"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Save & Use Address
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs uppercase hover:bg-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: PAYMENT & REVIEW */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Selected Address Summary */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 flex justify-between items-start shadow-xs">
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Delivering to
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedAddress?.name}</p>
                  <p className="text-slate-600">
                    {selectedAddress?.house}, {selectedAddress?.street}, {selectedAddress?.city} – {selectedAddress?.pincode}
                  </p>
                  <p className="text-slate-500">Phone: {selectedAddress?.phone}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold uppercase tracking-wider cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4">
                <h2 className="text-lg font-black text-slate-900">
                  Select Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Option 1: Online Payment */}
                  <label
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-5 rounded-2xl border flex items-start justify-between cursor-pointer transition-all ${
                      paymentMethod === 'ONLINE'
                        ? 'bg-emerald-50/50 border-emerald-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center border ${
                          paymentMethod === 'ONLINE'
                            ? 'border-emerald-600 bg-emerald-600'
                            : 'border-slate-300'
                        }`}
                      >
                        {paymentMethod === 'ONLINE' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-sm text-slate-900">
                            Online Payment (UPI, Cards, NetBanking)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Instant payment via UPI, Google Pay, NetBanking, or Credit/Debit Cards with 256-bit SSL encryption.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-5 rounded-2xl border flex items-start justify-between cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'bg-emerald-50/50 border-emerald-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center border ${
                          paymentMethod === 'COD'
                            ? 'border-emerald-600 bg-emerald-600'
                            : 'border-slate-300'
                        }`}
                      >
                        {paymentMethod === 'COD' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-sm text-slate-900">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Pay in cash or UPI QR scan when your hardware is delivered to your doorstep.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Final Place Order CTA */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessingOrder}
                  className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-emerald-500/25"
                >
                  {isProcessingOrder ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{paymentMethod === 'ONLINE' ? 'Complete Secure Payment' : 'Confirm & Place Order'} • {formatCurrency(total)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ← Back to Delivery Address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Items & Pricing Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Order Summary</h3>
            <span className="text-xs text-slate-500 font-semibold">{checkoutItems.length} {checkoutItems.length === 1 ? 'Item' : 'Items'}</span>
          </div>

          {/* Items Preview */}
          <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
            {checkoutItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3.5 text-xs">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/80 shrink-0">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1547932087-59a8f2be576e?auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{product.name}</p>
                  <p className="text-[11px] text-slate-500">Qty: {quantity}</p>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {formatCurrency(product.price * quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Delivery</span>
              <span className="text-emerald-600 font-bold">
                {subtotal >= 1999 ? 'Complimentary' : formatCurrency(deliveryCharge || 0)}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Tax / GST</span>
              <span>{tax > 0 ? formatCurrency(tax) : '₹0'}</span>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="text-xl text-slate-900">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>NEXBUY Fulfillment Guarantee</span>
            </div>
            <p>Direct dispatch from Chennai central hub with courier tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
