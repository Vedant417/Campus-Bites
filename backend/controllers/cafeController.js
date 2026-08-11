const Cafe = require('../models/Cafe');
const MenuItem = require('../models/MenuItem');

// @desc    Get all active cafes
// @route   GET /api/cafes
// @access  Public
exports.getCafes = async (req, res) => {
  try {
    const cafes = await Cafe.find();
    cafes.sort((a, b) => {
      const locA = a.location || 'Special Block';
      const locB = b.location || 'Special Block';
      if (locA === 'Special Block' && locB !== 'Special Block') return -1;
      if (locA !== 'Special Block' && locB === 'Special Block') return 1;
      // Secondary sort: preserve order (Mayuri - Special Block, Bistro, AB Dakshin)
      const order = ['Mayuri - Special Block', 'Bistro', 'AB Dakshin', 'Mayuri', 'Underbelly'];
      const indexA = order.indexOf(a.name);
      const indexB = order.indexOf(b.name);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      return a.name.localeCompare(b.name);
    });
    res.status(200).json({
      success: true,
      count: cafes.length,
      data: cafes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving cafes list',
      error: error.message,
    });
  }
};

// @desc    Get single cafe by slug
// @route   GET /api/cafes/:slug
// @access  Public
exports.getCafeBySlug = async (req, res) => {
  try {
    const cafe = await Cafe.findOne({ slug: req.params.slug });
    if (!cafe) {
      return res.status(404).json({
        success: false,
        message: `Cafe not found with slug ${req.params.slug}`,
      });
    }
    res.status(200).json({
      success: true,
      data: cafe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving cafe details',
      error: error.message,
    });
  }
};

// @desc    Get menu items for a specific cafe
// @route   GET /api/cafes/:cafeId/menu
// @access  Public
exports.getCafeMenu = async (req, res) => {
  try {
    const { cafeId } = req.params;
    
    // Check if cafe exists
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      return res.status(404).json({
        success: false,
        message: `Cafe not found with id ${cafeId}`,
      });
    }

    const menuItems = await MenuItem.find({ cafeId });
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving menu',
      error: error.message,
    });
  }
};

// @desc    Add a menu item
// @route   POST /api/menu
// @access  Private (Admin or Cafe Staff)
exports.addMenuItem = async (req, res) => {
  try {
    const { cafeId, name, description, category, price, image, isVeg, isAvailable } = req.body;

    if (!cafeId || !name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cafeId, name, description, category, and price',
      });
    }

    // Authorization verification: Cafe staff can only add items to their own cafe
    if (req.user.role === 'cafe_staff' && String(req.user.cafeId) !== String(cafeId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add menu items to this cafe',
      });
    }

    const menuItem = await MenuItem.create({
      cafeId,
      name,
      description,
      category,
      price,
      image,
      isVeg: isVeg !== undefined ? isVeg : true,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating menu item',
      error: error.message,
    });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private (Admin or Cafe Staff)
exports.updateMenuItem = async (req, res) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: `Menu item not found with id ${req.params.id}`,
      });
    }

    // Authorization: Cafe staff can only update items in their own cafe
    if (req.user.role === 'cafe_staff' && String(req.user.cafeId) !== String(menuItem.cafeId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update menu items in this cafe',
      });
    }

    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating menu item',
      error: error.message,
    });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private (Admin or Cafe Staff)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: `Menu item not found with id ${req.params.id}`,
      });
    }

    // Authorization: Cafe staff can only delete items in their own cafe
    if (req.user.role === 'cafe_staff' && String(req.user.cafeId) !== String(menuItem.cafeId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete menu items in this cafe',
      });
    }

    await menuItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting menu item',
      error: error.message,
    });
  }
};

// @desc    Toggle cafe active status (Open/Close)
// @route   PATCH /api/cafes/:id/status
// @access  Private (Admin only)
exports.toggleCafeStatus = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) {
      return res.status(404).json({
        success: false,
        message: `Cafe not found with id ${req.params.id}`,
      });
    }

    cafe.isActive = !cafe.isActive;
    await cafe.save();

    res.status(200).json({
      success: true,
      data: cafe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating cafe status',
      error: error.message,
    });
  }
};
