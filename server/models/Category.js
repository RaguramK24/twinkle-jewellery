const CategorySchema = require('./CategorySchema');

class Category {
  async find() {
    return await CategorySchema.find();
  }

  async findById(id) {
    return await CategorySchema.findById(id);
  }

  async save(categoryData) {
    const category = new CategorySchema({
      name: categoryData.name.trim(),
      description: categoryData.description ? categoryData.description.trim() : ''
    });

    return await category.save();
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const cleanUpdateData = {
      ...(updateData.name && { name: updateData.name.trim() }),
      ...(updateData.description !== undefined && { description: updateData.description.trim() || '' })
    };

    return await CategorySchema.findByIdAndUpdate(id, cleanUpdateData, { new: true, ...options });
  }

  async findByIdAndDelete(id) {
    return await CategorySchema.findByIdAndDelete(id);
  }

  async countDocuments() {
    return await CategorySchema.countDocuments();
  }

  async insertMany(categories) {
    return await CategorySchema.insertMany(categories);
  }
}

module.exports = new Category();