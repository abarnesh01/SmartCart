// @refresh reset
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem('smartcart_guest_cart');
    return localCart ? JSON.parse(localCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch server cart when user logs in
  useEffect(() => {
    const fetchServerCart = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const serverCart = await cartService.getCart();
          if (serverCart && serverCart.items) {
            const formattedItems = serverCart.items
              .filter((item) => item.product != null)
              .map((item) => ({
                product: item.product,
                quantity: item.quantity,
              }));
            setCartItems(formattedItems);
          }
        } catch (err) {
          console.error('[Cart Fetch Error]:', err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchServerCart();
  }, [isAuthenticated, user?._id]);

  // Persist guest cart in localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('smartcart_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const updatedCart = await cartService.addToCart(product._id, quantity);
        if (updatedCart && updatedCart.items) {
          const formatted = updatedCart.items
            .filter((i) => i.product != null)
            .map((i) => ({ product: i.product, quantity: i.quantity }));
          setCartItems(formatted);
        }
      } catch (err) {
        console.error('[Cart Add Error]:', err.message);
      }
    } else {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.product._id === product._id);
        if (existingIndex > -1) {
          const newItems = [...prevItems];
          newItems[existingIndex].quantity += quantity;
          return newItems;
        } else {
          return [...prevItems, { product, quantity }];
        }
      });
    }
    setIsCartOpen(true);
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (isAuthenticated) {
      try {
        const updatedCart = await cartService.updateCartItemQuantity(productId, quantity);
        if (updatedCart && updatedCart.items) {
          const formatted = updatedCart.items
            .filter((i) => i.product != null)
            .map((i) => ({ product: i.product, quantity: i.quantity }));
          setCartItems(formatted);
        }
      } catch (err) {
        console.error('[Cart Update Error]:', err.message);
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.product._id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const updatedCart = await cartService.removeFromCart(productId);
        if (updatedCart && updatedCart.items) {
          const formatted = updatedCart.items
            .filter((i) => i.product != null)
            .map((i) => ({ product: i.product, quantity: i.quantity }));
          setCartItems(formatted);
        }
      } catch (err) {
        console.error('[Cart Remove Error]:', err.message);
      }
    } else {
      setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error('[Cart Clear Error]:', err.message);
      }
    }
    setCartItems([]);
  };

  // Calculations
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const originalPrice = item.product.price || 0;
    return acc + originalPrice * item.quantity;
  }, 0);

  const discountTotal = cartItems.reduce((acc, item) => {
    const price = item.product.price || 0;
    const discount = item.product.discountPercentage || 0;
    const savings = price * (discount / 100);
    return acc + savings * item.quantity;
  }, 0);

  const cartTotal = subtotal - discountTotal;
  const shippingFee = cartTotal > 150 || cartItems.length === 0 ? 0 : 15.0;
  const estimatedTax = cartTotal * 0.08;
  const grandTotal = cartTotal + shippingFee + estimatedTax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        loading,
        itemCount,
        subtotal,
        discountTotal,
        cartTotal,
        shippingFee,
        estimatedTax,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
