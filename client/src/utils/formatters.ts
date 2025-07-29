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
 * Handles both single image strings and full URLs from ImageKit
 * @param imageName - The filename of the image or full URL
 * @returns Complete URL to the image or empty string if no image
 */
export const getImageUrl = (imageName?: string): string => {
  if (!imageName) return '';
  
  // If it's already a full URL (from ImageKit), return as is
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  
  // Get base URL without the /api suffix for image serving
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  return `${baseUrl}/uploads/${imageName}`;
};

/**
 * Get image URLs array from a product, handling both legacy and new formats
 * @param product - The product object
 * @returns Array of image URLs
 */
export const getProductImageUrls = (product: any): string[] => {
  // First try the computed virtual field from backend
  if (product.imageUrls && Array.isArray(product.imageUrls)) {
    return product.imageUrls.filter((url: string) => url); // Filter out null/undefined
  }
  
  // Try new images array
  if (product.images && Array.isArray(product.images)) {
    return product.images.map(getImageUrl).filter((url: string) => url);
  }
  
  // Fallback to legacy single image
  if (product.image) {
    return [getImageUrl(product.image)];
  }
  
  return [];
};