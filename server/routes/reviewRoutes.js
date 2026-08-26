const express = require('express');
const router = express.Router();
const {
  createProductReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:productId', getProductReviews);
router.post('/', protect, createProductReview);
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
