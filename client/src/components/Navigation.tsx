import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navigation" role="navigation" aria-label="Main navigation">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <div className="nav-container">
        <Link to="/" className="nav-logo" aria-label="Twinkle Jewellery - Go to homepage">
          {/* 
            TODO: REPLACE THIS PLACEHOLDER LOGO WITH YOUR ACTUAL LOGO
            
            Current: Using emoji and text as placeholder
            Replace with: <img src="/logo.png" alt="Twinkle Jewellery Logo" className="nav-logo-image" />
            
            Recommended logo specifications:
            - Format: PNG or SVG for best quality
            - Size: 150x50px (or similar 3:1 aspect ratio)
            - Background: Transparent
            - Colors: Gold (#d4af37) and white/dark text
            - Include both icon and text for brand recognition
            
            After adding logo image:
            1. Add logo file to /client/public/ folder
            2. Replace the content below with <img> tag
            3. Remove this comment block
            4. Update the nav-logo CSS class to accommodate image sizing
          */}
          Twinkle Jewellery
        </Link>
        
        <ul className="nav-links" role="menubar">
          <li role="none">
            <Link to="/" role="menuitem" aria-label="View all products">
              Products
            </Link>
          </li>
          <li role="none">
            <Link to="/contact" role="menuitem" aria-label="Contact customer support">
              Contact Support
            </Link>
          </li>
          {user?.isAdmin && (
            <>
              <li role="none">
                <Link to="/admin" role="menuitem" aria-label="Admin panel">
                  Admin Panel
                </Link>
              </li>
              <li role="none">
                <Link to="/messages" role="menuitem" aria-label="View customer messages">
                  Messages
                </Link>
              </li>
            </>
          )}
        </ul>
        
        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <span aria-label="Current user">Welcome, Admin</span>
              <button 
                onClick={handleLogout} 
                className="btn btn-small btn-secondary"
                aria-label="Log out of admin account"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-primary"
              aria-label="Log in to admin account"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;