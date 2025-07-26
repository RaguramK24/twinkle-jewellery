const JsonStorage = require('../utils/jsonStorage');
const Category = require('./Category');

class Product {
  constructor() {
    this.storage = new JsonStorage('products');
  }

  async find() {
    return this.storage.findAll();
  }

  async findById(id) {
    return this.storage.findById(id);
  }

  async save(productData) {
    // Validate required fields
    if (!productData.name || !productData.name.trim()) {
      throw new Error('Product name is required');
    }
    if (!productData.price || isNaN(parseFloat(productData.price)) || parseFloat(productData.price) < 0) {
      throw new Error('Valid price is required');
    }
    if (!productData.description || !productData.description.trim()) {
      throw new Error('Product description is required');
    }
    if (!productData.category) {
      throw new Error('Category is required');
    }

    // Verify category exists
    const categoryExists = await Category.findById(productData.category);
    if (!categoryExists) {
      throw new Error('Invalid category');
    }

    return this.storage.create({
      name: productData.name.trim(),
      price: parseFloat(productData.price),
      description: productData.description.trim(),
      category: productData.category,
      image: productData.image || null
    });
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const existing = this.storage.findById(id);
    if (!existing) return null;

    // Validate updated fields
    const cleanUpdateData = {};
    
    if (updateData.name !== undefined) {
      if (!updateData.name.trim()) {
        throw new Error('Product name is required');
      }
      cleanUpdateData.name = updateData.name.trim();
    }
    
    if (updateData.price !== undefined) {
      const price = parseFloat(updateData.price);
      if (isNaN(price) || price < 0) {
        throw new Error('Valid price is required');
      }
      cleanUpdateData.price = price;
    }
    
    if (updateData.description !== undefined) {
      if (!updateData.description.trim()) {
        throw new Error('Product description is required');
      }
      cleanUpdateData.description = updateData.description.trim();
    }
    
    if (updateData.category !== undefined) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        throw new Error('Invalid category');
      }
      cleanUpdateData.category = updateData.category;
    }
    
    if (updateData.image !== undefined) {
      cleanUpdateData.image = updateData.image;
    }

    return this.storage.update(id, cleanUpdateData);
  }

  async findByIdAndDelete(id) {
    return this.storage.delete(id);
  }

  // Method to populate category data
  async populate(products, field) {
    if (!Array.isArray(products)) {
      products = [products];
    }
    
    const populatedProducts = [];
    for (const product of products) {
      if (product && field === 'category' && product.category) {
        const category = await Category.findById(product.category);
        populatedProducts.push({
          ...product,
          category: category || product.category
        });
      } else {
        populatedProducts.push(product);
      }
    }
    
    return Array.isArray(arguments[0]) ? populatedProducts : populatedProducts[0];
  }
}

module.exports = new Product();