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
      images: productData.images || [],
      imageKitFileIds: productData.imageKitFileIds || [],
      imageMetadataList: productData.imageMetadataList || [],
      // Keep legacy fields for backward compatibility
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
    
    // Handle multiple images
    if (updateData.images !== undefined) {
      cleanUpdateData.images = updateData.images;
    }
    
    if (updateData.imageKitFileIds !== undefined) {
      cleanUpdateData.imageKitFileIds = updateData.imageKitFileIds;
    }
    
    if (updateData.imageMetadataList !== undefined) {
      cleanUpdateData.imageMetadataList = updateData.imageMetadataList;
    }
    
    // Handle legacy single image for backward compatibility
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
        return this.ensureImageArrays(populated);
      }
      return this.ensureImageArrays(products);
    }
    
    const populatedProducts = [];
    for (const product of products) {
      if (product && field === 'category') {
        const populated = await ProductSchema.findById(product._id).populate('category');
        populatedProducts.push(this.ensureImageArrays(populated));
      } else {
        populatedProducts.push(this.ensureImageArrays(product));
      }
    }
    
    return populatedProducts;
  }

  // Helper method to ensure backward compatibility by migrating single image to array
  ensureImageArrays(product) {
    if (!product) return product;
    
    // Convert to plain object if it's a mongoose document
    const productObj = product.toObject ? product.toObject({ virtuals: true }) : product;
    
    // If no images array but has legacy image, migrate it
    if ((!productObj.images || productObj.images.length === 0) && productObj.image) {
      productObj.images = [productObj.image];
      
      if (productObj.imageKitFileId) {
        productObj.imageKitFileIds = [productObj.imageKitFileId];
      }
      
      if (productObj.imageMetadata && Object.keys(productObj.imageMetadata).length > 0) {
        productObj.imageMetadataList = [productObj.imageMetadata];
      }
    }
    
    return productObj;
  }
}

module.exports = new Product();