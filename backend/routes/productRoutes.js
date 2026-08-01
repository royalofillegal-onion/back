const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
