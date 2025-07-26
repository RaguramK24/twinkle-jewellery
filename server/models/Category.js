const JsonStorage = require('../utils/jsonStorage');

class Category {
  constructor() {
    this.storage = new JsonStorage('categories');
  }

  async find() {
    return this.storage.findAll();
  }

  async findById(id) {
    return this.storage.findById(id);
  }

  async save(categoryData) {
    // Validate required fields
    if (!categoryData.name || !categoryData.name.trim()) {
      throw new Error('Category name is required');
    }

    // Check for unique name
    const existing = this.storage.findOneByField('name', categoryData.name.trim());
    if (existing) {
      const error = new Error('Category name must be unique');
      error.code = 11000;
      throw error;
    }

    return this.storage.create({
      name: categoryData.name.trim(),
      description: categoryData.description ? categoryData.description.trim() : ''
    });
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const existing = this.storage.findById(id);
    if (!existing) return null;

    // Check for unique name if name is being updated
    if (updateData.name && updateData.name !== existing.name) {
      const nameExists = this.storage.findOneByField('name', updateData.name.trim());
      if (nameExists && nameExists._id !== id) {
        const error = new Error('Category name must be unique');
        error.code = 11000;
        throw error;
      }
    }

    const cleanUpdateData = {
      ...(updateData.name && { name: updateData.name.trim() }),
      ...(updateData.description !== undefined && { description: updateData.description.trim() || '' })
    };

    return this.storage.update(id, cleanUpdateData);
  }

  async findByIdAndDelete(id) {
    return this.storage.delete(id);
  }

  async countDocuments() {
    return this.storage.findAll().length;
  }

  async insertMany(categories) {
    const results = [];
    for (const categoryData of categories) {
      try {
        const result = await this.save(categoryData);
        results.push(result);
      } catch (error) {
        console.error('Error inserting category:', error);
      }
    }
    return results;
  }
}

module.exports = new Category();