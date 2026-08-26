const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    activityType: {
      type: String,
      enum: ['view', 'search', 'wishlist', 'cart', 'purchase', 'recommendation_click'],
      required: true,
    },
    searchQuery: {
      type: String,
      default: '',
    },
    categoryName: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

userActivitySchema.index({ user: 1, activityType: 1 });
userActivitySchema.index({ product: 1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);
