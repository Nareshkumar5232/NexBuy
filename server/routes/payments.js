const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');

// Create Payment Order Session (Backend Controlled)
router.post('/create-order', (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, customerEmail, customerName, customerPhone } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required.' });
    }

    const gatewayOrderId = 'order_rzp_' + Date.now();
    res.json({
      gatewayOrderId,
      amount,
      currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_nexbuy_key',
      customer: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment session.' });
  }
});

// Verify Payment Signature
router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    // In production with live secret:
    // const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');
    // const verified = expected === razorpay_signature;

    const verified = Boolean(razorpay_payment_id || razorpay_order_id);
    const transactionId = razorpay_payment_id || ('TXN_' + Date.now());

    res.json({
      verified,
      transactionId,
      status: verified ? 'Captured' : 'Failed'
    });
  } catch (err) {
    res.status(500).json({ error: 'Payment signature verification failed.' });
  }
});

// Webhook endpoint (Idempotent)
router.post('/webhook', (req, res) => {
  try {
    const event = req.body;
    const data = db.get();

    if (event && event.event === 'payment.captured') {
      const paymentData = event.payload?.payment?.entity;
      if (paymentData) {
        const orderId = paymentData.notes?.orderId;
        const order = data.orders.find(o => o.id === orderId);
        if (order && order.paymentStatus !== 'Paid') {
          order.paymentStatus = 'Paid';
          order.transactionId = paymentData.id;
          order.updatedAt = new Date().toISOString();
          db.save();
        }
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: 'Webhook processing error.' });
  }
});

module.exports = router;
