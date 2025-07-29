import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/api';
import { formatPrice, getProductImageUrls } from '../utils/formatters';
import ImageCarousel from './ImageCarousel';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="product-list">
        <div className="error">{error}</div>
        <button onClick={fetchProducts} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h1>Our Jewellery Collection</h1>
      
      {products.length === 0 ? (
        <div className="loading">
          No products available yet. Check back soon!
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => {
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