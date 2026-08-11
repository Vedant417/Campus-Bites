import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, LogOut, User as UserIcon, ChefHat, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, isStaff, isAdmin } = useAuth();
  const { cartItems, total } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel shadow-sm border-b border-stone-200/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand - Non-clickable but hoverable */}
        <div
          className="
    flex items-center
    cursor-default
    group
    transition-all duration-200 ease-out
    hover:scale-[1.02]
    hover:opacity-90
  "
        >
          {/* CB Logo */}
          <div
            className="
      w-10 h-10
      bg-accent-orange
      rounded-xl
      flex items-center justify-center
      text-white
      font-extrabold text-lg
      shadow-sm
      transition-all duration-200 ease-out
      group-hover:shadow-md
      group-hover:-translate-y-0.5
    "
          >
            CB
          </div>

          {/* Brand Text */}
          <div className="ml-2">
            <div
              className="
    text-xl
    font-extrabold
    tracking-tight
    text-stone-900
  "
            >
              CAMPUS<span className="text-accent-orange">BITES</span>
            </div>

            <div
              className="
        text-[10px]
        font-semibold
        tracking-wider
        text-stone-500
        uppercase
        transition-colors duration-200
        group-hover:text-stone-700
      "
            >
              Eat. Order. Skip the Queue.
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4">
          {/* Main platform routes */}
          <div className="hidden md:flex items-center space-x-3 text-sm font-medium text-stone-600 mr-2">
            {!isStaff && !isAdmin && (
              <Link
                to={isAuthenticated ? "/home" : "/"}
                className={`${!isAuthenticated
                  ? 'flex items-center h-10'
                  : 'flex items-center h-10 translate-y'
                  } transition-all duration-200 ${location.pathname === '/' || location.pathname === '/home'
                    ? 'text-accent-orange font-bold'
                    : 'text-stone-600 hover:text-stone-900 font-medium border-transparent'
                  }`}
              >
                Home
              </Link>
            )}
            {isAuthenticated && !isStaff && !isAdmin && (
              <Link
                to="/orders"
                className={`flex items-center h-10 border-b-2 pb-0.5 translate-y-[2px] transition-all duration-200 ${location.pathname === '/orders'
                  ? 'text-accent-orange font-bold border-accent-orange'
                  : 'text-stone-600 hover:text-stone-900 font-medium border-transparent'
                  }`}
              >
                My Orders
              </Link>
            )}
            {isStaff && (
              <Link
                to="/staff"
                className={`flex items-center transition-colors px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${location.pathname === '/staff'
                  ? 'bg-accent-orange text-white'
                  : 'text-stone-700 hover:text-accent-orange bg-cream-200 hover:bg-cream-300'
                  }`}
              >
                <ChefHat className="w-3.5 h-3.5 mr-1" />
                Staff Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center transition-colors px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${location.pathname === '/admin'
                  ? 'bg-accent-orange text-white'
                  : 'text-stone-700 hover:text-accent-orange bg-cream-200 hover:bg-cream-300'
                  }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
                Admin Panel
              </Link>
            )}
            {isAuthenticated && !isAdmin && (
              <Link
                to="/profile"
                className={
                  isStaff
                    ? `flex items-center px-3 py-1.5 rounded-lg leading-none text-sm font-medium transition-all duration-200 ${location.pathname === '/profile'
                      ? 'bg-accent-orange text-white'
                      : 'text-stone-700 hover:text-accent-orange bg-cream-200 hover:bg-cream-300'
                    }`
                    : `flex items-center h-10 border-b-2 pb-0.5 translate-y-[2px] transition-all duration-200 ${location.pathname === '/profile'
                      ? 'text-accent-orange font-bold border-accent-orange'
                      : 'text-stone-600 hover:text-stone-900 font-medium border-transparent'
                    }`
                }
              >
                Profile
              </Link>
            )}
          </div>

          {/* User state and Cart */}
          <div className="flex items-center space-x-3">
            {/* Cart Badge - Student Only */}
            {isAuthenticated && !isStaff && !isAdmin && (
              <Link
                to="/cart"
                className={`relative p-2 rounded-xl transition-all duration-200 flex items-center cursor-pointer ${location.pathname === '/cart'
                  ? 'text-accent-orange bg-accent-orange/10 border border-accent-orange/20'
                  : 'text-stone-600 hover:text-accent-orange hover:bg-stone-100'
                  }`}
                aria-label="View Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-accent-orange text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse-subtle">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div
                  className="hidden sm:flex items-center space-x-2 bg-stone-100/80 px-3 py-1.5 rounded-xl border border-stone-200/40 text-stone-800 text-sm font-medium"
                >
                  <UserIcon className="w-4 h-4 text-stone-500" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="p-2 text-stone-500 hover:text-accent-red hover:bg-accent-red-light/30 rounded-xl transition-colors duration-200 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  to="/login"
                  className={`h-10 flex items-center justify-center text-xs sm:text-sm font-bold px-4 rounded-xl transition-all duration-200 cursor-pointer ${location.pathname === '/login'
                    ? 'text-accent-orange border-2 border-accent-orange bg-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border-2 border-transparent'
                    }`}
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className={`h-10 flex items-center justify-center text-xs sm:text-sm font-bold px-4 rounded-xl transition-all duration-200 cursor-pointer ${location.pathname === '/register'
                    ? 'bg-stone-900 text-white border-2 border-accent-orange'
                    : 'bg-stone-900 text-white hover:bg-stone-800 border-2 border-transparent'
                    }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
