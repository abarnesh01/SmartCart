const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Category = require('../models/Category');
const { getAdminAnalyticsMetrics } = require('../services/analyticsEngine');

// @desc    Get admin dashboard metrics & sales breakdown
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  try {
    const analytics = await getAdminAnalyticsMetrics();
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      ...analytics,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role or status (Admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.role && ['user', 'admin'].includes(req.body.role)) {
      user.role = req.body.role;
    }

    if (typeof req.body.isEnabled === 'boolean') {
      user.isEnabled = req.body.isEnabled;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isEnabled: updatedUser.isEnabled,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPercentage,
      category,
      brand,
      images,
      specifications,
      stock,
      model3D,
      isFeatured,
      isTrending,
    } = req.body;

    let categoryDoc;
    if (category) {
      categoryDoc = await Category.findById(category);
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = new Product({
      name,
      slug: `${slug}-${Date.now()}`,
      description,
      price: Number(price),
      discountPercentage: Number(discountPercentage || 0),
      category: categoryDoc ? categoryDoc._id : null,
      categoryName: categoryDoc ? categoryDoc.name : (req.body.categoryName || 'General'),
      brand: brand || 'SmartCart',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      specifications: specifications || [],
      stock: Number(stock || 10),
      model3D: model3D || { type: 'headphones', color: '#3b82f6' },
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const fields = [
      'name',
      'description',
      'price',
      'discountPercentage',
      'brand',
      'images',
      'specifications',
      'stock',
      'model3D',
      'isFeatured',
      'isTrending',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.category) {
      const categoryDoc = await Category.findById(req.body.category);
      if (categoryDoc) {
        product.category = categoryDoc._id;
        product.categoryName = categoryDoc.name;
      }
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for moderation (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminDashboard,
  getUsers,
  updateUserByAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getAllReviews,
};
