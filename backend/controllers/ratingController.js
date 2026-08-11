const Rating = require('../models/Rating');
const MenuItem = require('../models/MenuItem');

// @desc    Submit a rating/review for a menu item
// @route   POST /api/ratings/:menuItemId
// @access  Private (any authenticated user)
exports.submitRating = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { rating, review, userName } = req.body;

    // Validate
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 5',
      });
    }

    // Check menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    // If user is logged in, check if they already rated this dish
    if (req.user) {
      const existingRating = await Rating.findOne({
        menuItemId,
        userId: req.user.id,
      });
      if (existingRating) {
        // Update existing rating
        existingRating.rating = rating;
        existingRating.review = review || '';
        existingRating.userName = userName || req.user.name || 'Anonymous Student';
        await existingRating.save();

        // Recalculate averages
        await recalculateRating(menuItemId);

        const updatedItem = await MenuItem.findById(menuItemId);
        return res.status(200).json({
          success: true,
          message: 'Rating updated successfully',
          averageRating: updatedItem.averageRating,
          totalRatings: updatedItem.totalRatings,
        });
      }
    }

    // Create new rating
    const newRating = await Rating.create({
      menuItemId,
      cafeId: menuItem.cafeId,
      userId: req.user ? req.user.id : null,
      userName: userName || (req.user ? req.user.name : 'Anonymous Student'),
      rating: Number(rating),
      review: review || '',
    });

    // Recalculate averages on the menu item
    await recalculateRating(menuItemId);

    const updatedItem = await MenuItem.findById(menuItemId);

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully!',
      rating: newRating,
      averageRating: updatedItem.averageRating,
      totalRatings: updatedItem.totalRatings,
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting rating',
      error: error.message,
    });
  }
};

// @desc    Get all ratings for a menu item
// @route   GET /api/ratings/:menuItemId
// @access  Public
exports.getRatings = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const ratings = await Rating.find({ menuItemId })
      .sort({ createdAt: -1 })
      .limit(50);

    const menuItem = await MenuItem.findById(menuItemId).select('averageRating totalRatings name');

    res.status(200).json({
      success: true,
      data: ratings,
      averageRating: menuItem ? menuItem.averageRating : 0,
      totalRatings: menuItem ? menuItem.totalRatings : 0,
      itemName: menuItem ? menuItem.name : '',
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching ratings',
      error: error.message,
    });
  }
};

// Helper: Recalculate average rating from all reviews
async function recalculateRating(menuItemId) {
  const result = await Rating.aggregate([
    { $match: { menuItemId: require('mongoose').Types.ObjectId.createFromHexString(menuItemId) } },
    {
      $group: {
        _id: '$menuItemId',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    const avg = Math.round(result[0].averageRating * 10) / 10; // Round to 1 decimal
    await MenuItem.findByIdAndUpdate(menuItemId, {
      averageRating: avg,
      totalRatings: result[0].totalRatings,
    });
  }
}
