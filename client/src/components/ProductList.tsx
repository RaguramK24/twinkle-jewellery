import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../types';
import { productService, categoryService } from '../services/api';
import { formatPrice, getProductImageUrls } from '../utils/formatters';
import ImageCarousel from './ImageCarousel';

// Mock data for demo (fallback when API is unavailable)
const mockCategories: Category[] = [
  { _id: 'cat1', name: 'Rings', description: 'Beautiful rings', createdAt: '', updatedAt: '' },
  { _id: 'cat2', name: 'Necklaces', description: 'Elegant necklaces', createdAt: '', updatedAt: '' },
  { _id: 'cat3', name: 'Earrings', description: 'Stunning earrings', createdAt: '', updatedAt: '' },
  { _id: 'cat4', name: 'Bracelets', description: 'Charming bracelets', createdAt: '', updatedAt: '' },
];

const mockProducts: Product[] = [
  {
    _id: 'prod1',
    name: 'Diamond Solitaire Ring',
    price: 25000,
    description: 'Beautiful diamond solitaire ring with 18k gold band. Perfect for engagements.',
    category: mockCategories[0],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'prod2',
    name: 'Gold Chain Necklace',
    price: 15000,
    description: 'Elegant 22k gold chain necklace for daily wear. Classic design.',
    category: mockCategories[1],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'prod3',
    name: 'Pearl Drop Earrings',
    price: 8000,
    description: 'Classic pearl drop earrings with sterling silver. Timeless elegance.',
    category: mockCategories[2],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'prod4',
    name: 'Rose Gold Bracelet',
    price: 12000,
    description: 'Delicate rose gold bracelet with heart charm. Perfect gift.',
    category: mockCategories[3],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'prod5',
    name: 'Vintage Engagement Ring',
    price: 35000,
    description: 'Stunning vintage-style engagement ring with intricate diamond details.',
    category: mockCategories[0],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'prod6',
    name: 'Silver Pendant Necklace',
    price: 5000,
    description: 'Beautiful silver pendant necklace with modern design.',
    category: mockCategories[1],
    createdAt: '',
    updatedAt: '',
  },
];

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      // Fallback to mock data for demo purposes
      console.warn('API unavailable, using mock data for demo');
      setProducts(mockProducts);
      setCategories(mockCategories);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category._id === selectedCategory;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="product-list">
        <div className="error">{error}</div>
        <button onClick={fetchData} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h1>Our Jewellery Collection</h1>
      
      {/* Filter and Search Controls */}
      <div className="product-filters">
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="product-search">Search Products:</label>
          <input
            id="product-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or description..."
            className="search-input"
          />
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="loading">
          {products.length === 0 
            ? "No products available yet. Check back soon!"
            : "No products match your search criteria."
          }
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const imageUrls = getProductImageUrls(product);
            return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="product-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ImageCarousel
                  images={imageUrls}
                  alt={product.name}
                  className="product-image"
                  showDots={imageUrls.length > 1}
                />
                
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <p className="product-category">{product.category.name}</p>
                  <p className="product-description">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;