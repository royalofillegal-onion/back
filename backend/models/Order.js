const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
    payment_method: { type: String, enum: ['cod', 'upi', 'card'], default: 'cod' },
    payment_details: { type: Object, default: {} },
    subtotal: { type: Number, required: true, default: 0 },
    shipping: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    address_line1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
