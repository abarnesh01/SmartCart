const { getAdminAnalyticsMetrics } = require('../services/analyticsEngine');

// @desc    Get detailed evaluation & analytics metrics for academic evaluation
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAdminAnalyticsMetrics();
    res.json(analyticsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
