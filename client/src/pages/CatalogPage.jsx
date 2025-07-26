// Placeholder page component for the jewelry catalog
import React, { useState, useEffect } from 'react';

const CatalogPage = () => {
  const [jewelry, setJewelry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    material: '',
    priceRange: ''
  });

  useEffect(() => {
    // TODO: Fetch jewelry data from API
    setLoading(true);
    // Placeholder for API call
    setTimeout(() => {
      setJewelry([]);
      setLoading(false);
    }, 1000);
  }, [filters]);

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1>Jewelry Catalog</h1>
        <p>Browse our complete collection</p>
      </div>

      <div className="catalog-content">
        <aside className="catalog-filters">
          <h3>Filter by:</h3>
          
          {/* TODO: Add filter components */}
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={filters.category} 
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="rings">Rings</option>
              <option value="necklaces">Necklaces</option>
              <option value="earrings">Earrings</option>
              <option value="bracelets">Bracelets</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Material:</label>
            <select 
              value={filters.material} 
              onChange={(e) => setFilters({...filters, material: e.target.value})}
            >
              <option value="">All Materials</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="platinum">Platinum</option>
              <option value="diamond">Diamond</option>
            </select>
          </div>
        </aside>

        <main className="catalog-items">
          {loading ? (
            <div className="loading">Loading jewelry items...</div>
          ) : (
            <div className="jewelry-grid">
              {jewelry.length === 0 ? (
                <p>No jewelry items found. Items will be displayed here once added.</p>
              ) : (
                jewelry.map(item => (
                  <div key={item.id} className="jewelry-item">
                    {/* TODO: Use JewelryCard component */}
                    <p>{item.name}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;