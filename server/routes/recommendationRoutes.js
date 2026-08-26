const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  trackRecommendationClick,
} = require('../controllers/recommendationController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional auth helper middleware
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'smartcart_super_secret_jwt_key_2026_production_grade'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore token failure for optional endpoints
    }
  }
  next();
};

router.get('/', optionalProtect, getRecommendations);
router.post('/click', optionalProtect, trackRecommendationClick);

module.exports = router;
