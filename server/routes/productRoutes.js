const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getTrendingProducts,
  getProductBrands,
} = require('../controllers/productController');
const { getSimilar } = require('../controllers/recommendationController');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const logActivity = require('../middleware/activityLoggerMiddleware');

router.route('/')
  .get(logActivity('search'), getProducts)
  .post(protect, admin, createProduct);

router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/brands', getProductBrands);

router.route('/:id')
  .get(logActivity('view'), getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.get('/:id/similar', getSimilar);

module.exports = router;
