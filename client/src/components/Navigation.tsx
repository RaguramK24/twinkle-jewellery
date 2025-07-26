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
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ✨ Twinkle Jewellery
        </Link>
        
        <ul className="nav-links">
          <li><Link to="/">Products</Link></li>
          <li><Link to="/contact">Contact Support</Link></li>
          {user?.isAdmin && <li><Link to="/admin">Admin Panel</Link></li>}
          {user?.isAdmin && <li><Link to="/messages">Messages</Link></li>}
        </ul>
        
        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <span>Welcome, Admin</span>
              <button onClick={handleLogout} className="btn btn-small">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;