const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST /api/messages - Submit a new message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const savedMessage = await Message.save({
      name,
      email,
      message
    });
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages - Get all messages (for admin)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.findSorted();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;