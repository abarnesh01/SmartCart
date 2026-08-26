const {
  getPersonalizedRecommendations,
  getSimilarProducts,
  getRecentlyViewed,
} = require('../services/recommendationEngine');
const UserActivity = require('../models/UserActivity');

// @desc    Get personalized recommendations and recently viewed
// @route   GET /api/recommendations
// @access  Public / Optional Auth
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;

    const [recommendedForYou, recentlyViewed] = await Promise.all([
      getPersonalizedRecommendations(userId, 8),
      getRecentlyViewed(userId, 6),
    ]);

    res.json({
      recommendedForYou,
      recentlyViewed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get similar products for a target product
// @route   GET /api/products/:id/similar
// @access  Public
const getSimilar = async (req, res) => {
  try {
    const { id } = req.params;
    const similarProducts = await getSimilarProducts(id, 6);
    res.json(similarProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track recommendation click for evaluation analytics
// @route   POST /api/recommendations/click
// @access  Public / Optional Auth
const trackRecommendationClick = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user ? req.user._id : null;

    if (productId) {
      await UserActivity.create({
        user: userId,
        product: productId,
        activityType: 'recommendation_click',
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecommendations,
  getSimilar,
  trackRecommendationClick,
};
