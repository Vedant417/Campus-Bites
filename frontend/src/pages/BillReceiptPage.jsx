import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { ArrowRight, Printer, Home, CheckCircle2, Navigation } from 'lucide-react';

export default function BillReceiptPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching order receipt:', err);
        setError('Order receipt not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-10 h-10 border-4 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-500 mt-4 font-medium">Fetching your receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-4">
        <div className="text-accent-red font-bold text-lg">{error || 'Order not found.'}</div>
        <Link to="/home" className="inline-block bg-stone-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-stone-850">
          Back to Home
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-16 pt-4 print:p-0 print:m-0 print:max-w-full">
      {/* Top Banner (hidden in print) */}
      <div className="text-center space-y-3 print:hidden">
        <div className="w-16 h-16 bg-accent-green-light/20 text-accent-green rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-stone-900 font-sans">ORDER CONFIRMED 🎉</h2>
          <p className="text-sm text-stone-500 font-medium">
            Your payment was successful and the kitchen has received your order.
          </p>
        </div>
      </div>

      {/* Preparation Time Notice (hidden in print) */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-5 text-center space-y-1 shadow-md print:hidden">
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
          Estimated Preparation Time
        </span>
        <h4 className="text-2xl font-extrabold text-accent-orange font-sans">15–20 Mins</h4>
        <p className="text-xs text-stone-300">
          Please show receipt number <span className="font-bold text-white">#{order.orderNumber}</span> at the counter.
        </p>
      </div>

      {/* Bill Receipt Card (The printable part) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/50 shadow-premium relative overflow-hidden font-mono text-sm text-stone-800 print:shadow-none print:border-none print:p-0">
        {/* Receipt aesthetic decorations */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-orange via-amber-500 to-accent-orange" />

        <div className="text-center py-4 space-y-1 border-b border-dashed border-stone-200">
          <h3 className="text-lg font-bold text-stone-950 uppercase tracking-wider font-sans">
            COLLEGE CAFÉ
          </h3>
          <p className="text-xs text-stone-500 uppercase tracking-widest font-sans">
            {order.cafeId?.name || 'CAMPUS BITES'}
          </p>
          <div className="text-base font-extrabold text-stone-900 mt-2 bg-stone-100 py-1.5 px-4 rounded-xl inline-block font-sans">
            Order #{order.orderNumber}
          </div>
        </div>

        <div className="py-4 space-y-1.5 border-b border-dashed border-stone-200 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-400">Student Name:</span>
            <span className="font-semibold text-stone-800">{order.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Phone:</span>
            <span className="font-semibold text-stone-800">{order.studentPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Email:</span>
            <span className="font-semibold text-stone-800">{order.studentEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Order Preference:</span>
            <span className="font-semibold text-stone-800 uppercase">{order.orderType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Date:</span>
            <span className="font-semibold text-stone-800">{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Time:</span>
            <span className="font-semibold text-stone-800">{formattedTime}</span>
          </div>
        </div>

        {/* Item rows */}
        <div className="py-4 border-b border-dashed border-stone-200 space-y-2">
          <div className="flex justify-between text-xs text-stone-400 font-bold">
            <span>Item Details</span>
            <span>Subtotal</span>
          </div>
          {order.items.map((item) => (
            <div key={item.menuItemId} className="flex justify-between items-start text-xs">
              <div className="max-w-[80%]">
                <span>{item.name}</span>
                <span className="text-stone-400 ml-1">x{item.quantity}</span>
              </div>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="py-4 space-y-1.5 text-xs text-stone-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          {order.parcelCharge > 0 && (
            <div className="flex justify-between">
              <span>Parcel Charges</span>
              <span>₹{order.parcelCharge}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-extrabold text-stone-900 border-t border-dashed border-stone-200 pt-3">
            <span>TOTAL AMOUNT</span>
            <span className="text-accent-orange">₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-dashed border-stone-200 text-[10px] text-stone-400 space-y-0.5">
          <p className="font-bold text-stone-600 uppercase tracking-widest">Payment Status: PAID</p>
          <p>Thank you for dining with us!</p>
        </div>
      </div>

      {/* Actions (hidden in print) */}
      <div className="flex flex-col sm:flex-row gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 bg-stone-900 hover:bg-stone-850 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm text-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print/Download Bill</span>
        </button>

        <Link
          to={`/order-tracking/${order._id}`}
          className="flex-1 bg-accent-orange hover:bg-accent-orange-dark text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md shadow-accent-orange/15 text-sm"
        >
          <Navigation className="w-4 h-4" />
          <span>Track Order Status</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="text-center print:hidden">
        <Link
          to="/orders"
          className="inline-flex items-center space-x-1.5 text-stone-500 hover:text-stone-900 text-xs font-bold"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    </div>
  );
}
