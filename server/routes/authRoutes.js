const express = require('express');
const {
  changePassword,
  login,
  logout,
  me,
  signup,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateLogin, validateSignup } = require('../middleware/validateMiddleware');

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', protect, me);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

module.exports = router;
