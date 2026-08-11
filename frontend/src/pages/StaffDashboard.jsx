import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Package, Check, Play, AlertCircle, RefreshCw, Box, Utensils, XCircle } from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

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
      }
    } catch (err) {
      console.error('Error toggling menu item status:', err);
      alert('Failed to update stock status.');
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
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update status. Please try again.');
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
            <p className="text-xs text-stone-500">Toggle dish availability to update student views in real-time.</p>
          </div>
          <span className="bg-stone-100 text-stone-850 text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-200/40">
            {menuItems.length} items
          </span>
        </div>

        {menuLoading ? (
          <div className="py-8 text-center">
            <div className="w-6 h-6 border-2 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-stone-500 text-xs mt-2">Loading menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-stone-50 hover:bg-stone-100/50 border border-stone-200/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-200"
              >
                <div className="min-w-0 pr-3">
                  <span className="text-xs font-bold text-stone-800 block truncate" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium block uppercase tracking-wider mt-0.5">
                    {item.category}
                  </span>
                </div>
                
                <button
                  onClick={() => handleToggleStock(item._id, item.isAvailable)}
                  className={`w-24 py-1.5 px-3 rounded-full text-[10px] font-extrabold transition-all duration-200 shadow-sm cursor-pointer border text-center ${
                    item.isAvailable
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                      : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                  }`}
                >
                  {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
