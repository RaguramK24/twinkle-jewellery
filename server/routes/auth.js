const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Admin credentials (in production, this should be in environment variables or database)
const ADMIN_EMAIL = 'ragurameee24@gmail.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('Admin@123', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST /api/auth/login - Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Check if credentials match admin credentials
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { email: ADMIN_EMAIL, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Set httpOnly cookie with proper settings for session persistence
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    };
    
    // In production, don't set domain to allow cookie to work across different domains
    // The browser will set the cookie for the current domain
    
    res.cookie('adminToken', token, cookieOptions);
    
    res.json({
      message: 'Login successful',
      user: {
        email: ADMIN_EMAIL,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/logout - Admin logout
router.post('/logout', (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  };
  
  // In production, don't set domain to allow cookie clearing to work across different domains
  
  res.clearCookie('adminToken', cookieOptions);
  res.json({ message: 'Logout successful' });
});

// GET /api/auth/me - Get current user info
router.get('/me', (req, res) => {
  const token = req.cookies?.adminToken;
  
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      user: {
        email: decoded.email,
        isAdmin: decoded.isAdmin
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;