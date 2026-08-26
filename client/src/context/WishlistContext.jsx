// @refresh reset
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import * as wishlistService from '../services/wishlistService';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState(() => {
    const local = localStorage.getItem('smartcart_guest_wishlist');
    return local ? JSON.parse(local) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const res = await wishlistService.getWishlist();
          if (res && res.products) {
            setWishlistItems(res.products.filter((p) => p != null));
          }
        } catch (err) {
          console.error('[Wishlist Fetch Error]:', err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchWishlist();
  }, [isAuthenticated, user?._id]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('smartcart_guest_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product;
    const exists = wishlistItems.some((item) => (item._id || item) === productId);

    if (isAuthenticated) {
      try {
        const res = await wishlistService.toggleWishlistItem(productId);
        if (res && res.wishlist && res.wishlist.products) {
          setWishlistItems(res.wishlist.products.filter((p) => p != null));
        }
        return res.isAdded;
      } catch (err) {
        console.error('[Wishlist Toggle Error]:', err.message);
      }
    } else {
      if (exists) {
        setWishlistItems((prev) => prev.filter((item) => (item._id || item) !== productId));
        return false;
      } else {
        setWishlistItems((prev) => [...prev, product]);
        return true;
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item) === productId);
  };

  const moveToCart = async (product) => {
    await addToCart(product, 1);
    await toggleWishlist(product);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        wishlistCount: wishlistItems.length,
        toggleWishlist,
        isInWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
