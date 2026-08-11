import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Home, ShoppingBag, History, User, ChefHat, LayoutDashboard } from 'lucide-react';

export default function MobileNav() {
  const { isAuthenticated, isStaff, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // If staff, render a staff-specific navigation
  if (isStaff) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-lg px-6 py-2 flex justify-around items-center h-16">
        <NavLink
          to="/staff"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-0.5 text-xs font-medium transition-colors ${
              isActive ? 'text-accent-orange font-semibold' : 'text-stone-500'
            }`
          }
        >
          <ChefHat className="w-5.5 h-5.5" />
          <span>Kitchen</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-0.5 text-xs font-medium transition-colors ${
              isActive ? 'text-accent-orange font-semibold' : 'text-stone-500'
            }`
          }
        >
          <User className="w-5.5 h-5.5" />
          <span>Profile</span>
        </NavLink>
      </div>
    );
  }

  // If admin, render admin navigation
  if (isAdmin) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-lg px-6 py-2 flex justify-around items-center h-16">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-0.5 text-xs font-medium transition-colors ${
              isActive ? 'text-accent-orange font-semibold' : 'text-stone-500'
            }`
          }
        >
          <Home className="w-5.5 h-5.5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-0.5 text-xs font-medium transition-colors ${
              isActive ? 'text-accent-orange font-semibold' : 'text-stone-500'
            }`
          }
        >
          <LayoutDashboard className="w-5.5 h-5.5" />
          <span>Admin</span>
        </NavLink>
      </div>
    );
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/60 shadow-lg px-4 py-2 flex justify-around items-center h-16 pb-safe">
      <NavLink
        to={isAuthenticated ? "/home" : "/"}
        className={({ isActive }) =>
          `flex flex-col items-center space-y-0.5 text-[10px] font-medium transition-colors ${
            isActive ? 'text-accent-orange font-semibold' : 'text-stone-500'
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      {isAuthenticated && (
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-0.5 text-[10px] font-medium relative transition-colors ${
              isActive ? 'text-accent-orange font-semibold' : 'text-stone-500'
            }`
          }
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-accent-orange text-white text-[8px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span>Cart</span>
        </NavLink>
      )}

      {isAuthenticated && (
        <>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-accent-orange font-semibold' : 'text-stone-500'
              }`
            }
          >
            <History className="w-5 h-5" />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-accent-orange font-semibold' : 'text-stone-500'
              }`
            }
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
        </>
      )}

      {!isAuthenticated && (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-0.5 text-[10px] font-medium transition-colors ${
              isActive ? 'text-accent-orange font-semibold' : 'text-stone-500'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Sign In</span>
        </NavLink>
      )}
    </div>
  );
}
