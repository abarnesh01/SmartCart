const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const Product = require('./models/Product');
const User = require('./models/User');
const Category = require('./models/Category');
const { categories, products } = require('./seed/sampleData');

const app = express();

// Connect to Database & Auto-Seed
connectDB().then(async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Server Startup] Database is empty. Auto-seeding initial products & demo accounts...');

      await User.create({
        name: 'SmartCart Administrator',
        email: 'admin@smartcart.com',
        password: 'Admin@123456',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      });

      await User.create({
        name: 'Alex Johnson',
        email: 'user@smartcart.com',
        password: 'User@123456',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      });

      const createdCategories = await Category.insertMany(categories);
      const categoryMap = {};
      createdCategories.forEach((cat) => {
        categoryMap[cat.name] = cat._id;
      });

      const formattedProducts = products.map((prod) => {
        const catId = categoryMap[prod.categoryName];
        const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return {
          ...prod,
          slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
          category: catId,
          viewsCount: Math.floor(Math.random() * 150) + 20,
          salesCount: Math.floor(Math.random() * 40) + 5,
        };
      });

      const inserted = await Product.insertMany(formattedProducts);
      console.log(`[Server Startup] Auto-seeded ${inserted.length} products & demo accounts successfully!`);
    }
  } catch (seedErr) {
    console.error('[Server Startup Auto-seed Error]:', seedErr.message);
  }
});

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' },
});

app.use('/api', limiter);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SmartCart API Server Operational', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SmartCart Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
