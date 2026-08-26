const express = require('express');
const router = express.Router();
const {
  getWishlist,
  toggleWishlistItem,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(toggleWishlistItem);

router.delete('/:productId', removeFromWishlist);

module.exports = router;
