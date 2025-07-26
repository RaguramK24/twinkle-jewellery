// Placeholder page component for the home/landing page
import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Twinkle Jewellery</h1>
          <p>Discover our exquisite collection of fine jewelry</p>
          {/* TODO: Add hero image and call-to-action buttons */}
          <div className="hero-actions">
            <button className="btn-primary">Shop Now</button>
            <button className="btn-secondary">View Collection</button>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Collections</h2>
        {/* TODO: Add featured jewelry items */}
        <div className="featured-items">
          <p>Featured jewelry items will be displayed here</p>
        </div>
      </section>

      <section className="categories-section">
        <h2>Shop by Category</h2>
        {/* TODO: Add category navigation */}
        <div className="category-grid">
          <div className="category-item">Rings</div>
          <div className="category-item">Necklaces</div>
          <div className="category-item">Earrings</div>
          <div className="category-item">Bracelets</div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;