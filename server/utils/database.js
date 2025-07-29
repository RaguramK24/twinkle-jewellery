const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('MONGODB_URI not set. Please configure MongoDB connection.');
      return null;
    }

    // Set a timeout for the connection attempt
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Application will continue without MongoDB. Please check your connection string and network connectivity.');
    return null;
  }
};

module.exports = connectDB;