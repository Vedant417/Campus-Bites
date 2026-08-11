const express = require('express');
const router = express.Router();
const { getCafeOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Cafe Staff specific endpoints
router.get('/', protect, authorize('cafe_staff', 'admin'), getCafeOrders);
router.patch('/:id/status', protect, authorize('cafe_staff', 'admin'), updateOrderStatus);

module.exports = router;
