import API from './api';

export const getRecommendations = async () => {
  const response = await API.get('/recommendations');
  return response.data;
};

export const trackRecommendationClick = async (productId) => {
  try {
    await API.post('/recommendations/click', { productId });
  } catch (e) {
    // Non-blocking log
  }
};
