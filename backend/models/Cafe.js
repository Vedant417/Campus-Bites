const mongoose = require('mongoose');

const CafeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a cafe name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  image: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: 'Special Block',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cafe', CafeSchema);
