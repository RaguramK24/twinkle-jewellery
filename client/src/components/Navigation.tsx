import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isAdmin, setIsAdmin }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ✨ Twinkle Jewellery
        </Link>
        
        <ul className="nav-links">
          <li><Link to="/">Products</Link></li>
          {isAdmin && <li><Link to="/admin">Admin Panel</Link></li>}
        </ul>
        
        <div className="admin-toggle">
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            Admin Mode
          </label>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;