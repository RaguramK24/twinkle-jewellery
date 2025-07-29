const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./database');
const CategorySchema = require('../models/CategorySchema');
const ProductSchema = require('../models/ProductSchema');
const MessageSchema = require('../models/MessageSchema');

require('dotenv').config();

const migrateJSONToMongoDB = async () => {
  try {
    console.log('Starting JSON to MongoDB migration...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('Clearing existing data...');
    await CategorySchema.deleteMany({});
    await ProductSchema.deleteMany({});
    await MessageSchema.deleteMany({});
    
    // Migration paths
    const dataDir = path.join(__dirname, '../data');
    const categoriesPath = path.join(dataDir, 'categories.json');
    const productsPath = path.join(dataDir, 'products.json');
    const messagesPath = path.join(dataDir, 'messages.json');
    
    // Migrate Categories
    if (fs.existsSync(categoriesPath)) {
      console.log('Migrating categories...');
      const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
      const categoryIdMap = new Map(); // To map old IDs to new ObjectIds
      
      for (const category of categoriesData) {
        const newCategory = new CategorySchema({
          name: category.name,
          description: category.description || ''
        });
        const savedCategory = await newCategory.save();
        categoryIdMap.set(category._id, savedCategory._id);
        console.log(`Migrated category: ${category.name}`);
      }
      
      // Migrate Products
      if (fs.existsSync(productsPath)) {
        console.log('Migrating products...');
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        
        for (const product of productsData) {
          // Map old category ID to new ObjectId
          const newCategoryId = categoryIdMap.get(product.category);
          if (newCategoryId) {
            const newProduct = new ProductSchema({
              name: product.name,
              price: product.price,
              description: product.description,
              category: newCategoryId,
              image: product.image
            });
            await newProduct.save();
            console.log(`Migrated product: ${product.name}`);
          } else {
            console.log(`Skipped product ${product.name} - category not found`);
          }
        }
      }
    }
    
    // Migrate Messages
    if (fs.existsSync(messagesPath)) {
      console.log('Migrating messages...');
      const messagesData = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
      
      for (const message of messagesData) {
        const newMessage = new MessageSchema({
          name: message.name,
          email: message.email,
          phone: message.phone || '',
          message: message.message
        });
        await newMessage.save();
        console.log(`Migrated message from: ${message.name}`);
      }
    }
    
    console.log('Migration completed successfully!');
    
    // Display summary
    const categoryCount = await CategorySchema.countDocuments();
    const productCount = await ProductSchema.countDocuments();
    const messageCount = await MessageSchema.countDocuments();
    
    console.log('\n=== Migration Summary ===');
    console.log(`Categories migrated: ${categoryCount}`);
    console.log(`Products migrated: ${productCount}`);
    console.log(`Messages migrated: ${messageCount}`);
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateJSONToMongoDB();
}

module.exports = migrateJSONToMongoDB;