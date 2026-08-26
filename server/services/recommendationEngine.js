const UserActivity = require('../models/UserActivity');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

/**
 * Generates personalized product recommendations based on user activity, wishlist, cart, purchases & content similarity.
 */
const getPersonalizedRecommendations = async (userId, limit = 8) => {
  try {
    let interestedCategories = new Set();
    let interestedBrands = new Set();
    let viewedProductIds = new Set();
    let targetPriceRanges = [];

    if (userId) {
      // 1. Fetch user activities from past 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const activities = await UserActivity.find({ user: userId, createdAt: { $gte: thirtyDaysAgo } })
        .populate('product')
        .limit(100);

      activities.forEach((act) => {
        if (act.product) {
          viewedProductIds.add(act.product._id.toString());
          if (act.product.categoryName) interestedCategories.add(act.product.categoryName);
          if (act.product.brand) interestedBrands.add(act.product.brand);
          targetPriceRanges.push(act.product.price);
        }
        if (act.categoryName) interestedCategories.add(act.categoryName);
      });

      // 2. Fetch Wishlist items
      const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
      if (wishlist && wishlist.products) {
        wishlist.products.forEach((p) => {
          if (p) {
            if (p.categoryName) interestedCategories.add(p.categoryName);
            if (p.brand) interestedBrands.add(p.brand);
            targetPriceRanges.push(p.price);
          }
        });
      }

      // 3. Fetch Cart items
      const cart = await Cart.findOne({ user: userId }).populate('items.product');
      if (cart && cart.items) {
        cart.items.forEach((item) => {
          if (item.product) {
            if (item.product.categoryName) interestedCategories.add(item.product.categoryName);
            if (item.product.brand) interestedBrands.add(item.product.brand);
            targetPriceRanges.push(item.product.price);
          }
        });
      }

      // 4. Fetch Past Orders
      const orders = await Order.find({ user: userId }).limit(10);
      orders.forEach((ord) => {
        ord.orderItems.forEach((item) => {
          if (item.product) targetPriceRanges.push(item.price);
        });
      });
    }

    // Calculate average price preference
    const avgPrice = targetPriceRanges.length > 0
      ? targetPriceRanges.reduce((a, b) => a + b, 0) / targetPriceRanges.length
      : 200;

    const allProducts = await Product.find().populate('category');

    // Score products
    const scoredProducts = allProducts.map((prod) => {
      let score = 0;
      const catName = prod.category ? prod.category.name : prod.categoryName;

      // Category match (+40)
      if (interestedCategories.has(catName)) score += 40;

      // Brand match (+25)
      if (interestedBrands.has(prod.brand)) score += 25;

      // Price similarity bonus (up to +20)
      const priceDiffRatio = Math.abs(prod.price - avgPrice) / Math.max(avgPrice, 1);
      if (priceDiffRatio <= 0.3) score += 20;
      else if (priceDiffRatio <= 0.6) score += 10;

      // Rating & popularity bonus (up to +15)
      score += (prod.averageRating || 0) * 2 + Math.min(prod.numReviews || 0, 5);

      // Featured / Trending bonus (+10)
      if (prod.isFeatured || prod.isTrending) score += 10;

      return { product: prod, score };
    });

    // Sort descending by score
    scoredProducts.sort((a, b) => b.score - a.score);

    return scoredProducts.slice(0, limit).map((sp) => sp.product);
  } catch (error) {
    console.error('[Recommendation Engine Error]:', error.message);
    return await Product.find({ isFeatured: true }).limit(limit);
  }
};

/**
 * Returns similar products based on current product's category, brand, and price range.
 */
const getSimilarProducts = async (productId, limit = 4) => {
  try {
    const currentProduct = await Product.findById(productId).populate('category');
    if (!currentProduct) return [];

    const catId = currentProduct.category ? currentProduct.category._id : null;
    const catName = currentProduct.category ? currentProduct.category.name : currentProduct.categoryName;

    // Find candidates in same category or brand, excluding current product
    const candidates = await Product.find({
      _id: { $ne: productId },
      $or: [
        { category: catId },
        { categoryName: catName },
        { brand: currentProduct.brand },
        { price: { $gte: currentProduct.price * 0.7, $lte: currentProduct.price * 1.3 } },
      ],
    }).populate('category').limit(20);

    const scored = candidates.map((p) => {
      let score = 0;
      const pCatName = p.category ? p.category.name : p.categoryName;
      if (pCatName === catName) score += 50;
      if (p.brand === currentProduct.brand) score += 30;
      const pRatio = Math.abs(p.price - currentProduct.price) / currentProduct.price;
      score += Math.max(0, 20 - pRatio * 20);
      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.product);
  } catch (error) {
    console.error('[Similar Products Error]:', error.message);
    return [];
  }
};

/**
 * Returns user's recently viewed products.
 */
const getRecentlyViewed = async (userId, limit = 6) => {
  if (!userId) return [];
  try {
    const activities = await UserActivity.find({ user: userId, activityType: 'view' })
      .sort({ createdAt: -1 })
      .populate('product')
      .limit(20);

    const uniqueProducts = [];
    const seen = new Set();

    activities.forEach((act) => {
      if (act.product && !seen.has(act.product._id.toString())) {
        seen.add(act.product._id.toString());
        uniqueProducts.push(act.product);
      }
    });

    return uniqueProducts.slice(0, limit);
  } catch (error) {
    console.error('[Recently Viewed Error]:', error.message);
    return [];
  }
};

module.exports = {
  getPersonalizedRecommendations,
  getSimilarProducts,
  getRecentlyViewed,
};
