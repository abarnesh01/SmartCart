const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const UserActivity = require('../models/UserActivity');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Card (Mock Gateway)',
      paymentResult: {
        id: `PAY-${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      },
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderStatus: 'Confirmed',
      isPaid: true,
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();

    // Update stock and sales count for each product & log purchase activity
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        product.salesCount = (product.salesCount || 0) + item.quantity;
        await product.save();

        await UserActivity.create({
          user: req.user._id,
          product: item.product,
          activityType: 'purchase',
          categoryName: product.categoryName,
          metadata: { quantity: item.quantity, price: item.price },
        });
      }
    }

    // Clear user cart upon successful order
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure users can only view their own orders unless they are an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow user to cancel order if it is still Pending/Confirmed, or admin to change to any status
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role !== 'admin' && status !== 'Cancelled') {
      return res.status(403).json({ message: 'Only admins can set order status other than Cancelled' });
    }

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
