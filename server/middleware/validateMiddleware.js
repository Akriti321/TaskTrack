const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const validateSignup = (req, res, next) => {
  const { fullName, name, email, password, confirmPassword } = req.body;

  if (!(fullName || name)?.trim()) {
    return res.status(400).json({ success: false, message: 'Full name is required' });
  }

  if (!email?.trim()) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  if (!strongPasswordPattern.test(password || '')) {
    return res.status(400).json({
      success: false,
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  if (!req.body.email?.trim() || !req.body.password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  next();
};

module.exports = { validateSignup, validateLogin };
