import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Package, Check, Play, AlertCircle, RefreshCw, Box, Utensils, XCircle, Trash2, Plus, Upload, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const defaultCategories = [
    'Tandoor Snacks',
    'Veg Tables',
    'Juice',
    'International',
    'Chinese',
    'Sandwich',
    'Roti',
    'Roll/Wrap',
    'Pizza',
    'Pasta',
    'Chicken',
    'Mocktail',
    'Combos',
    'Fries',
    'Samosa',
    'Chaat',
    'Tea/Coffee',
    'Bread Items',
    'Momo',
    'Shakes & Coffees',
    'Burgers & Hotdogs',
    'Bakery'
  ];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    isVeg: true,
    description: '',
    category: 'Tandoor Snacks',
    customCategory: '',
    price: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    if (!newItemData.name || !newItemData.price) {
      toast.error('Please fill in required fields (Name and Price).');
      return;
    }
    try {
      setIsSubmitting(true);
      const cafeId = typeof user.cafeId === 'object' ? user.cafeId._id : user.cafeId;
      
      const finalCategory = newItemData.category === 'Custom' 
        ? newItemData.customCategory 
        : newItemData.category;

      if (!finalCategory) {
        toast.error('Please specify a category.');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        cafeId,
        name: newItemData.name,
        description: newItemData.description.trim() || 'Delicious food item.',
        category: finalCategory,
        price: Number(newItemData.price),
        image: newItemData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        isVeg: newItemData.isVeg,
      };

      const res = await API.post('/cafes/menu', payload);
      if (res.data.success) {
        setMenuItems(prev => [...prev, res.data.data]);
        toast.success('Dish added successfully!');
        setIsAddModalOpen(false);
        setNewItemData({
          name: '',
          isVeg: true,
          description: '',
          category: 'Tandoor Snacks',
          customCategory: '',
          price: '',
          image: ''
        });
      }
    } catch (err) {
      console.error('Error adding new menu item:', err);
      const serverMsg = err.response?.data?.message || err.message;
      toast.error(`Failed to add new item: ${serverMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      const res = await API.delete(`/cafes/menu/${itemToDelete._id}`);
      if (res.data.success) {
        setMenuItems(prev => prev.filter(i => i._id !== itemToDelete._id));
        toast.success('Dish deleted successfully!');
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (err) {
      console.error('Error deleting menu item:', err);
      toast.error('Failed to delete item. Please try again.');
    }
  };

  const fetchMenu = async () => {
    try {
      if (user && user.cafeId) {
        const cafeId = typeof user.cafeId === 'object' ? user.cafeId._id : user.cafeId;
        const res = await API.get(`/cafes/${cafeId}/menu`);
        if (res.data.success) {
          setMenuItems(res.data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching menu items for staff:', err);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleToggleStock = async (itemId, currentStatus) => {
    try {
      const res = await API.put(`/cafes/menu/${itemId}`, { isAvailable: !currentStatus });
      if (res.data.success) {
        setMenuItems(prev =>
          prev.map(item => item._id === itemId ? { ...item, isAvailable: !currentStatus } : item)
        );
        toast.success(currentStatus ? 'Marked out of stock!' : 'Marked in stock!');
      }
    } catch (err) {
      console.error('Error toggling menu item status:', err);
      toast.error('Failed to update stock status.');
    }
  };

  const fetchCafeOrders = async (showSpinner = false) => {
    try {
      if (showSpinner) setLoading(true);
      const res = await API.get('/cafe/orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching staff orders:', err);
      setError('Could not fetch orders for your café.');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafeOrders(true);
    if (user && user.cafeId) {
      fetchMenu();
    }

    // Poll for new orders every 7 seconds
    const interval = setInterval(() => {
      setRefreshing(true);
      fetchCafeOrders(false).then(() => setRefreshing(false));
    }, 7000);

    return () => clearInterval(interval);
  }, [user]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await API.patch(`/cafe/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        toast.success(`Order status updated to ${newStatus}!`);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <div className="w-10 h-10 border-4 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-500 mt-4 font-medium font-sans">Loading kitchen dashboard...</p>
      </div>
    );
  }

  // Filter orders by column
  const newOrders = orders.filter((o) => o.orderStatus === 'PLACED');
  const preparingOrders = orders.filter((o) => ['ACCEPTED', 'PREPARING'].includes(o.orderStatus));
  const readyOrders = orders.filter((o) => o.orderStatus === 'READY');
  const completedOrders = orders.filter((o) => o.orderStatus === 'COMPLETED').slice(0, 10); // Show last 10 completed

  // Get active stats counts
  const newCount = newOrders.length;
  const preparingCount = preparingOrders.length;
  const readyCount = readyOrders.length;
  const completedCount = orders.filter((o) => o.orderStatus === 'COMPLETED').length;

  const cafeName = user?.cafeId?.name || 'Campus';

  // Filter menu items by search query
  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper for rendering items inline
  const renderItemDetails = (items) => {
    return items.map((i) => `${i.quantity}x ${i.name}`).join(', ');
  };

  return (
    <div className="space-y-8 pb-16 pt-4 max-w-7xl mx-auto">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent-orange bg-accent-orange/10 px-2.5 py-1 rounded-full">
            Kitchen Mode
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 font-sans mt-1.5">
            {cafeName} Café Dashboard
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">Good afternoon, chef! Manage orders in real-time.</p>
        </div>
        
        {/* Refresh button */}
        <button
          onClick={() => fetchCafeOrders(true)}
          className="inline-flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs py-3.5 px-5 rounded-xl shadow-md self-start sm:self-auto transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {error && (
        <div className="bg-accent-red-light/20 border border-accent-red/20 text-accent-red p-4 rounded-2xl text-center text-sm">
          {error}
        </div>
      )}

      {/* Statistics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center font-bold text-lg">
            {newCount}
          </div>
          <div>
            <span className="text-stone-400 text-[10px] block font-bold uppercase tracking-wider">New Orders</span>
            <span className="text-lg font-extrabold text-stone-800">{newCount} active</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100/70 text-amber-600 flex items-center justify-center font-bold text-lg">
            {preparingCount}
          </div>
          <div>
            <span className="text-stone-400 text-[10px] block font-bold uppercase tracking-wider">Preparing</span>
            <span className="text-lg font-extrabold text-stone-800">{preparingCount} active</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center font-bold text-lg">
            {readyCount}
          </div>
          <div>
            <span className="text-stone-400 text-[10px] block font-bold uppercase tracking-wider">Ready</span>
            <span className="text-lg font-extrabold text-stone-800">{readyCount} pending</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-lg">
            {completedCount}
          </div>
          <div>
            <span className="text-stone-400 text-[10px] block font-bold uppercase tracking-wider">Completed</span>
            <span className="text-lg font-extrabold text-stone-850">{completedCount} today</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {/* Column 1: NEW */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-2xl border border-blue-100/30">
            <span className="text-xs font-extrabold text-blue-700 tracking-wider uppercase">NEW</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              {newOrders.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {newOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-4 border border-stone-200/40 shadow-sm space-y-3 relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-extrabold text-stone-900 block font-sans">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-[10px] text-stone-400 font-bold block">{order.studentName}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                    order.orderType === 'Dine In' ? 'bg-orange-50 text-orange-600' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {order.orderType === 'Dine In' ? <Utensils className="w-2.5 h-2.5 mr-0.5" /> : <Box className="w-2.5 h-2.5 mr-0.5" />}
                    {order.orderType}
                  </span>
                </div>

                <p className="text-xs text-stone-600 font-medium bg-stone-50 p-2 rounded-xl">
                  {renderItemDetails(order.items)}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'ACCEPTED')}
                    className="flex-1 bg-stone-900 hover:bg-stone-850 text-white font-bold py-2 rounded-lg text-[10px] transition-colors flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Order</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'CANCELLED')}
                    className="p-2 text-stone-400 hover:text-accent-red hover:bg-accent-red-light/30 rounded-lg transition-colors border border-stone-250/20 cursor-pointer"
                    title="Cancel Order"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {newOrders.length === 0 && (
              <p className="text-center text-xs text-stone-400 py-6 italic font-medium">No new orders.</p>
            )}
          </div>
        </div>

        {/* Column 2: PREPARING */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-amber-50/50 p-3 rounded-2xl border border-amber-100/30">
            <span className="text-xs font-extrabold text-amber-700 tracking-wider uppercase">PREPARING</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {preparingOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-4 border border-stone-200/40 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-extrabold text-stone-900 block font-sans">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-[10px] text-stone-400 font-bold block">{order.studentName}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                    order.orderStatus === 'ACCEPTED' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>

                <p className="text-xs text-stone-600 font-medium bg-stone-50 p-2 rounded-xl">
                  {renderItemDetails(order.items)}
                </p>

                {order.orderStatus === 'ACCEPTED' ? (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'PREPARING')}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg text-[10px] transition-colors flex items-center justify-center space-x-1 shadow-sm shadow-amber-500/10 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Preparing</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'READY')}
                    className="w-full bg-stone-900 hover:bg-stone-850 text-white font-bold py-2 rounded-lg text-[10px] transition-colors flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Ready</span>
                  </button>
                )}
              </div>
            ))}
            {preparingOrders.length === 0 && (
              <p className="text-center text-xs text-stone-400 py-6 italic font-medium">None currently preparing.</p>
            )}
          </div>
        </div>

        {/* Column 3: READY */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/30">
            <span className="text-xs font-extrabold text-emerald-700 tracking-wider uppercase">READY</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {readyOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-4 border border-stone-200/40 shadow-sm space-y-3 border-l-4 border-l-emerald-500">
                <div>
                  <span className="text-sm font-extrabold text-stone-900 block font-sans">
                    Order #{order.orderNumber}
                  </span>
                  <span className="text-[10px] text-stone-450 font-bold block">{order.studentName} ({order.studentPhone})</span>
                </div>

                <p className="text-xs text-stone-600 font-medium bg-stone-50 p-2 rounded-xl">
                  {renderItemDetails(order.items)}
                </p>

                <button
                  onClick={() => handleUpdateStatus(order._id, 'COMPLETED')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-[10px] transition-colors flex items-center justify-center space-x-1 shadow-sm shadow-emerald-600/10 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Hand Over / Complete</span>
                </button>
              </div>
            ))}
            {readyOrders.length === 0 && (
              <p className="text-center text-xs text-stone-400 py-6 italic font-medium">No orders waiting pickup.</p>
            )}
          </div>
        </div>

        {/* Column 4: COMPLETED */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-stone-100 p-3 rounded-2xl border border-stone-250/20">
            <span className="text-xs font-extrabold text-stone-700 tracking-wider uppercase">COMPLETED</span>
            <span className="bg-stone-200 text-stone-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              {completedOrders.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 opacity-75">
            {completedOrders.map((order) => (
              <div key={order._id} className="bg-stone-50 rounded-2xl p-4 border border-stone-200/20 space-y-2">
                <div>
                  <span className="text-xs font-bold text-stone-750 block">
                    Order #{order.orderNumber}
                  </span>
                  <span className="text-[9px] text-stone-400 block">{order.studentName}</span>
                </div>
                <p className="text-[11px] text-stone-500 truncate">
                  {renderItemDetails(order.items)}
                </p>
                <div className="text-[9px] text-stone-400 font-medium">
                  Completed: {new Date(order.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            ))}
            {completedOrders.length === 0 && (
              <p className="text-center text-xs text-stone-400 py-6 italic font-medium">No orders completed today.</p>
            )}
          </div>
        </div>
      </div>

      {/* Menu Stock Management Section */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm mt-8 space-y-6">
        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-stone-900 font-sans">Menu Stock Management</h3>
            <p className="text-xs text-stone-500">Toggle dish availability or manage your menu in real-time.</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Search Input Bar */}
            <div className="relative w-44 sm:w-56">
              <input
                type="text"
                placeholder="Search stock..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-7 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-all duration-300 shadow-sm placeholder-stone-400 text-stone-850"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-405 hover:text-stone-700 text-[10px] font-extrabold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
            <span className="bg-stone-100 text-stone-850 text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-200/40">
              {menuItems.length} items
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-accent-orange hover:bg-accent-orange-dark text-white font-bold text-xs py-2 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5 mr-0.5" />
              <span>Add New Item</span>
            </button>
          </div>
        </div>

        {menuLoading ? (
          <div className="py-8 text-center">
            <div className="w-6 h-6 border-2 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-stone-500 text-xs mt-2">Loading menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMenuItems.map((item) => (
              <div
                key={item._id}
                className="bg-stone-50 hover:bg-stone-100/50 border border-stone-200/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-200"
              >
                <div className="min-w-0 pr-3">
                  <span className="text-xs font-bold text-stone-800 block truncate animate-fade-in" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium block uppercase tracking-wider mt-0.5">
                    {item.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleStock(item._id, item.isAvailable)}
                    className={`w-20 py-1.5 px-2.5 rounded-xl text-[9px] font-extrabold transition-all duration-200 shadow-sm cursor-pointer border text-center ${
                      item.isAvailable
                        ? 'bg-emerald-50 border-emerald-250/20 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-rose-50 border-rose-250/20 text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(item);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-250/20 rounded-xl transition-all duration-200 cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {filteredMenuItems.length === 0 && (
              <div className="col-span-full py-12 text-center bg-stone-50 border border-dashed border-stone-200/60 rounded-3xl space-y-2">
                <Utensils className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-stone-500 font-bold text-xs">No matching dishes found in your menu.</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[10px] font-bold text-accent-orange hover:underline cursor-pointer bg-white px-2.5 py-1 border border-stone-200 rounded-lg shadow-sm transition-all animate-fade-in"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add New Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-stone-200/50 w-full max-w-lg overflow-hidden flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-stone-900 font-sans">Add New Dish</h3>
                <p className="text-xs text-stone-500 mt-0.5">Enter details to add this dish to the menu.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-850 p-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddNewItem} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">Food Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kadai Chicken"
                  value={newItemData.name}
                  onChange={e => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange text-sm font-medium"
                />
              </div>

              {/* Veg / Non-Veg Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">Food Preference *</label>
                <select
                  value={newItemData.isVeg ? 'Veg' : 'Non-Veg'}
                  onChange={e => setNewItemData(prev => ({ ...prev, isVeg: e.target.value === 'Veg' }))}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange text-sm font-medium bg-white"
                >
                  <option value="Veg">Veg (Vegetarian)</option>
                  <option value="Non-Veg">Non-Veg (Non-Vegetarian)</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">Short Description</label>
                <textarea
                  placeholder="Briefly describe the dish ingredients or taste..."
                  value={newItemData.description}
                  onChange={e => setNewItemData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange text-sm font-medium resize-none"
                />
              </div>

              {/* Category selector / Custom category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">Category *</label>
                  <select
                    value={newItemData.category}
                    onChange={e => setNewItemData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange text-sm font-medium bg-white"
                  >
                    {defaultCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Custom">Custom / Other...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 150"
                    value={newItemData.price}
                    onChange={e => setNewItemData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange text-sm font-medium"
                  />
                </div>
              </div>

              {newItemData.category === 'Custom' && (
                <div className="space-y-1.5 animate-slide-down">
                  <label className="text-xs font-bold text-stone-700 block">Custom Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starters"
                    value={newItemData.customCategory}
                    onChange={e => setNewItemData(prev => ({ ...prev, customCategory: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange text-sm font-medium"
                  />
                </div>
              )}

              {/* Image Input (File Upload and URL) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">Dish Image</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-stone-200 hover:border-accent-orange hover:bg-stone-50 rounded-2xl p-4 transition-all duration-200 cursor-pointer">
                    <Upload className="w-5 h-5 text-stone-400 mb-1" />
                    <span className="text-xs text-stone-600 font-bold">Upload Local File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <div className="flex-1 flex items-center justify-center border border-stone-200 rounded-2xl p-3 bg-stone-50">
                    <input
                      type="text"
                      placeholder="Or paste image URL..."
                      value={newItemData.image.startsWith('data:') ? '' : newItemData.image}
                      onChange={e => setNewItemData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full bg-transparent border-none text-xs focus:outline-none font-medium placeholder-stone-400"
                    />
                  </div>
                </div>
                {newItemData.image && (
                  <div className="mt-2.5 p-2 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-between space-x-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={newItemData.image}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-xl border border-stone-200/50"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-stone-400 font-bold block">IMAGE PREVIEW</span>
                        <span className="text-xs text-stone-600 font-semibold truncate block">
                          {newItemData.image.startsWith('data:') ? 'Local Base64 Image File' : newItemData.image}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewItemData(prev => ({ ...prev, image: '' }))}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0"
                      title="Remove Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-750 font-bold py-3.5 rounded-2xl transition-colors text-sm cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-accent-orange hover:bg-accent-orange-dark text-white font-bold py-3.5 rounded-2xl transition-colors text-sm shadow-md shadow-accent-orange/15 cursor-pointer text-center disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-stone-200/50 w-full max-w-md overflow-hidden flex flex-col p-6 space-y-6 animate-scale-up">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-stone-900 font-sans">Delete Dish</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-stone-850">"{itemToDelete.name}"</span>?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                className="flex-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-750 font-bold py-3 rounded-xl transition-colors text-xs cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-colors text-xs shadow-md shadow-rose-600/10 cursor-pointer text-center"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
