const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  });
}

exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName: fullName || '',
    });

    const token = createToken(user);
    res.status(201).json({ token, user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken(user);
    res.json({ token, user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      addressLine1: req.body.addressLine1,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country,
    };

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
