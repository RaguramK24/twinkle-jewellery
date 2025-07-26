import React, { useState, useEffect } from 'react';
import { Product, Category, ProductFormData } from '../types';
import { productService, categoryService } from '../services/api';

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

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
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
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

  const getImageUrl = (imageName?: string): string => {
    if (!imageName) return '';
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imageName}`;
  };

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
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductForm({...productForm, image: e.target.files?.[0]})}
                />
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
        {products.length === 0 ? (
          <p>No products found.</p>
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
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    {product.image ? (
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                        No Image
                      </div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
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