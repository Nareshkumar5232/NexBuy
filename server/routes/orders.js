const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Calculate Order Totals Authoritatively on Server
// Grand Total = Subtotal - Discount + Shipping + Tax (GST is 0 unless configured)
router.post('/calculate', (req, res) => {
  try {
    const { items = [], promoCode } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required.' });
    }

    const data = db.get();
    const settings = data.settings || {};

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const productId = item.productId || item.product?.id || item.id;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const product = data.products.find(p => p.id === productId || p.slug === productId);

      if (!product) {
        return res.status(400).json({ error: `Product with ID ${productId} was not found in catalog.` });
      }

      const unitPrice = Number(product.price);
      const itemSubtotal = unitPrice * quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        categoryName: product.categoryName,
        unitPrice,
        quantity,
        subtotal: itemSubtotal,
        image: product.images?.[0] || '',
        material: product.material || '',
        dimensions: product.dimensions || '',
        availableStock: product.stock !== undefined ? product.stock : 999
      });
    }

    // Apply Promo Code
    let discount = 0;
    let appliedPromo = null;
    if (promoCode) {
      const clean = promoCode.trim().toUpperCase();
      if (clean === 'WELCOME10' || clean === 'NEXBUY10') {
        discount = Math.round((subtotal * 10) / 100);
        appliedPromo = { code: clean, percentage: 10, discount };
      } else if (clean === 'FIRST5') {
        discount = Math.round((subtotal * 5) / 100);
        appliedPromo = { code: clean, percentage: 5, discount };
      }
    }

    // Tax calculation (CRITICAL: Default tax is 0 unless taxEnabled === true)
    let tax = 0;
    if (settings.taxEnabled && typeof settings.taxRate === 'number' && settings.taxRate > 0) {
      tax = Math.round(((subtotal - discount) * settings.taxRate) / 100);
    }

    // Shipping calculation
    let shipping = settings.shippingCharge || 0;
    if (settings.freeShippingThreshold && subtotal >= settings.freeShippingThreshold) {
      shipping = 0;
    }

    const grandTotal = Math.max(0, subtotal - discount + shipping + tax);

    res.json({
      items: validatedItems,
      subtotal,
      discount,
      appliedPromo,
      tax,
      taxEnabled: Boolean(settings.taxEnabled),
      taxRate: settings.taxRate || 0,
      shipping,
      grandTotal
    });
  } catch (err) {
    console.error('Calculation error:', err);
    res.status(500).json({ error: 'Failed to calculate order totals.' });
  }
});

