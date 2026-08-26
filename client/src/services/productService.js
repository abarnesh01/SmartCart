import API from './api';

export const getProducts = async (params = {}) => {
  const response = await API.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await API.get('/products/featured');
  return response.data;
};

export const getTrendingProducts = async () => {
  const response = await API.get('/products/trending');
  return response.data;
};

export const getCategories = async () => {
  const response = await API.get('/categories');
  return response.data;
};

export const getBrands = async () => {
  const response = await API.get('/products/brands');
  return response.data;
};

export const getSimilarProducts = async (id) => {
  const response = await API.get(`/products/${id}/similar`);
  return response.data;
};
