const Review = require('../models/Review');
const Product = require('../models/Product');

// Helper to update product average rating and numReviews
const updateProductRatingStats = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const averageRating = numReviews > 0
    ? Number((reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews).toFixed(1))
    : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating,
    numReviews,
  });
};

// @desc    Add product review
// @route   POST /api/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product. Edit your existing review.' });
    }

    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      product: productId,
      rating: Number(rating),
      title: title || '',
      comment,
    });

    await updateProductRatingStats(productId);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });

    // Calculate rating distribution (1 to 5 stars)
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (ratingDistribution[r.rating] !== undefined) {
        ratingDistribution[r.rating] += 1;
      }
    });

    res.json({ reviews, ratingDistribution, count: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    review.rating = rating !== undefined ? Number(rating) : review.rating;
    review.title = title !== undefined ? title : review.title;
    review.comment = comment !== undefined ? comment : review.comment;

    const updatedReview = await review.save();
    await updateProductRatingStats(review.product);

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await review.deleteOne();
    await updateProductRatingStats(productId);

    res.json({ message: 'Review removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProductReview,
  getProductReviews,
  updateReview,
  deleteReview,
};
