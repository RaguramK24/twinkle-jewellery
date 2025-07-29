const mongoose = require('mongoose');
const connectDB = require('./database');
const CategorySchema = require('../models/CategorySchema');
const ProductSchema = require('../models/ProductSchema');

require('dotenv').config();

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Check if data already exists
    const existingCategories = await CategorySchema.countDocuments();
    if (existingCategories > 0) {
      console.log('Database already has data. Skipping seed.');
      mongoose.connection.close();
      return;
    }
    
    // Create sample categories
    console.log('Creating sample categories...');
    const categories = [
      { name: 'Rings', description: 'Beautiful rings for all occasions' },
      { name: 'Necklaces', description: 'Elegant necklaces and chains' },
      { name: 'Earrings', description: 'Stunning earrings collection' },
      { name: 'Bracelets', description: 'Charming bracelets and bangles' },
      { name: 'Pendants', description: 'Graceful pendants and lockets' }
    ];
    
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = new CategorySchema(categoryData);
      const savedCategory = await category.save();
      createdCategories.push(savedCategory);
      console.log(`Created category: ${categoryData.name}`);
    }
    
    // Create sample products
    console.log('Creating sample products...');
    const products = [
      {
        name: 'Diamond Solitaire Ring',
        price: 25000,
        description: 'Beautiful diamond solitaire ring with 18k gold band',
        category: createdCategories[0]._id
      },
      {
        name: 'Gold Chain Necklace',
        price: 15000,
        description: 'Elegant 22k gold chain necklace for daily wear',
        category: createdCategories[1]._id
      },
      {
        name: 'Pearl Drop Earrings',
        price: 8000,
        description: 'Classic pearl drop earrings with sterling silver',
        category: createdCategories[2]._id
      },
      {
        name: 'Rose Gold Bracelet',
        price: 12000,
        description: 'Delicate rose gold bracelet with heart charm',
        category: createdCategories[3]._id
      },
      {
        name: 'Ruby Pendant',
        price: 18000,
        description: 'Exquisite ruby pendant with white gold chain',
        category: createdCategories[4]._id
      }
    ];
    
    for (const productData of products) {
      const product = new ProductSchema(productData);
      await product.save();
      console.log(`Created product: ${productData.name}`);
    }
    
    console.log('Database seeding completed successfully!');
    
    // Display summary
    const categoryCount = await CategorySchema.countDocuments();
    const productCount = await ProductSchema.countDocuments();
    
    console.log('\n=== Seed Summary ===');
    console.log(`Categories created: ${categoryCount}`);
    console.log(`Products created: ${productCount}`);
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;