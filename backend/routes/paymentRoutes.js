const express = require('express');
const router = express.Router();
const { createPaymentIntent, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/create', protect, authorize('student', 'admin'), createPaymentIntent);
router.post('/verify', protect, authorize('student', 'admin'), verifyPayment);

module.exports = router;
