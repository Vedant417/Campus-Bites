const Order = require('../models/Order');
const Cafe = require('../models/Cafe');
const User = require('../models/User');
const printerService = require('../services/printerService');

// Helper to get order prefix based on cafe slug
const getOrderPrefix = (slug) => {
  if (slug === 'mayuri') return 'MY';
  if (slug === 'bistro') return 'BI';
  if (slug === 'ab-dakshin') return 'AD';
  return 'CB'; // Campus Bites default
};

// Generate a unique 4-digit order number with prefix
const generateOrderNumber = async (cafeId) => {
  const cafe = await Cafe.findById(cafeId);
  const prefix = cafe ? getOrderPrefix(cafe.slug) : 'CB';
  
  let orderNumber;
  let orderExists = true;
  
  // Keep generating until unique
  while (orderExists) {
    const rand = Math.floor(1000 + Math.random() * 9000); // 4-digit number (1000-9999)
    orderNumber = `${prefix}-${rand}`;
    const existing = await Order.findOne({ orderNumber });
    if (!existing) {
      orderExists = false;
    }
  }
  return orderNumber;
};

// @desc    Create a new order (requires successful payment)
// @route   POST /api/orders
// @access  Private (Student/Admin)
exports.createOrder = async (req, res) => {
  try {
    const { cafeId, items, orderType, paymentDetails } = req.body;

    if (!cafeId || !items || !items.length || !orderType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cafeId, items, and orderType',
      });
    }

    // Business Rule 2: An order belongs to exactly one cafe. Verify all items belong to this cafe
    // Business Rule 3: A cart cannot contain items from multiple cafes (Enforced on client, validated on server)
    
    // Verify that the cafe exists and is active
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      return res.status(404).json({
        success: false,
        message: 'Selected café was not found',
      });
    }
    if (!cafe.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This café is currently closed or unavailable',
      });
    }

    // Calculate subtotal, tax (5%), and total
    let subtotal = 0;
    for (const item of items) {
      // In a real application, we would retrieve prices from DB to prevent client tampering.
      // We will fetch price from DB MenuItem to verify.
      const dbItem = await require('../models/MenuItem').findById(item.menuItemId);
      if (!dbItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item ${item.name} not found`,
        });
      }
      if (!dbItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Sorry, "${dbItem.name}" is currently unavailable.`,
        });
      }
      if (String(dbItem.cafeId) !== String(cafeId)) {
        return res.status(400).json({
          success: false,
          message: 'All items in order must belong to the same café',
        });
      }
      subtotal += dbItem.price * item.quantity;
    }

    let parcelCharge = 0;
    if (orderType === 'Parcel') {
      const slug = cafe.slug;
      if (slug === 'mayuri-special-block' || slug === 'mayuri') {
        parcelCharge = 10;
      } else if (slug === 'ab-dakshin') {
        parcelCharge = 5;
      } else if (slug === 'bistro') {
        parcelCharge = 15;
      } else if (slug === 'underbelly') {
        parcelCharge = 10;
      }
    }
    const tax = 0; // Removed GST
    const totalAmount = subtotal + parcelCharge;

    // Generate unique order number
    const orderNumber = await generateOrderNumber(cafeId);

    // Create Order with paid status
    const order = await Order.create({
      orderNumber,
      userId: req.user.id,
      studentName: req.user.name,
      studentPhone: req.user.phone,
      studentEmail: req.user.email,
      cafeId,
      items: items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      orderType,
      subtotal,
      tax,
      parcelCharge,
      totalAmount,
      paymentStatus: paymentDetails && paymentDetails.status === 'success' ? 'paid' : 'pending',
      orderStatus: 'PLACED',
    });

    // If order is paid, trigger physical printing mock
    if (order.paymentStatus === 'paid') {
      const populatedOrder = await Order.findById(order._id).populate('cafeId');
      await printerService.printOrderTicket(populatedOrder);
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating order',
      error: error.message,
    });
  }
};

// @desc    Get order history for the logged-in student
// @route   GET /api/orders/my-orders
// @access  Private (Student)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('cafeId')
      .sort('-createdAt');
      
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching order history',
      error: error.message,
    });
  }
};

// @desc    Get a single order detail
// @route   GET /api/orders/:id
// @access  Private (Student, Cafe Staff, Admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('cafeId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Business Rule 6: Students can see only their own orders
    // Business Rule 7: Cafe staff can see only orders belonging to their cafe
    if (req.user.role === 'student' && String(order.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    if (req.user.role === 'cafe_staff' && String(order.cafeId._id) !== String(req.user.cafeId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view orders from other cafés',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving order',
      error: error.message,
    });
  }
};

// @desc    Get all orders for a specific cafe (Staff dashboard)
// @route   GET /api/cafe/orders
// @access  Private (Cafe Staff, Admin)
exports.getCafeOrders = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'cafe_staff') {
      if (!req.user.cafeId) {
        return res.status(400).json({
          success: false,
          message: 'Staff user is not assigned to any café',
        });
      }
      query.cafeId = req.user.cafeId;
    } else if (req.user.role === 'admin' && req.query.cafeId) {
      query.cafeId = req.query.cafeId;
    }

    // Filter by paymentStatus = paid so staff only see paid orders (or pending too if required, but rule 4 says order only created after payment)
    const orders = await Order.find(query)
      .populate('cafeId')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving café orders',
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status OR PATCH /api/cafe/orders/:id/status
// @access  Private (Cafe Staff, Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Please provide a valid status: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization: Staff can only update their own cafe's orders
    if (req.user.role === 'cafe_staff' && String(order.cafeId) !== String(req.user.cafeId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update orders for other cafés',
      });
    }

    order.orderStatus = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id).populate('cafeId');

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating order status',
      error: error.message,
    });
  }
};

// @desc    Get system-wide metrics for Admin Dashboard
// @route   GET /api/orders/admin-metrics
// @access  Private (Admin only)
exports.getAdminMetrics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalSales = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const studentCount = await User.countDocuments({ role: 'student' });
    const cafeCount = await Cafe.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        totalOrders,
        studentCount,
        cafeCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving admin metrics',
      error: error.message,
    });
  }
};
