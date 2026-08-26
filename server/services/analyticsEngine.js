const UserActivity = require('../models/UserActivity');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getAdminAnalyticsMetrics = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate Total Revenue
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Aggregate Activity Counts by ActivityType
    const activityCountsAgg = await UserActivity.aggregate([
      { $group: { _id: '$activityType', count: { $sum: 1 } } },
    ]);
    const activityCounts = {};
    activityCountsAgg.forEach((item) => {
      activityCounts[item._id] = item.count;
    });

    const totalViews = activityCounts['view'] || 0;
    const totalSearches = activityCounts['search'] || 0;
    const totalCartAdds = activityCounts['cart'] || 0;
    const totalWishlistAdds = activityCounts['wishlist'] || 0;
    const totalPurchases = activityCounts['purchase'] || totalOrders;
    const totalRecClicks = activityCounts['recommendation_click'] || 0;

    // Recommendation Click-Through Rate (CTR) estimation
    const recCTR = totalViews > 0 ? Number(((totalRecClicks / Math.max(totalViews, 1)) * 100).toFixed(2)) : 0;

    // Conversion Rate (Purchases / Total Views)
    const conversionRate = totalViews > 0 ? Number(((totalPurchases / Math.max(totalViews, 1)) * 100).toFixed(2)) : 0;

    // Popular Search Terms
    const searchTermsAgg = await UserActivity.aggregate([
      { $match: { activityType: 'search', searchQuery: { $ne: '' } } },
      { $group: { _id: '$searchQuery', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Daily Sales Overview (Past 7 Days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const salesDailyAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top Selling Products
    const topProducts = await Product.find()
      .sort({ salesCount: -1, viewsCount: -1 })
      .limit(5)
      .select('name price salesCount viewsCount images categoryName');

    return {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        recCTR,
        conversionRate,
      },
      activityMetrics: {
        views: totalViews,
        searches: totalSearches,
        cartAdds: totalCartAdds,
        wishlistAdds: totalWishlistAdds,
        purchases: totalPurchases,
        recClicks: totalRecClicks,
      },
      topSearchTerms: searchTermsAgg.map((st) => ({ term: st._id, count: st.count })),
      salesDaily: salesDailyAgg.map((d) => ({ date: d._id, revenue: d.revenue, orders: d.ordersCount })),
      topProducts,
    };
  } catch (error) {
    console.error('[Analytics Engine Error]:', error.message);
    throw error;
  }
};

module.exports = { getAdminAnalyticsMetrics };
