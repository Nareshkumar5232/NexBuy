const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Get all categories
router.get('/', (req, res) => {
  try {
    const data = db.get();
    res.json(data.categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// ADMIN: Create Category
router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { name, slug, description, image, heroTagline } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const data = db.get();
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (data.categories.some(c => c.slug === finalSlug)) {
      return res.status(400).json({ error: 'A category with this slug already exists.' });
    }

    const newCategory = {
      id: 'cat_' + Date.now(),
      name,
      slug: finalSlug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1547932087-59a8f2be576e?auto=format&fit=crop&w=800&q=80',
      heroTagline: heroTagline || name,
      createdAt: new Date().toISOString()
    };

    data.categories.push(newCategory);
    db.save();
    db.logAudit(req.user.id, 'CREATE_CATEGORY', 'categories', newCategory.id, `Created category "${newCategory.name}"`);

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category.' });
  }
});

// ADMIN: Update Category
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const data = db.get();
    const cat = data.categories.find(c => c.id === id || c.slug === id);
    if (!cat) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    Object.assign(cat, req.body, { updatedAt: new Date().toISOString() });
    db.save();
    db.logAudit(req.user.id, 'UPDATE_CATEGORY', 'categories', cat.id, `Updated category "${cat.name}"`);

    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

// ADMIN: Delete Category
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const data = db.get();
    const cat = data.categories.find(c => c.id === id || c.slug === id);
    if (!cat) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    data.categories = data.categories.filter(c => c.id !== cat.id);
    db.save();
    db.logAudit(req.user.id, 'DELETE_CATEGORY', 'categories', cat.id, `Deleted category "${cat.name}"`);

    res.json({ message: 'Category deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

module.exports = router;
