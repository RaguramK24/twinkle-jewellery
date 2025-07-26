const adminAuth = (req, res, next) => {
  const adminKey = req.headers['admin-key'] || req.query.adminKey;
  
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ 
      message: 'Admin access required. Provide admin-key header or adminKey query parameter.' 
    });
  }
  
  next();
};

module.exports = { adminAuth };