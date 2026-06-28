const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-task-tracker-secret');
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return res.status(401).json({ success: false, message: 'User no longer exists' });
  }

  req.user = user;
  next();
});

module.exports = { protect };
