const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config({ path: path.join(__dirname, '.env') });

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
app.use('/api/messages', require('./routes/messages'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Twinkle Jewellery API is running!' });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing, return all requests to React app (except API routes)
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
  }
  res.status(500).json({ message: error.message });
});

// Initialize JSON data storage (replaces MongoDB connection)
const initializeData = async () => {
  try {
    const Category = require('./models/Category');
    
    // Check if default categories need to be created
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      console.log('Creating default categories...');
      const defaultCategories = [
        { name: 'Rings', description: 'Beautiful rings for all occasions' },
        { name: 'Necklaces', description: 'Elegant necklaces and chains' },
        { name: 'Earrings', description: 'Stunning earrings collection' },
        { name: 'Bracelets', description: 'Stylish bracelets and bangles' }
      ];
      
      await Category.insertMany(defaultCategories);
      console.log('Default categories created successfully');
    }
    
    console.log('JSON data storage initialized');
  } catch (err) {
    console.error('Error initializing data storage:', err);
  }
};

// Initialize data on startup
initializeData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin key: ${process.env.ADMIN_KEY}`);
});