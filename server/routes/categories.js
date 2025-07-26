const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { adminAuth } = require('../middleware/auth');

// GET /api/categories - Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/categories/:id - Get single category (public)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/categories - Create category (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const category = new Category({
      name,
      description: description || ''
    });
    
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name must be unique' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// PUT /api/categories/:id - Update category (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description: description || '' },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name must be unique' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// DELETE /api/categories/:id - Delete category (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;