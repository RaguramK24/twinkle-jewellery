// Placeholder component for jewelry catalog header
import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>✨ Twinkle Jewellery</h1>
        </div>
        <nav className="navigation">
          {/* TODO: Add navigation menu items */}
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/catalog">Catalog</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;