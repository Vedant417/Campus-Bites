const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getCafeOrders,
  updateOrderStatus,
  getAdminMetrics
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Student order endpoints
router.post('/', protect, authorize('student', 'admin'), createOrder);
router.get('/my-orders', protect, authorize('student', 'admin'), getMyOrders);

// Admin dashboard metrics (placed before /:id)
router.get('/admin-metrics', protect, authorize('admin'), getAdminMetrics);

// Staff/Admin endpoint to get cafe orders
router.get('/cafe-orders', protect, authorize('cafe_staff', 'admin'), getCafeOrders);

// Shared route for order details
router.get('/:id', protect, getOrderById);

// Staff/Admin endpoints to update order status
router.patch('/:id/status', protect, authorize('cafe_staff', 'admin'), updateOrderStatus);
router.patch('/cafe-orders/:id/status', protect, authorize('cafe_staff', 'admin'), updateOrderStatus);

module.exports = router;
