const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Review = require('../models/Review');
const UserActivity = require('../models/UserActivity');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');

const { categories, products, sampleReviews } = require('./sampleData');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      UserActivity.deleteMany({}),
      Cart.deleteMany({}),
      Wishlist.deleteMany({}),
    ]);

    console.log('[Seed] Creating demo users (Admin & Customer)...');
    const adminUser = await User.create({
      name: 'SmartCart Administrator',
      email: 'admin@smartcart.com',
      password: 'Admin@123456',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      shippingAddress: {
        address: '100 Tech Park Way, Suite 400',
        city: 'San Francisco',
        postalCode: '94107',
        country: 'United States',
      },
    });

    const testUser = await User.create({
      name: 'Alex Johnson',
      email: 'user@smartcart.com',
      password: 'User@123456',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      shippingAddress: {
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        postalCode: '97477',
        country: 'United States',
      },
    });

    console.log('[Seed] Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('[Seed] Inserting 30+ products...');
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

    const createdProducts = await Product.insertMany(formattedProducts);
    console.log(`[Seed] Successfully seeded ${createdProducts.length} products!`);

    console.log('[Seed] Adding sample reviews & computing ratings...');
    for (let i = 0; i < sampleReviews.length; i++) {
      const targetProd = createdProducts[i % createdProducts.length];
      const rev = sampleReviews[i];

      await Review.create({
        user: testUser._id,
        userName: testUser.name,
        userAvatar: testUser.avatar,
        product: targetProd._id,
        rating: rev.rating,
        title: rev.title,
        comment: rev.comment,
      });

      targetProd.averageRating = rev.rating;
      targetProd.numReviews = 1;
      await targetProd.save();
    }

    console.log('[Seed] Creating sample customer order history...');
    const prod1 = createdProducts[0];
    const prod2 = createdProducts[5];

    await Order.create({
      user: testUser._id,
      orderItems: [
        {
          product: prod1._id,
          name: prod1.name,
          image: prod1.images[0],
          price: prod1.price,
          quantity: 1,
        },
        {
          product: prod2._id,
          name: prod2.name,
          image: prod2.images[0],
          price: prod2.price,
          quantity: 1,
        },
      ],
      shippingAddress: testUser.shippingAddress,
      paymentMethod: 'Card (Mock Gateway)',
      paymentResult: {
        id: 'PAY-SAMPLE-1001',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: testUser.email,
      },
      itemsPrice: prod1.price + prod2.price,
      taxPrice: 25.0,
      shippingPrice: 15.0,
      totalPrice: prod1.price + prod2.price + 40.0,
      orderStatus: 'Delivered',
      isPaid: true,
      paidAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      isDelivered: true,
      deliveredAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    });

    console.log('[Seed] Pre-populating user activity data for recommendation engine & analytics...');
    const activities = [
      { user: testUser._id, product: prod1._id, activityType: 'view', categoryName: prod1.categoryName },
      { user: testUser._id, product: prod2._id, activityType: 'view', categoryName: prod2.categoryName },
      { user: testUser._id, product: prod1._id, activityType: 'cart', categoryName: prod1.categoryName },
      { user: testUser._id, product: prod2._id, activityType: 'wishlist', categoryName: prod2.categoryName },
      { user: testUser._id, activityType: 'search', searchQuery: 'noise cancelling' },
      { user: testUser._id, activityType: 'search', searchQuery: 'smartwatch' },
      { user: testUser._id, product: prod1._id, activityType: 'recommendation_click' },
      { user: testUser._id, product: prod2._id, activityType: 'purchase' },
    ];
    await UserActivity.insertMany(activities);

    console.log('\n======================================================');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('DEMO ACCOUNTS:');
    console.log('  Admin User:');
    console.log('    Email:    admin@smartcart.com');
    console.log('    Password: Admin@123456');
    console.log('  Customer User:');
    console.log('    Email:    user@smartcart.com');
    console.log('    Password: User@123456');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
