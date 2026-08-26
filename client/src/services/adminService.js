import API from './api';

export const getDashboardStats = async () => {
  const response = await API.get('/admin/dashboard');
  return response.data;
};

export const getUsers = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await API.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await API.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await API.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await API.get('/admin/orders');
  return response.data;
};

export const getAllReviews = async () => {
  const response = await API.get('/admin/reviews');
  return response.data;
};

export const getAnalytics = async () => {
  const response = await API.get('/analytics');
  return response.data;
};
