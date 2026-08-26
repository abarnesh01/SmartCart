import API from './api';

export const getCart = async () => {
  const response = await API.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await API.post('/cart', { productId, quantity });
  return response.data;
};

export const updateCartItemQuantity = async (productId, quantity) => {
  const response = await API.put(`/cart/${productId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await API.delete(`/cart/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await API.delete('/cart');
  return response.data;
};
