const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev-task-tracker-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const publicUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  name: user.fullName,
  username: user.username || '',
  email: user.email,
  avatar: user.avatar || '',
  bio: user.bio || '',
  createdAt: user.createdAt,
});

const signup = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email is already registered' });
  }

  const user = await User.create({
    fullName: fullName.trim(),
    username: username?.trim() || '',
    email: email.trim(),
    password,
  });

  sendSuccess(res, 201, 'Account created successfully', {
    user: publicUser(user),
    token: signToken(user._id),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  sendSuccess(res, 200, 'Logged in successfully', {
    user: publicUser(user),
    token: signToken(user._id),
  });
});

const me = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Profile loaded', { user: publicUser(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, name, username, email, avatar, bio } = req.body;
  const nextEmail = email?.toLowerCase().trim();

  if (nextEmail) {
    const existingUser = await User.findOne({
      email: nextEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(fullName || name ? { fullName: (fullName || name).trim() } : {}),
      ...(typeof username === 'string' ? { username: username.trim() } : {}),
      ...(nextEmail ? { email: nextEmail } : {}),
      ...(typeof avatar === 'string' ? { avatar: avatar.trim() } : {}),
      ...(typeof bio === 'string' ? { bio: bio.trim() } : {}),
    },
    { new: true, runValidators: true },
  );

  sendSuccess(res, 200, 'Profile updated', { user: publicUser(user) });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const strongPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All password fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'New passwords do not match' });
  }

  if (!strongPasswordPattern.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol',
    });
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  sendSuccess(res, 200, 'Password changed successfully');
});

const logout = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Logged out successfully');
});

module.exports = { signup, login, me, updateProfile, changePassword, logout };
