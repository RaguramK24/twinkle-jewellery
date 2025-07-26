// Placeholder component for individual jewelry item card
import React from 'react';

const JewelryCard = ({ jewelry }) => {
  return (
    <div className="jewelry-card">
      <div className="jewelry-image">
        {/* TODO: Add image display logic */}
        <img 
          src={jewelry?.images?.[0] || '/placeholder-jewelry.jpg'} 
          alt={jewelry?.name || 'Jewelry item'} 
        />
      </div>
      <div className="jewelry-info">
        <h3>{jewelry?.name || 'Jewelry Item'}</h3>
        <p className="jewelry-price">
          ${jewelry?.price || '0.00'}
        </p>
        <p className="jewelry-category">
          {jewelry?.category || 'Category'}
        </p>
        <p className="jewelry-material">
          Material: {jewelry?.material || 'Not specified'}
        </p>
        {/* TODO: Add to cart functionality */}
        <button className="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default JewelryCard;