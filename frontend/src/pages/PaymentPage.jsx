import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    // Already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        resolve(!!window.Razorpay);
      });

      existingScript.addEventListener('error', () => {
        resolve(false);
      });

      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');

    script.src =
      'https://checkout.razorpay.com/v1/checkout.js';

    script.async = true;

    script.onload = () => {
      resolve(!!window.Razorpay);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export default function PaymentPage() {
  const {
    cartItems,
    cartCafe,
    orderType,
    total,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [statusText, setStatusText] = useState(
    'Preparing secure payment...'
  );
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (cartItems.length === 0 || !cartCafe) {
      navigate('/cart', { replace: true });
      return;
    }

    const processPaymentFlow = async () => {
      try {
        setProcessing(true);
        setError('');

        // --------------------------------------------------
        // STEP 1: CREATE RAZORPAY ORDER ON BACKEND
        // --------------------------------------------------
        setStatusText('Creating secure payment session...');

        const resCreate = await API.post('/payments/create', {
          amount: total,
          cafeId: cartCafe._id,
        });

        if (!resCreate.data?.success) {
          throw new Error(
            resCreate.data?.message ||
            'Could not initiate payment session.'
          );
        }

        const {
          orderId,
          amount,
          currency,
          keyId,
        } = resCreate.data;

        if (!orderId || !keyId) {
          throw new Error(
            'Invalid payment session received from server.'
          );
        }

        // --------------------------------------------------
        // STEP 2: MAKE SURE RAZORPAY CHECKOUT IS AVAILABLE
        // --------------------------------------------------
        const razorpayLoaded = await loadRazorpay();

        if (!razorpayLoaded || !window.Razorpay) {
          throw new Error(
            'Unable to load Razorpay Checkout. Please check your internet connection and try again.'
          );
        }

        setStatusText('Opening secure payment gateway...');

        // --------------------------------------------------
        // STEP 3: RAZORPAY CHECKOUT OPTIONS
        // --------------------------------------------------
        const options = {
          key: keyId,

          amount: amount,

          currency: currency || 'INR',

          name: 'Campus Bites',

          description: `${cartCafe.name} Food Order`,

          order_id: orderId,

          prefill: {
            name: user.name || '',
            email: user.email || '',
            contact: user.phone || '',
          },

          notes: {
            cafe: cartCafe.name,
            orderType: orderType,
          },

          theme: {
            color: '#f97316',
          },

          modal: {
            ondismiss: () => {
              setProcessing(false);
              setError(
                'Payment was cancelled. Your order has not been placed.'
              );
            },
          },

          // ------------------------------------------------
          // STEP 4: PAYMENT SUCCESS
          // ------------------------------------------------
          handler: async (response) => {
            try {
              setProcessing(true);
              setError('');
              setStatusText(
                'Payment successful. Verifying transaction...'
              );

              // Send Razorpay payment details to backend.
              const resVerify = await API.post(
                '/payments/verify',
                {
                  razorpayOrderId:
                    response.razorpay_order_id,

                  razorpayPaymentId:
                    response.razorpay_payment_id,

                  razorpaySignature:
                    response.razorpay_signature,

                  cafeId: cartCafe._id,

                  items: cartItems.map((item) => ({
                    menuItemId: item.menuItemId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                  })),

                  orderType,
                }
              );

              if (!resVerify.data?.success) {
                throw new Error(
                  resVerify.data?.message ||
                  'Payment verification failed.'
                );
              }

              // ------------------------------------------------
              // STEP 5: ORDER CREATED
              // ------------------------------------------------
              setStatusText(
                'Order placed successfully! Redirecting...'
              );

              const createdOrder = resVerify.data.data;

              clearCart();

              setTimeout(() => {
                navigate(
                  `/order-receipt/${createdOrder._id}`,
                  { replace: true }
                );
              }, 800);
            } catch (err) {
              console.error(
                'Payment verification failure:',
                err
              );

              setProcessing(false);

              setError(
                err.response?.data?.message ||
                err.message ||
                'Payment verification failed. Please contact the café if money was deducted.'
              );
            }
          },
        };

        // --------------------------------------------------
        // STEP 6: OPEN RAZORPAY
        // --------------------------------------------------
        const razorpay = new window.Razorpay(options);

        razorpay.on(
          'payment.failed',
          (response) => {
            console.error(
              'Razorpay payment failed:',
              response
            );

            setProcessing(false);

            setError(
              response.error?.description ||
              'Payment failed. Your order has not been placed.'
            );
          }
        );

        razorpay.open();
      } catch (err) {
        console.error('Payment initialization failure:', err);

        setProcessing(false);

        setError(
          err.response?.data?.message ||
          err.message ||
          'Unable to start payment. Please try again.'
        );
      }
    };

    processPaymentFlow();
  }, [
    user,
    cartItems,
    cartCafe,
    orderType,
    total,
    navigate,
    clearCart,
  ]);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-stone-200/50 rounded-3xl shadow-sm p-8 text-center">

        {processing ? (
          <>
            {/* Spinner */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-stone-200 border-t-accent-orange animate-spin" />

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900 font-sans">
                Processing Payment
              </h3>

              <p className="text-sm text-stone-500 font-medium">
                {statusText}
              </p>
            </div>

            <div className="mt-6 text-[10px] text-stone-400 font-bold tracking-wider uppercase flex items-center justify-center space-x-1 border-t border-stone-100 pt-4">
              <ShieldCheck className="w-4 h-4 text-accent-green" />
              <span>Secure Razorpay Checkout</span>
            </div>
          </>
        ) : (
          <>
            {/* Error */}
            <div className="w-16 h-16 bg-accent-red-light/20 text-accent-red rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-950 font-sans">
                Payment Unsuccessful
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed px-4">
                {error}
              </p>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={handleRetry}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-sm cursor-pointer"
              >
                Try Again
              </button>

              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}