const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const UserActivity = require('../models/UserActivity');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add / toggle product in wishlist
// @route   POST /api/wishlist
// @access  Private
const toggleWishlistItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const existsIndex = wishlist.products.findIndex((p) => p.toString() === productId);

    let isAdded = false;
    if (existsIndex > -1) {
      wishlist.products.splice(existsIndex, 1);
    } else {
      wishlist.products.push(productId);
      isAdded = true;

      // Log wishlist activity
      await UserActivity.create({
        user: req.user._id,
        product: productId,
        activityType: 'wishlist',
        categoryName: product.categoryName,
      });
    }

    await wishlist.save();
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    res.json({
      message: isAdded ? 'Added to wishlist' : 'Removed from wishlist',
      isAdded,
      wishlist: updatedWishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWishlist,
  toggleWishlistItem,
  removeFromWishlist,
};
