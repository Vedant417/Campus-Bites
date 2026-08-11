const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to sign JWT token
const getSignedJwtToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret_123',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log('Backend Register req.body:', req.body);
    const { name, email, phone, password, confirmPassword, role } = req.body;

    // Validate fields
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields',
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check for existing user (email)
    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Check for existing user (phone)
    let userByPhone = await User.findOne({ phone });
    if (userByPhone) {
      return res.status(400).json({
        success: false,
        message: 'A user with this phone number already exists',
      });
    }

    // Determine role (default: student, allow setting cafe_staff / admin only in development, or validate carefully)
    // Note: Cafe staff accounts will be seeded, so we default to student for normal register.
    const userRole = role && ['student', 'cafe_staff', 'admin'].includes(role) ? role : 'student';

    // Create user
    let user = await User.create({
      name,
      email,
      phone,
      password,
      role: userRole,
      cafeId: userRole === 'cafe_staff' ? req.body.cafeId : null,
    });

    // Populate cafeId if registering a cafe staff
    if (userRole === 'cafe_staff' && user.cafeId) {
      user = await User.findById(user._id).populate('cafeId');
    }

    const token = getSignedJwtToken(user);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// @desc    Login user (email or phone)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { loginKey, password } = req.body; // loginKey is either email or phone

    if (!loginKey || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone and password',
      });
    }

    // Check if the user exists. We select password explicitly since it's select:false in schema
    let user = await User.findOne({
      $or: [{ email: loginKey }, { phone: loginKey }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password',
      });
    }

    // Check password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password',
      });
    }

    const token = getSignedJwtToken(user);

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cafeId');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user details',
      error: error.message,
    });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Load current user to check for conflicts
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email already exists',
        });
      }
    }

    // Check if phone number is already taken by another user
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone, _id: { $ne: req.user.id } });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: 'A user with this phone number already exists',
        });
      }
    }

    // Build update object — only update fields that are provided
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;

    // Use findByIdAndUpdate to bypass the pre-save bcrypt hook
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('cafeId');

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile details',
      error: error.message,
    });
  }
};
