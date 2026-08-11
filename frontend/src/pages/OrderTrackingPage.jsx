import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import StatusTimeline from '../components/StatusTimeline';
import { ArrowLeft, Clock, FileText, RefreshCw, MapPin } from 'lucide-react';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState('');

  const fetchOrderDetails = async (showSpinner = false) => {
    try {
      if (showSpinner) setLoading(true);
      const res = await API.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tracking status:', err);
      setError('Could not fetch tracking details.');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrderDetails(true);

    // Setup polling every 5 seconds
    const interval = setInterval(() => {
      setPolling(true);
      fetchOrderDetails(false).then(() => setPolling(false));
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-10 h-10 border-4 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-500 mt-4 font-medium">Loading tracking timeline...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-4">
        <div className="text-accent-red font-bold text-lg">{error || 'Order tracking not found.'}</div>
        <Link to="/orders" className="inline-block bg-stone-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-stone-850">
          My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/orders" className="hover:text-stone-850 flex items-center font-bold text-stone-500 text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
        <div className="flex items-center space-x-1.5 text-xs text-stone-400 font-bold bg-stone-100 py-1.5 px-3 rounded-full border border-stone-200/25">
          <RefreshCw className={`w-3.5 h-3.5 ${polling ? 'animate-spin' : ''}`} />
          <span>{polling ? 'Syncing...' : 'Live Polling'}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-stone-900 font-sans">Track Order</h2>
          <p className="text-sm text-stone-500 mt-1">Order Ref: #{order.orderNumber}</p>
        </div>
        <Link
          to={`/order-receipt/${order._id}`}
          className="inline-flex items-center space-x-1 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold text-xs py-2 px-4 rounded-xl shadow-sm self-start sm:self-auto transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Invoice Receipt</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Status Timeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/40 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-stone-900 font-sans border-b border-stone-150 pb-3">
            Cooking Progress
          </h3>
          <StatusTimeline status={order.orderStatus} />
        </div>

        {/* Right Side: Quick info details */}
        <div className="space-y-6">
          {/* Cafe & Prep details */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-stone-950 font-sans">
              Collection Info
            </h4>
            <div className="space-y-3.5">
              <div className="flex items-start space-x-3 text-stone-700">
                <MapPin className="w-4 h-4 text-accent-orange mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold block">{order.cafeId?.name} Cafe</span>
                  <span className="text-stone-450">Special Block, Ground Floor</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-stone-700">
                <Clock className="w-4 h-4 text-accent-orange mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold block">Estimated Prep Time</span>
                  <span className="text-stone-450">15–20 Mins from placing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary of items */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-stone-950 font-sans">
              Summary
            </h4>
            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.menuItemId} className="py-2.5 flex justify-between text-xs text-stone-700">
                  <div className="truncate max-w-[70%]">
                    <span className="font-semibold text-stone-800">{item.name}</span>
                    <span className="text-stone-400 ml-1.5 font-bold">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-stone-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-stone-200 pt-3 flex justify-between text-sm font-bold text-stone-950">
              <span>Total Paid</span>
              <span className="text-accent-orange">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
