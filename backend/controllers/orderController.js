const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

exports.listOrders = async (req, res) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { user_id: req.user?._id?.toString() || req.user?.id?.toString() };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && order.user_id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const items = await OrderItem.find({ order_id: req.params.id });
    res.json({ order, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      user_id: req.user._id.toString(),
      payment_method: req.body.payment_method || 'cod',
      payment_details: req.body.payment_details || {},
    };
    const order = await Order.create(payload);

    const items = req.body.items || [];
    const orderItems = items.map((item) => ({
      order_id: order._id.toString(),
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      unit_price: item.unit_price,
      quantity: item.quantity,
      line_total: item.line_total,
    }));
    await OrderItem.insertMany(orderItems);

    await Promise.all(items.map((item) => Product.findByIdAndUpdate(item.product_id, { $inc: { stock: -item.quantity } })));
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.user_id === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const newStatus = req.body.status;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!isAdmin && newStatus !== 'cancelled') {
      return res.status(403).json({ message: 'Only admins can update order status' });
    }

    order.status = newStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
