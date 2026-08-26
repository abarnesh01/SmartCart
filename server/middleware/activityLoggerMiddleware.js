const UserActivity = require('../models/UserActivity');

const logActivity = (activityType) => {
  return async (req, res, next) => {
    // Keep response non-blocking by logging after request handling
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const userId = req.user ? req.user._id : null;
          const productId = req.params.id || req.body.productId || null;
          const searchQuery = req.query.search || req.query.q || req.body.query || '';
          const categoryName = req.query.category || req.body.categoryName || '';

          await UserActivity.create({
            user: userId,
            product: productId,
            activityType: activityType,
            searchQuery: searchQuery,
            categoryName: categoryName,
            metadata: {
              path: req.originalUrl,
              method: req.method,
            },
          });
        } catch (err) {
          console.error('[Activity Logger Error]:', err.message);
        }
      }
    });
    next();
  };
};

module.exports = logActivity;
