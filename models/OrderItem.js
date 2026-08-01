const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true },
    product_id: { type: String, default: null },
    product_name: { type: String, required: true },
    product_image: { type: String, default: '' },
    unit_price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    line_total: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrderItem', orderItemSchema);
