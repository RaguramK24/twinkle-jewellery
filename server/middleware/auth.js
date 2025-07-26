const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const adminAuth = (req, res, next) => {
  const token = req.cookies?.adminToken;
  
  if (!token) {
    return res.status(401).json({ 
      message: 'Admin authentication required. Please login.' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ 
        message: 'Admin access required.' 
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid or expired token. Please login again.' 
    });
  }
};

module.exports = { adminAuth };