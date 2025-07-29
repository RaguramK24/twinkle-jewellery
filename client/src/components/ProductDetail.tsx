import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/api';
import { formatPrice, getProductImageUrls } from '../utils/formatters';
import ImageCarousel from './ImageCarousel';

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
      
      // Update document title and meta tags for better social sharing
      if (data) {
        document.title = `${data.name} - ${formatPrice(data.price)} | Twinkle Jewellery`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', 
            `${data.description} - Premium ${data.category.name.toLowerCase()} priced at ${formatPrice(data.price)}. Shop exclusive jewelry at Twinkle Jewellery.`
          );
        }
        
        // Update Open Graph tags for social sharing
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', `${data.name} - ${formatPrice(data.price)} | Twinkle Jewellery`);
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', 
            `${data.description} - Premium ${data.category.name.toLowerCase()} priced at ${formatPrice(data.price)}.`
          );
        }
        
        // Update Twitter Card tags
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle) {
          twitterTitle.setAttribute('content', `${data.name} - ${formatPrice(data.price)}`);
        }
        
        const twitterDescription = document.querySelector('meta[property="twitter:description"]');
        if (twitterDescription) {
          twitterDescription.setAttribute('content', 
            `${data.description} - Premium ${data.category.name.toLowerCase()} priced at ${formatPrice(data.price)}.`
          );
        }
      }
    } catch (err) {
      setError('Failed to fetch product details. Please try again later.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset page title when component unmounts
  useEffect(() => {
    return () => {
      document.title = 'Twinkle Jewellery - Exquisite Diamond & Gold Jewelry Collection';
    };
  }, []);

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
      <Link 
        to="/" 
        className="btn btn-secondary" 
        style={{ marginBottom: '2rem' }}
        aria-label="Go back to product listing"
      >
        ← Back to Products
      </Link>
      
      <article className="product-detail" itemScope itemType="https://schema.org/Product">
        <ImageCarousel
          images={getProductImageUrls(product)}
          alt={product.name}
          className="product-detail-image"
          showControls={true}
          showDots={true}
        />
        
        <div className="product-detail-info">
          <h1 className="product-detail-name" itemProp="name">{product.name}</h1>
          <p className="product-detail-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <span itemProp="priceCurrency" content="INR"></span>
            <span itemProp="price" content={product.price.toString()}>{formatPrice(product.price)}</span>
          </p>
          <p className="product-detail-category">
            Category: <span itemProp="category">{product.category.name}</span>
          </p>
          <p className="product-detail-description" itemProp="description">{product.description}</p>
          
          {/* Hidden structured data for better SEO */}
          <div style={{ display: 'none' }}>
            <span itemProp="brand" itemScope itemType="https://schema.org/Brand">
              <span itemProp="name">Twinkle Jewellery</span>
            </span>
            <span itemProp="availability" content="https://schema.org/InStock">In Stock</span>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ProductDetail;