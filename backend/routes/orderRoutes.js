const express = require('express');
const { listOrders, getOrder, createOrder, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, listOrders);
router.get('/:id', authMiddleware, getOrder);
router.post('/', authMiddleware, createOrder);
router.put('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
