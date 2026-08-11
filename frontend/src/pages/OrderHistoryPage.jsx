import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { OrderCardSkeleton } from '../components/SkeletonLoader';
import { ShoppingBag, ArrowRight, Calendar, Tag, ArrowLeft } from 'lucide-react';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Could not retrieve order history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PLACED':
        return 'bg-blue-50 text-blue-700 border-blue-200/50';
      case 'ACCEPTED':
        return 'bg-purple-50 text-purple-700 border-purple-200/50';
      case 'PREPARING':
        return 'bg-amber-50 text-amber-700 border-amber-200/50';
      case 'READY':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/50 animate-pulse';
      case 'COMPLETED':
        return 'bg-stone-100 text-stone-650 border-stone-200/40';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200/50';
      default:
        return 'bg-stone-50 text-stone-600 border-stone-200/30';
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-16 pt-4">
        <div>
          <h2 className="text-3xl font-extrabold text-stone-900 font-sans">My Orders</h2>
          <p className="text-sm text-stone-500 mt-1">Check current status and invoices of your campus food orders.</p>
        </div>
        <div className="space-y-5">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      </div>
    );
  }

  // Polished empty state
  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-16 pt-4">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-extrabold text-stone-900 font-sans">My Orders</h2>
          <p className="text-sm text-stone-500 mt-1">Check current status and invoices of your campus food orders.</p>
        </div>

        <div className="max-w-md mx-auto text-center py-12 px-4 space-y-6 bg-white border border-stone-200/40 rounded-3xl p-8 shadow-sm">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-stone-900 font-sans">No orders yet ☕</h3>
            <p className="text-sm text-stone-500 max-w-xs mx-auto">
              You haven't ordered anything yet. Your next delicious campus meal is waiting.
            </p>
          </div>
          <Link
            to="/home"
            className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-stone-850 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 text-xs shadow-md cursor-pointer"
          >
            <span>Explore Cafés</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16 pt-4">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-stone-900 font-sans">My Orders</h2>
        <p className="text-sm text-stone-500 mt-1">Check current status and invoices of your campus food orders.</p>
      </div>

      {error && (
        <div className="bg-accent-red-light/20 border border-accent-red/20 text-accent-red p-4 rounded-2xl text-center text-sm">
          {error}
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-5">
        {orders.map((order) => {
          const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm hover:shadow-premium hover:border-stone-250/50 transition-all duration-200 space-y-3"
            >
              {/* Top Row: Cafe Name & Status */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-stone-900 font-sans text-base">
                    {order.cafeId?.name || 'Campus Cafe'}
                  </h4>
                  <span className="text-[10px] text-stone-450 font-bold block mt-0.5">
                    Order Ref: #{order.orderNumber}
                  </span>
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full border ${getStatusStyle(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>

              {/* Items Summary & Date */}
              <div className="flex justify-between items-center text-xs text-stone-550 border-t border-stone-100 pt-3">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {dateStr}
                  </span>
                  <span className="w-1 h-1 bg-stone-300 rounded-full" />
                  <span className="flex items-center">
                    <Tag className="w-3.5 h-3.5 mr-1" />
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                  </span>
                </div>
                <span className="font-extrabold text-stone-950 font-sans text-sm">
                  ₹{order.totalAmount}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Link
                  to={`/order-receipt/${order._id}`}
                  className="flex-1 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold py-2.5 rounded-xl transition-all duration-200 text-center text-xs border border-stone-200/35"
                >
                  View Details
                </Link>

                {/* Show Track button if order is not completed/cancelled */}
                {['PLACED', 'ACCEPTED', 'PREPARING', 'READY'].includes(order.orderStatus) && (
                  <Link
                    to={`/order-tracking/${order._id}`}
                    className="flex-1 bg-accent-orange hover:bg-accent-orange-dark text-white font-bold py-2.5 rounded-xl transition-all duration-200 text-center text-xs shadow-md shadow-accent-orange/10"
                  >
                    Track Live Status
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
