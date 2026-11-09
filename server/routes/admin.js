const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All endpoints in this router require ADMIN role
router.use(authenticate, requireAdmin);

// Dashboard Statistics & KPIs
router.get('/dashboard', (req, res) => {
  try {
    const data = db.get();
    const orders = data.orders || [];
    const products = data.products || [];
    const users = data.users || [];
    const feedback = data.feedback || [];
    const payments = data.payments || [];

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => ['Placed', 'Confirmed', 'Processing', 'PLACED', 'CONFIRMED', 'PROCESSING'].includes(o.orderStatus)).length;
    const completedOrders = orders.filter(o => ['Delivered', 'DELIVERED', 'Completed'].includes(o.orderStatus)).length;
    const cancelledOrders = orders.filter(o => ['Cancelled', 'CANCELLED'].includes(o.orderStatus)).length;

    // Real calculated revenue from completed or paid orders
    const totalRevenue = orders
      .filter(o => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'CANCELLED')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const pendingPayments = orders.filter(o => o.paymentStatus?.toLowerCase().includes('pending')).length;
    const successfulPayments = orders.filter(o => o.paymentStatus === 'Paid' || o.paymentStatus === 'SUCCESS').length;
    const failedPayments = payments.filter(p => p.paymentStatus === 'FAILED').length;

    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock !== undefined && p.stock <= 5).length;
    const totalCustomers = users.filter(u => u.role === 'USER').length;
    const unreadFeedback = feedback.filter(f => !f.read).length;

    // Recent 5 orders
    const recentOrders = orders.slice(0, 6);

    res.json({
      kpis: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        pendingPayments,
        successfulPayments,
        failedPayments,
        totalProducts,
        lowStockProducts,
        totalCustomers,
        unreadFeedback
      },
      recentOrders,
      settings: data.settings || {}
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics.' });
  }
});

// Orders Management
router.get('/orders', (req, res) => {
  try {
    const data = db.get();
    const { status, paymentStatus, search } = req.query;
    let orders = [...data.orders];

    if (status && status !== 'ALL') {
      orders = orders.filter(o => o.orderStatus?.toUpperCase() === status.toUpperCase());
    }

    if (paymentStatus && paymentStatus !== 'ALL') {
      orders = orders.filter(o => o.paymentStatus?.toUpperCase().includes(paymentStatus.toUpperCase()));
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q) ||
        o.shippingAddress?.phone?.includes(q)
      );
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// Update Order Status
router.patch('/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    const data = db.get();
    const order = data.orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const now = new Date().toISOString();

    if (orderStatus) {
      order.orderStatus = orderStatus;
      // Update timeline if matches
      if (Array.isArray(order.timeline)) {
        order.timeline = order.timeline.map(t => {
          if (t.status.toUpperCase() === orderStatus.toUpperCase() || t.status === orderStatus) {
            return { ...t, done: true, current: true, date: now };
          }
          return t;
        });
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    order.updatedAt = now;
    db.save();
    db.logAudit(req.user.id, 'UPDATE_ORDER_STATUS', 'orders', id, `Updated status to ${orderStatus || ''} ${paymentStatus || ''}`);

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// Payments List
router.get('/payments', (req, res) => {
  try {
    const data = db.get();
    res.json(data.payments || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
});

// Inventory List & Update
router.get('/inventory', (req, res) => {
  try {
    const data = db.get();
    const inventory = data.products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku || ('SKU-' + p.id),
      categoryName: p.categoryName,
      brand: p.brand || 'NEXBUY',
      price: p.price,
      currentStock: p.stock !== undefined ? p.stock : 0,
      inStock: Boolean(p.inStock),
      isLowStock: (p.stock !== undefined ? p.stock : 0) <= 5,
      isOutOfStock: (p.stock !== undefined ? p.stock : 0) === 0
    }));
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory.' });
  }
});

router.put('/inventory/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { stock, inStock } = req.body;
    const data = db.get();
    const product = data.products.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
      product.inStock = product.stock > 0;
    }
    if (inStock !== undefined) {
      product.inStock = Boolean(inStock);
    }
    product.updatedAt = new Date().toISOString();

    db.save();
    db.logAudit(req.user.id, 'UPDATE_INVENTORY', 'products', id, `Updated stock to ${product.stock} (inStock: ${product.inStock})`);

    res.json({
      id: product.id,
      name: product.name,
      stock: product.stock,
      inStock: product.inStock
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inventory.' });
  }
});

// Customers List (Passwords strictly omitted)
router.get('/customers', (req, res) => {
  try {
    const data = db.get();
    const customers = data.users
      .filter(u => u.role === 'USER')
      .map(u => {
        const customerOrders = data.orders.filter(o => o.userId === u.id || o.customerEmail === u.email);
        const totalSpent = customerOrders
          .filter(o => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'CANCELLED')
          .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || '—',
          totalOrders: customerOrders.length,
          totalSpent,
          createdAt: u.createdAt,
          status: 'Active'
        };
      });

    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
});

// Customer Details
router.get('/customers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = db.get();
    const user = data.users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const { password: _, ...safeUser } = user;
    const customerOrders = data.orders.filter(o => o.userId === id || o.customerEmail === user.email);

    res.json({
      customer: safeUser,
      orders: customerOrders
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer details.' });
  }
});

// Brands Management
router.get('/brands', (req, res) => {
  try {
    const data = db.get();
    res.json(data.brands || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brands.' });
  }
});

router.post('/brands', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Brand name is required.' });

    const data = db.get();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newBrand = {
      id: 'brd_' + Date.now(),
      name,
      slug,
      createdAt: new Date().toISOString()
    };

    data.brands.push(newBrand);
    db.save();
    db.logAudit(req.user.id, 'CREATE_BRAND', 'brands', newBrand.id, `Created brand "${name}"`);

    res.status(201).json(newBrand);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create brand.' });
  }
});

router.delete('/brands/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = db.get();
    data.brands = data.brands.filter(b => b.id !== id);
    db.save();
    res.json({ message: 'Brand removed.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove brand.' });
  }
});

