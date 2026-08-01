const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    fullName: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String, default: '' },
    addressLine1: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'United States' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
