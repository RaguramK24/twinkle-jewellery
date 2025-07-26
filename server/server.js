const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Twinkle Jewellery API is running!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
  }
  res.status(500).json({ message: error.message });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/twinkle-jewellery')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Create some default categories if none exist
    const Category = require('./models/Category');
    Category.countDocuments().then(count => {
      if (count === 0) {
        const defaultCategories = [
          { name: 'Rings', description: 'Beautiful rings for all occasions' },
          { name: 'Necklaces', description: 'Elegant necklaces and chains' },
          { name: 'Earrings', description: 'Stunning earrings collection' },
          { name: 'Bracelets', description: 'Stylish bracelets and bangles' }
        ];
        
        Category.insertMany(defaultCategories)
          .then(() => console.log('Default categories created'))
          .catch(err => console.error('Error creating default categories:', err));
      }
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin key: ${process.env.ADMIN_KEY}`);
});