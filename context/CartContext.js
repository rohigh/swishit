'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const DEFAULT_CART_ITEM = {
  id: 'swishit-ocean-garden',
  title: 'Ocean Garden Hand Dishwash',
  variant: '500ml Glass-Look Bottle',
  price: 349,
  quantity: 1,
  image: '/img/blue-nobg.jpeg',
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('swishit_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
        } else {
          setCartItems([DEFAULT_CART_ITEM]);
        }
      } else {
        setCartItems([DEFAULT_CART_ITEM]);
      }
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
      setCartItems([DEFAULT_CART_ITEM]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync cart to LocalStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('swishit_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.error('Failed to save cart to storage:', e);
      }
    }
  }, [cartItems, isInitialized]);

  const addToCart = (newItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === newItem.id && item.variant === newItem.variant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity || 1;
        return updated;
      }
      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, variant) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && (variant ? item.variant === variant : true)))
    );
  };

  const updateQuantity = (id, variant, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id && (variant ? item.variant === variant : true)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('swishit_cart');
    } catch (e) {}
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartItems: [],
      cartCount: 0,
      cartSubtotal: 0,
      isCartOpen: false,
      setIsCartOpen: () => {},
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
    };
  }
  return context;
}
