import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { User, Phone, Mail, ArrowLeft, ShieldCheck, MapPin, Box, Utensils } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartCafe, orderType, subtotal, parcelCharge, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if cart is empty or user is not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  const handlePayClick = async () => {
    if (!cartCafe) return;
    try {
      const res = await API.get(`/cafes/${cartCafe.slug}`);
      if (res.data.success && !res.data.data.isActive) {
        alert(`${cartCafe.name} Cafe is currently closed. You cannot complete payment.`);
        return;
      }
    } catch (err) {
      console.error('Error verifying cafe status:', err);
    }
    navigate('/payment');
  };

  if (!user || cartItems.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-4">
      {/* Header */}
      <div className="flex items-center space-x-3 text-stone-500 text-sm">
        <Link to="/cart" className="hover:text-stone-850 flex items-center font-bold">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Cart
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-extrabold text-stone-900 font-sans">Checkout</h2>
        <p className="text-sm text-stone-500 mt-1">Review details before initiating cashless payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Checkout Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cafe & Order type card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-900 font-sans border-b border-stone-100 pb-3">
              Order Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-stone-50 rounded-2xl p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-orange/10 text-accent-orange rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block">Café Location</span>
                  <span className="text-sm font-bold text-stone-850">{cartCafe?.name} Cafe</span>
                </div>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-orange/10 text-accent-orange rounded-xl flex items-center justify-center">
                  {orderType === 'Dine In' ? <Utensils className="w-5 h-5" /> : <Box className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block">Preference</span>
                  <span className="text-sm font-bold text-stone-850">{orderType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-900 font-sans border-b border-stone-100 pb-3">
              Student Details
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-center space-x-3.5 text-stone-700">
                <User className="w-5 h-5 text-stone-450" />
                <div className="text-sm">
                  <span className="text-stone-450 text-[10px] block font-medium">Full Name</span>
                  <span className="font-bold text-stone-800">{user.name}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3.5 text-stone-700">
                <Phone className="w-5 h-5 text-stone-450" />
                <div className="text-sm">
                  <span className="text-stone-450 text-[10px] block font-medium">Phone Number</span>
                  <span className="font-bold text-stone-800">{user.phone}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-stone-700">
                <Mail className="w-5 h-5 text-stone-450" />
                <div className="text-sm">
                  <span className="text-stone-450 text-[10px] block font-medium">Email Address</span>
                  <span className="font-bold text-stone-800">{user.email}</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 italic pt-2">
              Note: Staff will check these details to match your order number upon collection.
            </p>
          </div>

          {/* Item Review */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-900 font-sans border-b border-stone-100 pb-3">
              Review Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h3>
            <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.menuItemId} className="py-3 flex justify-between items-center text-sm">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-stone-900">{item.name}</span>
                    <span className="text-stone-450 font-bold ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-stone-850 font-sans">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Summary Side Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-stone-900 font-sans border-b border-stone-100 pb-3">
            Payment Summary
          </h3>

          <div className="space-y-3.5 text-sm text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900 font-sans">₹{subtotal}</span>
            </div>
            {orderType === 'Parcel' && parcelCharge > 0 && (
              <div className="flex justify-between">
                <span>Parcel Charges</span>
                <span className="font-semibold text-stone-900 font-sans">₹{parcelCharge}</span>
              </div>
            )}
            <div className="border-t border-stone-100 pt-3 flex justify-between text-lg font-extrabold text-stone-950">
              <span>Grand Total</span>
              <span className="font-sans text-accent-orange">₹{total}</span>
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/20 space-y-2">
            <div className="flex items-center text-xs font-bold text-stone-700 space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-accent-green" />
              <span>Payment Ready</span>
            </div>
            <p className="text-[10px] text-stone-500 leading-relaxed">
              This sandbox supports card and UPI mock simulations. Real funds will not be charged.
            </p>
          </div>

          <button
            onClick={handlePayClick}
            className="w-full bg-accent-orange hover:bg-accent-orange-dark text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-md shadow-accent-orange/15 text-sm cursor-pointer"
          >
            <span>Pay ₹{total}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
