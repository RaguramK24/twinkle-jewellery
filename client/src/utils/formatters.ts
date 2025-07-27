/**
 * Utility functions for formatting prices and constructing URLs
 */

/**
 * Format price in Indian Rupees using Intl.NumberFormat
 * @param price - The price amount to format
 * @returns Formatted price string (e.g., "₹12,345.00")
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Get the correct image URL for uploaded files
 * @param imageName - The filename of the image
 * @returns Complete URL to the image or empty string if no image
 */
export const getImageUrl = (imageName?: string): string => {
  if (!imageName) return '';
  
  // Get base URL without the /api suffix for image serving
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  return `${baseUrl}/uploads/${imageName}`;
};