const jwt = require('jsonwebtoken');

// Middleware to verify JWT and roles
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

  try {
    const decoded = jwt.verify(token, 'Secret'); // Ensure you use the same secret key as used in signing
    req.user = decoded; // Add the decoded user data (including role) to the request object
    next();
  } catch (err) {
    console.error('JWT Error:', err.message); // Log the error for debugging
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'Access denied: Insufficient permissions' });
  }
  next();
};
console.log("verification passed");
module.exports = {
  verifyToken,
  checkRole,
};