// Create / Place Order
router.post('/', optionalAuth, (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod = 'COD',
      promoCode,
      transactionId = null,
      notes = ''
    } = req.body;

    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({ error: 'Items and shipping address are required.' });
    }

    const data = db.get();
    const settings = data.settings || {};

    // 1. Authoritatively validate all items and stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const productId = item.productId || item.product?.id || item.id;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const product = data.products.find(p => p.id === productId || p.slug === productId);

      if (!product) {
        return res.status(400).json({ error: `Product "${productId}" is unavailable.` });
      }

      if (product.stock !== undefined && product.stock < quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${quantity}.`
        });
      }

      const unitPrice = Number(product.price);
      const itemSubtotal = unitPrice * quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryName: product.categoryName,
        price: unitPrice,
        quantity,
        image: product.images?.[0] || '',
        material: product.material || '',
        dimensions: product.dimensions || '',
        subtotal: itemSubtotal
      });
    }

    // 2. Authoritative Discounts
    let discount = 0;
    if (promoCode) {
      const clean = promoCode.trim().toUpperCase();
      if (clean === 'WELCOME10' || clean === 'NEXBUY10') {
        discount = Math.round((subtotal * 10) / 100);
      } else if (clean === 'FIRST5') {
        discount = Math.round((subtotal * 5) / 100);
      }
    }

    // 3. Tax / GST (Strictly 0 unless configured)
    let tax = 0;
    if (settings.taxEnabled && typeof settings.taxRate === 'number' && settings.taxRate > 0) {
      tax = Math.round(((subtotal - discount) * settings.taxRate) / 100);
    }

    // 4. Shipping
    let shipping = settings.shippingCharge || 0;
    if (settings.freeShippingThreshold && subtotal >= settings.freeShippingThreshold) {
      shipping = 0;
    }

    const total = Math.max(0, subtotal - discount + shipping + tax);
    const now = new Date().toISOString();
    const orderId = 'NB' + Math.floor(10000 + Math.random() * 90000);

    // Deduct stock for confirmed items
    for (const item of orderItems) {
      const product = data.products.find(p => p.id === item.id);
      if (product && product.stock !== undefined) {
        product.stock = Math.max(0, product.stock - item.quantity);
        if (product.stock === 0) {
          product.inStock = false;
        }
      }
    }

    const isOnline = paymentMethod === 'ONLINE';
    const initialPaymentStatus = isOnline ? 'Paid' : 'Pending (Pay on Delivery)';
    const initialOrderStatus = 'Confirmed';

    const newOrder = {
      id: orderId,
      userId: req.user ? req.user.id : (req.body.userId || 'usr-guest'),
      customerName: shippingAddress.name || (req.user ? req.user.name : 'Guest Customer'),
      customerEmail: shippingAddress.email || (req.user ? req.user.email : 'reach2nexbuy@gmail.com'),
      customerPhone: shippingAddress.phone || '',
      items: orderItems,
      shippingAddress: {
        name: shippingAddress.name,
        house: shippingAddress.house || shippingAddress.street,
        street: shippingAddress.street || '',
        area: shippingAddress.area || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        phone: shippingAddress.phone
      },
      subtotal,
      deliveryCharge: shipping,
      discount,
      tax,
      total,
      paymentMethod,
      paymentProvider: isOnline ? 'Razorpay' : 'Cash on Delivery',
      paymentStatus: initialPaymentStatus,
      transactionId: transactionId || (isOnline ? 'TXN_BC_' + Date.now() : null),
      orderStatus: initialOrderStatus,
      timeline: [
        { status: 'Order Placed', date: now, done: true, current: false },
        { status: 'Confirmed', date: now, done: true, current: true },
        { status: 'Processing', date: null, done: false, current: false },
        { status: 'Packed', date: null, done: false, current: false },
        { status: 'Shipped', date: null, done: false, current: false },
        { status: 'Out for Delivery', date: null, done: false, current: false },
        { status: 'Delivered', date: null, done: false, current: false }
      ],
      notes,
      createdAt: now,
      updatedAt: now
    };

    data.orders.unshift(newOrder);

    // If payment record needs logging
    if (isOnline || transactionId) {
      data.payments.unshift({
        id: 'PAY_' + Date.now(),
        orderId: newOrder.id,
        userId: newOrder.userId,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        amount: newOrder.total,
        paymentMethod: 'ONLINE',
        paymentStatus: 'SUCCESS',
        gateway: 'Razorpay',
        transactionId: newOrder.transactionId,
        createdAt: now,
        updatedAt: now
      });
    }

    db.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to process and create order.' });
  }
});

// Get My Orders (Authenticated User)
router.get('/my-orders', authenticate, (req, res) => {
  try {
    const data = db.get();
    const userOrders = data.orders.filter(o => o.userId === req.user.id);
    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your orders.' });
  }
});

// Get Single Order
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const data = db.get();
    const order = data.orders.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // If caller is authenticated user, verify ownership unless admin
    if (req.user && req.user.role !== 'ADMIN' && order.userId !== req.user.id && order.userId !== 'usr-guest') {
      return res.status(403).json({ error: 'Access denied to this order.' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order details.' });
  }
});

// Customer: Cancel Order
router.patch('/:id/cancel', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Customer request' } = req.body;
    const data = db.get();
    const order = data.orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const cancellableStatuses = ['Pending', 'Confirmed', 'Processing', 'PLACED', 'CONFIRMED', 'PROCESSING'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({ error: `Order cannot be cancelled because it is already ${order.orderStatus}.` });
    }

    order.orderStatus = 'Cancelled';
    order.cancellationReason = reason;
    order.updatedAt = new Date().toISOString();

    // Restock items
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        const prod = data.products.find(p => p.id === item.id);
        if (prod && prod.stock !== undefined) {
          prod.stock += (item.quantity || 1);
          prod.inStock = true;
        }
      }
    }

    db.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
});

module.exports = router;
