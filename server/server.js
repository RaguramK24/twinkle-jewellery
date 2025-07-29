const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./utils/database');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration - whitelist allowed origins for frontend requests
const allowedOrigins = [
  'https://twinkle-jewellery.onrender.com', // Production frontend
  'http://localhost:3000',                    // Local development frontend
  'https://www.twinklesjewellery.in',        // Custom domain with www
  'https://twinklesjewellery.in'             // Custom domain without www
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Ensure uploads directory exists
const ensureDirectories = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const tmpDir = path.join(__dirname, 'tmp');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
  }
  
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
    console.log('Created tmp directory:', tmpDir);
  }
};

// Create required directories
ensureDirectories();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/messages', require('./routes/messages'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const health = {
    message: 'Twinkle Jewellery API is running!',
    timestamp: new Date().toISOString(),
    database: 'disconnected'
  };
  
  try {
    if (mongoose.connection.readyState === 1) {
      health.database = 'connected';
      health.dbHost = mongoose.connection.host;
    } else if (mongoose.connection.readyState === 2) {
      health.database = 'connecting';
    }
  } catch (error) {
    health.database = 'error';
    health.dbError = error.message;
  }
  
  res.json(health);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin key: ${process.env.ADMIN_KEY || 'Not set'}`);
});
