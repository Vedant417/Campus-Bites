const express = require('express');
const router = express.Router();
const {
  getCafes,
  getCafeBySlug,
  getCafeMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleCafeStatus
} = require('../controllers/cafeController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getCafes);
router.get('/:slug', getCafeBySlug);
router.get('/:cafeId/menu', getCafeMenu);

// Protected routes (Admin / Staff only)
router.post('/menu', protect, authorize('admin', 'cafe_staff'), addMenuItem);
router.put('/menu/:id', protect, authorize('admin', 'cafe_staff'), updateMenuItem);
router.delete('/menu/:id', protect, authorize('admin', 'cafe_staff'), deleteMenuItem);
router.patch('/:id/status', protect, authorize('admin'), toggleCafeStatus);

module.exports = router;
