import API from './api';

export const getWishlist = async () => {
  const response = await API.get('/wishlist');
  return response.data;
};

export const toggleWishlistItem = async (productId) => {
  const response = await API.post('/wishlist', { productId });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await API.delete(`/wishlist/${productId}`);
  return response.data;
};
