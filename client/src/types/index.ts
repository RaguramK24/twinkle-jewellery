export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  // Support both legacy single image and new multiple images
  image?: string; // Legacy field for backward compatibility
  images?: string[]; // New field for multiple images
  imageUrls?: string[]; // Virtual field computed by backend
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  description: string;
  category: string;
  images?: FileList | File[]; // Support multiple files
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}