import React, { createContext, useState, useEffect, useContext } from 'react';

const PARCEL_CHARGES = {
  'mayuri-special-block': 10,
  'mayuri': 10,
  'ab-dakshin': 5,
  'bistro': 15,
  'underbelly': 10
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedItems = localStorage.getItem('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [cartCafe, setCartCafe] = useState(() => {
    const savedCafe = localStorage.getItem('cartCafe');
    return savedCafe ? JSON.parse(savedCafe) : null;
  });

  const [orderType, setOrderType] = useState(() => {
    return localStorage.getItem('orderType') || 'Dine In';
  });

  // For multi-cafe order warnings
  const [conflict, setConflict] = useState(null); // { pendingItem, pendingCafe }

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    if (cartCafe) {
      localStorage.setItem('cartCafe', JSON.stringify(cartCafe));
    } else {
      localStorage.removeItem('cartCafe');
    }
  }, [cartItems, cartCafe]);

  useEffect(() => {
    localStorage.setItem('orderType', orderType);
  }, [orderType]);

  // Add item to cart
  const addToCart = (item, cafe) => {
    // Check if cart contains items from another cafe
    if (cartCafe && cartItems.length > 0 && String(cartCafe._id) !== String(cafe._id)) {
      setConflict({ pendingItem: item, pendingCafe: cafe });
      return false; // Indicates conflict
    }

    setCartCafe(cafe);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.menuItemId === item._id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.menuItemId === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, {
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        isVeg: item.isVeg,
      }];
    });
    return true; // Added successfully
  };

  // Resolve multi-cafe conflicts
  const handleResolveConflict = (proceed) => {
    if (proceed && conflict) {
      // Clear cart and add the new cafe item
      const { pendingItem, pendingCafe } = conflict;
      setCartCafe(pendingCafe);
      setCartItems([{
        menuItemId: pendingItem._id,
        name: pendingItem.name,
        price: pendingItem.price,
        quantity: 1,
        image: pendingItem.image,
        isVeg: pendingItem.isVeg,
      }]);
    }
    setConflict(null);
  };

  // Change quantity of item
  const updateQuantity = (menuItemId, change) => {
    setCartItems((prevItems) => {
      const updated = prevItems.map((item) => {
        if (item.menuItemId === menuItemId) {
          const newQty = item.quantity + change;
          return { ...item, quantity: newQty };
        }
        return item;
      });
      // Filter out items with 0 or negative quantities
      const filtered = updated.filter((item) => item.quantity > 0);
      if (filtered.length === 0) {
        setCartCafe(null);
      }
      return filtered;
    });
  };

  // Remove single item from cart
  const removeFromCart = (menuItemId) => {
    setCartItems((prevItems) => {
      const filtered = prevItems.filter((item) => item.menuItemId !== menuItemId);
      if (filtered.length === 0) {
        setCartCafe(null);
      }
      return filtered;
    });
  };

  // Clear all cart items
  const clearCart = () => {
    setCartItems([]);
    setCartCafe(null);
  };

  // Calculate prices
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const parcelCharge = orderType === 'Parcel' && cartCafe && cartCafe.slug ? (PARCEL_CHARGES[cartCafe.slug] || 0) : 0;
  const tax = 0; // Removed GST
  const total = subtotal + parcelCharge;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCafe,
        orderType,
        setOrderType,
        conflict,
        setConflict,
        resolveConflict: handleResolveConflict,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        parcelCharge,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
