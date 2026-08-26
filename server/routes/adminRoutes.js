const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getUsers,
  updateUserByAdmin,
  getAllOrders,
  getAllReviews,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.use(protect, admin);

router.get('/dashboard', getAdminDashboard);
router.get('/users', getUsers);
router.put('/users/:id', updateUserByAdmin);
router.get('/orders', getAllOrders);
router.get('/reviews', getAllReviews);

module.exports = router;
