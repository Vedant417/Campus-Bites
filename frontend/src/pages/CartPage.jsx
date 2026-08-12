import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Utensils, Box, Plus, Minus } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cartItems, cartCafe, orderType, setOrderType, updateQuantity, removeFromCart, subtotal, parcelCharge, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = async () => {
    if (!cartCafe) return;
    try {
      // Retrieve the latest cafe status from the server
      const res = await API.get(`/cafes/${cartCafe.slug}`);
      if (res.data.success && !res.data.data.isActive) {
        toast.error(`${cartCafe.name} Cafe is currently closed. You cannot proceed to checkout.`);
        return;
      }
    } catch (err) {
      console.error('Error verifying cafe status:', err);
    }

    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  // Polished empty state
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-6">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-stone-900 font-sans">Your Cart is Empty ☕</h2>
          <p className="text-stone-500 text-sm max-w-xs mx-auto">
            Your next delicious campus meal is just a few clicks away. Explore menus to start.
          </p>
        </div>
        <Link
          to="/home"
          className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-stone-850 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm shadow-md"
        >
          <span>Explore Cafés</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-4">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-stone-900 font-sans">Your Cart</h2>
        <p className="text-sm text-stone-500 mt-1">Review your selections from {cartCafe?.name} Cafe.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.menuItemId}
              className="bg-white rounded-3xl p-4 border border-stone-200/40 shadow-sm flex items-center justify-between"
            >
              {/* Image & details */}
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <div className="w-16 h-16 bg-stone-100 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 pr-2">
                  <h4 className="font-bold text-stone-900 truncate font-sans text-sm">{item.name}</h4>
                  <span className="text-[10px] text-stone-500 font-bold block mt-0.5">
                    ₹{item.price} each
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Quantity Adjust */}
                <div className="flex items-center space-x-2 bg-stone-100 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, -1)}
                    className="p-1 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold px-1 text-stone-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, 1)}
                    className="p-1 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="font-bold text-stone-950 text-sm min-w-[50px] text-right font-sans">
                  ₹{item.price * item.quantity}
                </span>

                {/* Delete Button */}
                <button
                  onClick={() => removeFromCart(item.menuItemId)}
                  className="p-2 text-stone-400 hover:text-accent-red hover:bg-accent-red-light/30 rounded-xl transition-colors cursor-pointer"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue button */}
          <Link
            to={`/cafe/${cartCafe?.slug}`}
            className="inline-flex items-center space-x-1.5 text-stone-500 hover:text-stone-900 font-bold text-sm pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add more items</span>
          </Link>
        </div>

        {/* Pricing Summary Side Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-stone-900 font-sans border-b border-stone-100 pb-3">
            Order Summary
          </h3>

          {/* Order Type Toggle (Optional edit here too) */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-450 tracking-wider">
              Selected Preference
            </span>
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/10">
              <button
                onClick={() => setOrderType('Dine In')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer ${
                  orderType === 'Dine In'
                    ? 'bg-accent-orange text-white shadow-md shadow-accent-orange/15'
                    : 'text-stone-500 hover:text-stone-850'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Dine In</span>
              </button>
              <button
                onClick={() => setOrderType('Parcel')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer ${
                  orderType === 'Parcel'
                    ? 'bg-accent-orange text-white shadow-md shadow-accent-orange/15'
                    : 'text-stone-500 hover:text-stone-850'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Parcel</span>
              </button>
            </div>
            <span className="text-[10px] text-stone-400 font-semibold block text-right pr-2">
              * Parcel contains extra charges
            </span>
          </div>

          <div className="space-y-3 text-sm text-stone-600">
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
            <div className="border-t border-stone-100 pt-3 flex justify-between text-base font-extrabold text-stone-950">
              <span>Total</span>
              <span className="font-sans">₹{total}</span>
            </div>
          </div>

          <button
            onClick={handleCheckoutClick}
            className="w-full bg-stone-900 hover:bg-stone-850 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-sm text-sm cursor-pointer"
          >
            <span>Proceed to Pay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
