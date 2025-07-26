import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/api';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await productService.getById(productId);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch product details. Please try again later.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageName?: string): string => {
    if (!imageName) return '';
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imageName}`;
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="product-list">
        <div className="error">{error || 'Product not found'}</div>
        <Link to="/" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        ← Back to Products
      </Link>
      
      <div className="product-detail">
        {product.image ? (
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="product-detail-image"
          />
        ) : (
          <div className="product-detail-placeholder">
            No Image Available
          </div>
        )}
        
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-category">
            Category: {product.category.name}
          </p>
          <p className="product-detail-description">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;