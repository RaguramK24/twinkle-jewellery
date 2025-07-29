import React, { useState, useEffect } from 'react';
import { Product, Category, ProductFormData } from '../types';
import { productService, categoryService } from '../services/api';
import { formatPrice, getProductImageUrls } from '../utils/formatters';
import ImageCarousel from './ImageCarousel';

// Mock data for demo (fallback when API is unavailable)
const mockCategories: Category[] = [
  { _id: 'cat1', name: 'Rings', description: 'Beautiful rings', createdAt: '', updatedAt: '' },
  { _id: 'cat2', name: 'Necklaces', description: 'Elegant necklaces', createdAt: '', updatedAt: '' },
  { _id: 'cat3', name: 'Earrings', description: 'Stunning earrings', createdAt: '', updatedAt: '' },
  { _id: 'cat4', name: 'Bracelets', description: 'Charming bracelets', createdAt: '', updatedAt: '' },
];

const mockProducts: Product[] = [
  {
    _id: 'prod1',
    name: 'Diamond Solitaire Ring',
    price: 25000,
    description: 'Beautiful diamond solitaire ring with 18k gold band. Perfect for engagements.',
    category: mockCategories[0],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'prod2',
    name: 'Gold Chain Necklace',
    price: 15000,
    description: 'Elegant 22k gold chain necklace for daily wear. Classic design.',
    category: mockCategories[1],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'prod3',
    name: 'Pearl Drop Earrings',
    price: 8000,
    description: 'Classic pearl drop earrings with sterling silver. Timeless elegance.',
    category: mockCategories[2],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'prod4',
    name: 'Rose Gold Bracelet',
    price: 12000,
    description: 'Delicate rose gold bracelet with heart charm. Perfect gift.',
    category: mockCategories[3],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'prod5',
    name: 'Vintage Engagement Ring',
    price: 35000,
    description: 'Stunning vintage-style engagement ring with intricate diamond details.',
    category: mockCategories[0],
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: 'prod6',
    name: 'Silver Pendant Necklace',
    price: 5000,
    description: 'Beautiful silver pendant necklace with modern design.',
    category: mockCategories[1],
    createdAt: '',
    updatedAt: '',
  },
];

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form states
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    category: '',
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      // Fallback to mock data for demo purposes
      console.warn('API unavailable, using mock data for demo');
      setProducts(mockProducts);
      setCategories(mockCategories);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const updatedProduct = await productService.update(editingProduct._id, productForm);
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
        setSuccess('Product updated successfully!');
      } else {
        const newProduct = await productService.create(productForm);
        setProducts([...products, newProduct]);
        setSuccess('Product created successfully!');
      }
      
      resetProductForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCategory = await categoryService.create(categoryForm);
      setCategories([...categories, newCategory]);
      setCategoryForm({ name: '', description: '' });
      setShowCategoryForm(false);
      setSuccess('Category created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        setProducts(products.filter(p => p._id !== id));
        setSuccess('Product deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete product');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category._id,
    });
    setShowProductForm(true);
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: 0,
      description: '',
      category: '',
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category._id === selectedCategory;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="admin-sections">
        {/* Category Management */}
        <div className="admin-section">
          <h2>Manage Categories</h2>
          
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="btn btn-primary"
            style={{ marginBottom: '1rem' }}
          >
            {showCategoryForm ? 'Cancel' : 'Add New Category'}
          </button>

          {showCategoryForm && (
            <form onSubmit={handleCategorySubmit} style={{ marginBottom: '2rem' }}>
              <div className="form-group">
                <label>Category Name:</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-success">Create Category</button>
            </form>
          )}

          <div>
            <h3>Existing Categories:</h3>
            {categories.map(category => (
              <div key={category._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <strong>{category.name}</strong>
                {category.description && <p style={{ margin: '0.25rem 0', color: '#666' }}>{category.description}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Product Form */}
        <div className="admin-section">
          <h2>Manage Products</h2>
          
          <button
            onClick={() => {
              resetProductForm();
              setShowProductForm(!showProductForm);
            }}
            className="btn btn-primary"
            style={{ marginBottom: '1rem' }}
          >
            {showProductForm ? 'Cancel' : 'Add New Product'}
          </button>

          {showProductForm && (
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label>Product Name:</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category:</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Images (up to 5):</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setProductForm({...productForm, images: e.target.files || undefined})}
                />
                <small style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                  Select multiple images to create a carousel. Maximum 5 images allowed.
                </small>
              </div>
              
              <button type="submit" className="btn btn-success">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Products List */}
      <div className="product-management">
        <h2>Existing Products</h2>
        
        {/* Filter and Search Controls */}
        <div className="product-filters">
          <div className="filter-group">
            <label htmlFor="admin-category-filter">Filter by Category:</label>
            <select
              id="admin-category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="admin-product-search">Search Products:</label>
            <input
              id="admin-product-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="search-input"
            />
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <p>{products.length === 0 ? "No products found." : "No products match your search criteria."}</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <div style={{ width: '80px', height: '60px' }}>
                      <ImageCarousel
                        images={getProductImageUrls(product)}
                        alt={product.name}
                        showControls={getProductImageUrls(product).length > 1}
                        showDots={false}
                      />
                    </div>
                  </td>
                  <td>{product.name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.category.name}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="btn btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;