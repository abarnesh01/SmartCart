const Product = require('../models/Product');
const Category = require('../models/Category');
const UserActivity = require('../models/UserActivity');

// @desc    Fetch products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    let query = {};

    // Search query
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { categoryName: searchRegex },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      const categoryDoc = await Category.findOne({
        $or: [{ _id: req.query.category.match(/^[0-9a-fA-F]{24}$/) ? req.query.category : null }, { slug: req.query.category }],
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        query.categoryName = new RegExp(req.query.category, 'i');
      }
    }

    // Brand filter
    if (req.query.brand && req.query.brand !== 'all') {
      query.brand = new RegExp(req.query.brand, 'i');
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.rating) {
      query.averageRating = { $gte: Number(req.query.rating) };
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'rating':
          sort = { averageRating: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'popular':
          sort = { salesCount: -1, viewsCount: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (product) {
      // Increment views count asynchronously
      product.viewsCount = (product.viewsCount || 0) + 1;
      await product.save();

      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).populate('category', 'name slug').limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch trending products
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).populate('category', 'name slug').limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch distinct product brands
// @route   GET /api/products/brands
// @access  Public
const getProductBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getTrendingProducts,
  getProductBrands,
};
