const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  cafeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  userName: {
    type: String,
    default: 'Anonymous Student',
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    default: '',
    maxlength: [500, 'Review cannot exceed 500 characters'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// One rating per user per menu item (if logged in)
// Anonymous ratings don't have this restriction
RatingSchema.index({ menuItemId: 1, userId: 1 }, { sparse: true });

module.exports = mongoose.model('Rating', RatingSchema);
