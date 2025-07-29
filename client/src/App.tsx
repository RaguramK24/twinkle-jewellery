import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import AdminPanel from './components/AdminPanel';
import ContactForm from './components/ContactForm';
import AdminMessages from './components/AdminMessages';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Navigation />
          <main className="main-content" id="main-content">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <AdminMessages />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
