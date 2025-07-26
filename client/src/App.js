import React, { useState } from 'react';
import './App.css';
import ContactForm from './components/ContactForm';
import AdminMessages from './components/AdminMessages';

function App() {
  const [currentView, setCurrentView] = useState('catalog');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Twinkle Jewellery</h1>
        <nav>
          <button 
            onClick={() => setCurrentView('catalog')}
            className={currentView === 'catalog' ? 'active' : ''}
          >
            Catalog
          </button>
          <button 
            onClick={() => setCurrentView('contact')}
            className={currentView === 'contact' ? 'active' : ''}
          >
            Contact Admin
          </button>
          <button 
            onClick={() => setCurrentView('admin')}
            className={currentView === 'admin' ? 'active' : ''}
          >
            Admin Messages
          </button>
        </nav>
      </header>
      
      <main className="App-main">
        {currentView === 'catalog' && (
          <div className="catalog-section">
            <h2>Welcome to Twinkle Jewellery</h2>
            <p>Your premium jewellery destination</p>
            <div className="jewelry-grid">
              <div className="jewelry-item">
                <h3>Diamond Rings</h3>
                <p>Beautiful diamond rings for special occasions</p>
              </div>
              <div className="jewelry-item">
                <h3>Gold Necklaces</h3>
                <p>Elegant gold necklaces crafted with care</p>
              </div>
              <div className="jewelry-item">
                <h3>Silver Bracelets</h3>
                <p>Stylish silver bracelets for everyday wear</p>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'contact' && <ContactForm />}
        {currentView === 'admin' && <AdminMessages />}
      </main>
    </div>
  );
}

export default App;
