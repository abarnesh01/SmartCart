export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateDiscountPrice = (price, discountPercentage) => {
  if (!discountPercentage || discountPercentage <= 0) return price;
  return Number((price * (1 - discountPercentage / 100)).toFixed(2));
};
