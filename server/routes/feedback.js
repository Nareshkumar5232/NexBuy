const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Customer: Subscribe to Newsletter
router.post('/newsletter', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const data = db.get();
    if (!data.subscribers) data.subscribers = [];

    const normalized = email.trim().toLowerCase();
    const existing = data.subscribers.find(s => s.email.toLowerCase() === normalized);
    if (existing) {
      return res.json({ message: 'You are already subscribed to NEXBUY product drops & tech updates.' });
    }

    const newSub = {
      id: 'sub_' + Date.now(),
      email: normalized,
      createdAt: new Date().toISOString()
    };

    data.subscribers.unshift(newSub);
    db.save();

    res.status(201).json({
      message: 'Thank you for subscribing to NEXBUY tech updates!',
      subscriber: newSub
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process newsletter subscription.' });
  }
});

// Customer: Submit Feedback / Contact Form
router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject, category, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const data = db.get();
    const newFeedback = {
      id: 'fb_' + Date.now(),
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      category: category || 'General',
      message,
      read: false,
      status: 'UNREAD',
      createdAt: new Date().toISOString()
    };

    data.feedback.unshift(newFeedback);
    db.save();

    res.status(201).json({
      message: 'Feedback submitted successfully.',
      feedback: newFeedback
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
});

// ADMIN: Get All Feedback
router.get('/', authenticate, requireAdmin, (req, res) => {
  try {
    const data = db.get();
    res.json(data.feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback.' });
  }
});

// ADMIN: Mark feedback read/unread
router.patch('/:id/status', authenticate, requireAdmin, (req, res) => {
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

// ADMIN: Delete Feedback
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
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

module.exports = router;