// Store Settings (Tax, Shipping, Store Profile)
router.get('/settings', (req, res) => {
  try {
    const data = db.get();
    res.json(data.settings || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

router.put('/settings', (req, res) => {
  try {
    const data = db.get();
    data.settings = {
      ...data.settings,
      ...req.body,
      taxEnabled: req.body.taxEnabled !== undefined ? Boolean(req.body.taxEnabled) : data.settings.taxEnabled,
      taxRate: req.body.taxRate !== undefined ? Number(req.body.taxRate) : data.settings.taxRate,
      shippingCharge: req.body.shippingCharge !== undefined ? Number(req.body.shippingCharge) : data.settings.shippingCharge,
      freeShippingThreshold: req.body.freeShippingThreshold !== undefined ? Number(req.body.freeShippingThreshold) : data.settings.freeShippingThreshold,
      updatedAt: new Date().toISOString()
    };

    db.save();
    db.logAudit(req.user.id, 'UPDATE_SETTINGS', 'settings', 'global', 'Updated store/tax/shipping settings.');

    res.json(data.settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

// Audit Logs
router.get('/audit-logs', (req, res) => {
  try {
    const data = db.get();
    res.json(data.auditLogs || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});


// Feedback Management
router.get('/feedback', (req, res) => {
  try {
    const data = db.get();
    res.json(data.feedback || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback.' });
  }
});

router.patch('/feedback/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const data = db.get();
    const item = data.feedback.find(f => f.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Feedback message not found.' });
    }
    item.read = Boolean(read);
    item.status = item.read ? 'READ' : 'UNREAD';
    db.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update feedback status.' });
  }
});

router.delete('/feedback/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = db.get();
    data.feedback = data.feedback.filter(f => f.id !== id);
    db.save();
    res.json({ message: 'Feedback message deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete feedback.' });
  }
});

// Product aliases for admin operations
router.post('/products', (req, res, next) => {
  req.url = '/';
  require('./products')(req, res, next);
});

router.put('/products/:id', (req, res, next) => {
  req.url = `/${req.params.id}`;
  require('./products')(req, res, next);
});

router.delete('/products/:id', (req, res, next) => {
  req.url = `/${req.params.id}`;
  require('./products')(req, res, next);
});

module.exports = router;
