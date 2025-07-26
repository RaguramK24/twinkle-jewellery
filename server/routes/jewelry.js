// Placeholder for jewelry routes
// This file will define API routes for jewelry-related operations

const express = require('express');
const router = express.Router();
const {
  getAllJewelry,
  getJewelryById,
  createJewelry,
  updateJewelry,
  deleteJewelry
} = require('../controllers/jewelryController');

// GET /api/jewelry - Get all jewelry items
router.get('/', getAllJewelry);

// GET /api/jewelry/:id - Get jewelry item by ID
router.get('/:id', getJewelryById);

// POST /api/jewelry - Create new jewelry item
router.post('/', createJewelry);

// PUT /api/jewelry/:id - Update jewelry item by ID
router.put('/:id', updateJewelry);

// DELETE /api/jewelry/:id - Delete jewelry item by ID
router.delete('/:id', deleteJewelry);

module.exports = router;