const ProductSchema = require('./ProductSchema');
const CategorySchema = require('./CategorySchema');

class Product {
  async find() {
    return await ProductSchema.find();
  }

  async findById(id) {
    return await ProductSchema.findById(id);
  }

  async save(productData) {
    // Verify category exists
    const categoryExists = await CategorySchema.findById(productData.category);
    if (!categoryExists) {
      throw new Error('Invalid category');
    }

    const product = new ProductSchema({
      name: productData.name.trim(),
      price: parseFloat(productData.price),
      description: productData.description.trim(),
      category: productData.category,
      image: productData.image || null,
      imageKitFileId: productData.imageKitFileId || null,
      imageMetadata: productData.imageMetadata || {}
    });

    return await product.save();
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    // Validate category if provided
    if (updateData.category !== undefined) {
      const categoryExists = await CategorySchema.findById(updateData.category);
      if (!categoryExists) {
        throw new Error('Invalid category');
      }
    }

    const cleanUpdateData = {};
    
    if (updateData.name !== undefined) {
      cleanUpdateData.name = updateData.name.trim();
    }
    
    if (updateData.price !== undefined) {
      cleanUpdateData.price = parseFloat(updateData.price);
    }
    
    if (updateData.description !== undefined) {
      cleanUpdateData.description = updateData.description.trim();
    }
    
    if (updateData.category !== undefined) {
      cleanUpdateData.category = updateData.category;
    }
    
    if (updateData.image !== undefined) {
      cleanUpdateData.image = updateData.image;
    }

    // Handle ImageKit specific fields
    if (updateData.imageKitFileId !== undefined) {
      cleanUpdateData.imageKitFileId = updateData.imageKitFileId;
    }

    if (updateData.imageMetadata !== undefined) {
      cleanUpdateData.imageMetadata = updateData.imageMetadata;
    }

    return await ProductSchema.findByIdAndUpdate(id, cleanUpdateData, { new: true, ...options });
  }

  async findByIdAndDelete(id) {
    return await ProductSchema.findByIdAndDelete(id);
  }

  // Method to populate category data
  async populate(products, field) {
    if (!Array.isArray(products)) {
      if (products && field === 'category') {
        const populated = await ProductSchema.findById(products._id).populate('category');
        return populated;
      }
      return products;
    }
    
    const populatedProducts = [];
    for (const product of products) {
      if (product && field === 'category') {
        const populated = await ProductSchema.findById(product._id).populate('category');
        populatedProducts.push(populated);
      } else {
        populatedProducts.push(product);
      }
    }
    
    return populatedProducts;
  }
}

module.exports = new Product();