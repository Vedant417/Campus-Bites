const Razorpay = require('razorpay');

const Order = require('../models/Order');
const Cafe = require('../models/Cafe');
const Payment = require('../models/Payment');
const MenuItem = require('../models/MenuItem');
const printerService = require('../services/printerService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper to get order prefix based on cafe slug
const getOrderPrefix = (slug) => {
  if (slug === 'mayuri') return 'MY';
  if (slug === 'bistro') return 'BI';
  if (slug === 'ab-dakshin') return 'AD';
  return 'CB';
};

// Generate a unique 4-digit order number
const generateOrderNumber = async (cafeId) => {
  const cafe = await Cafe.findById(cafeId);
  const prefix = cafe ? getOrderPrefix(cafe.slug) : 'CB';
  let orderNumber;
  let orderExists = true;
  while (orderExists) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    orderNumber = `${prefix}-${rand}`;
    const existing = await Order.findOne({ orderNumber });
    if (!existing) {
      orderExists = false;
    }
  }
  return orderNumber;
};

// @desc    Initiate a payment transaction (Mock)
// @route   POST /api/payments/create
// @access  Private (Student)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, cafeId } = req.body;

    if (!amount || !cafeId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide amount and cafeId',
      });
    }

    // Verify cafe is active
    const cafe = await Cafe.findById(cafeId);

    if (!cafe) {
      return res.status(404).json({
        success: false,
        message: 'Café not found',
      });
    }

    if (!cafe.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This café is currently closed or unavailable',
      });
    }

    // Razorpay expects amount in paise.
    // Example: ₹149 -> 14900 paise
    const amountInPaise = Math.round(Number(amount) * 100);

    if (amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `CB-${Date.now()}`,
      notes: {
        cafeId: String(cafeId),
        userId: String(req.user.id),
      },
    });

    return res.status(200).json({
      success: true,
      provider: 'razorpay',
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      status: razorpayOrder.status,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error initiating payment',
    });
  }
};

// @desc    Verify payment transaction & create order (Mock)
// @route   POST /api/payments/verify
// @access  Private (Student)
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      cafeId,
      items,
      orderType,
    } = req.body;

    // --------------------------------------------------
    // 1. Validate required Razorpay/payment information
    // --------------------------------------------------
    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !cafeId ||
      !items ||
      !items.length ||
      !orderType
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Missing payment details, cafe, items, or order type.',
      });
    }

    // --------------------------------------------------
    // 2. Verify Razorpay signature
    // --------------------------------------------------
    const crypto = require('crypto');

    const generatedSignature = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpayOrderId}|${razorpayPaymentId}`
      )
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message:
          'Payment verification failed. Invalid payment signature.',
      });
    }

    // --------------------------------------------------
    // 3. Verify Razorpay order exists
    // --------------------------------------------------
    const razorpayOrder =
      await razorpay.orders.fetch(razorpayOrderId);

    if (!razorpayOrder) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay order could not be found.',
      });
    }

    // --------------------------------------------------
    // 4. Verify payment belongs to this Razorpay order
    // --------------------------------------------------
    const razorpayPayment =
      await razorpay.payments.fetch(
        razorpayPaymentId
      );

    if (
      !razorpayPayment ||
      String(razorpayPayment.order_id) !==
        String(razorpayOrderId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Payment does not belong to the expected order.',
      });
    }

    // --------------------------------------------------
    // 5. Verify payment is captured
    // --------------------------------------------------
    if (razorpayPayment.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message:
          'Payment has not been captured successfully.',
      });
    }

    // --------------------------------------------------
    // 6. Verify cafe
    // --------------------------------------------------
    const cafe = await Cafe.findById(cafeId);

    if (!cafe) {
      return res.status(404).json({
        success: false,
        message: 'Café not found.',
      });
    }

    if (!cafe.isActive) {
      return res.status(400).json({
        success: false,
        message:
          'This café is currently closed. Cannot place order.',
      });
    }

    // --------------------------------------------------
    // 7. Validate menu items from DATABASE
    // --------------------------------------------------
    let subtotal = 0;
    const formattedItems = [];

    for (const item of items) {
      const dbItem = await MenuItem.findById(
        item.menuItemId
      );

      if (!dbItem) {
        return res.status(404).json({
          success: false,
          message:
            `Menu item "${item.name}" not found.`,
        });
      }

      if (!dbItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message:
            `"${dbItem.name}" is currently unavailable.`,
        });
      }

      if (
        String(dbItem.cafeId) !== String(cafeId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            'All items must belong to the same café.',
        });
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid item quantity.',
        });
      }

      subtotal += dbItem.price * quantity;

      formattedItems.push({
        menuItemId: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        quantity,
      });
    }

    // --------------------------------------------------
    // 8. Calculate final amount on SERVER
    // --------------------------------------------------
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

    // Razorpay amount is stored in paise
    const expectedAmountInPaise =
      Math.round(totalAmount * 100);

    // --------------------------------------------------
    // 9. Make sure Razorpay order amount matches
    //    our server-calculated order amount
    // --------------------------------------------------
    if (
      Number(razorpayOrder.amount) !==
      expectedAmountInPaise
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Payment amount does not match the order amount.',
      });
    }

    // --------------------------------------------------
    // 10. Prevent duplicate order creation
    // --------------------------------------------------
    const existingPayment =
      await Payment.findOne({
        transactionId: razorpayPaymentId,
      });

    if (existingPayment) {
      const existingOrder =
        await Order.findById(
          existingPayment.orderId
        ).populate('cafeId');

      return res.status(200).json({
        success: true,
        message:
          'Payment was already processed.',
        data: existingOrder,
      });
    }

    // --------------------------------------------------
    // 11. Generate Campus Bites order number
    // --------------------------------------------------
    const orderNumber =
      await generateOrderNumber(cafeId);

    // --------------------------------------------------
    // 12. Create actual order
    // --------------------------------------------------
    const order = await Order.create({
      orderNumber,

      userId: req.user.id,

      studentName: req.user.name,
      studentPhone: req.user.phone,
      studentEmail: req.user.email,

      cafeId,

      items: formattedItems,

      orderType,

      subtotal,
      tax,
      parcelCharge,
      totalAmount,

      paymentStatus: 'paid',

      orderStatus: 'PLACED',
    });

    // --------------------------------------------------
    // 13. Store payment record
    // --------------------------------------------------
    await Payment.create({
      orderId: order._id,
      userId: req.user.id,

      amount: totalAmount,

      provider: 'razorpay',

      transactionId: razorpayPaymentId,

      status: 'captured',
    });

    // --------------------------------------------------
    // 14. Generate thermal printer ticket
    // --------------------------------------------------
    const populatedOrder =
      await Order.findById(order._id)
        .populate('cafeId');

    await printerService.printOrderTicket(
      populatedOrder
    );

    // --------------------------------------------------
    // 15. Return created order
    // --------------------------------------------------
    return res.status(201).json({
      success: true,
      message:
        'Payment verified and order created successfully.',
      data: populatedOrder,
    });
  } catch (error) {
    console.error(
      'Razorpay payment verification error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Server error verifying payment and placing order.',
    });
  }
};