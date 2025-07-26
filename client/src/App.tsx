import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import AdminPanel from './components/AdminPanel';
import ContactForm from './components/ContactForm';
import AdminMessages from './components/AdminMessages';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="App">
      <Router>
        <Navigation isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/admin" element={<AdminPanel isAdmin={isAdmin} />} />
            <Route path="/messages" element={<AdminMessages />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
