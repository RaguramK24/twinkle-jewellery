# MongoDB Migration Guide

This document provides detailed information about the MongoDB migration implemented in the Twinkle Jewellery application.

## What Changed?

The application has been migrated from JSON file-based storage to MongoDB Atlas with the following improvements:

### 1. Database Technology
- **Before**: JSON files in `server/data/` directory
- **After**: MongoDB Atlas cloud database with Mongoose ODM

### 2. Image Processing
- **New Feature**: Automatic image optimization using Sharp library
- Images are resized to max 1200px width/height
- Converted to JPEG with 85% quality and progressive encoding
- Original image storage location remains in `uploads/` directory

### 3. Data Models
- **Categories**: Now uses MongoDB collections with proper schema validation
- **Products**: Includes proper category references using ObjectId
- **Messages**: Enhanced with status tracking and better structure

## Environment Variables

Add these to your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
ADMIN_KEY=your_admin_key_here
```

## Migration Process

### From JSON to MongoDB

If you have existing JSON data files, run the migration utility:

```bash
cd server
npm run migrate
```

This will:
1. Connect to your MongoDB database
2. Clear existing data (optional - modify script if you want to preserve existing data)
3. Transfer categories from `categories.json`
4. Transfer products from `products.json` with proper category references
5. Transfer messages from `messages.json`

### Creating Sample Data

For new installations or testing:

```bash
cd server
npm run seed
```

This creates sample categories and products for testing purposes.

## Database Schema

### Categories Collection
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  price: Number (required, min: 0),
  description: String (required),
  category: ObjectId (ref: 'Category', required),
  image: String (filename),
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String,
  message: String (required),
  status: String (enum: ['new', 'read', 'responded'], default: 'new'),
  createdAt: Date,
  updatedAt: Date
}
```

## API Changes

The API endpoints remain the same, but now support:
- Proper validation using Mongoose schemas
- Better error handling for database operations
- Automatic population of category references in products

## Image Optimization

New image processing pipeline:
1. Image uploaded via multer to `uploads/` directory
2. Sharp middleware automatically optimizes the image:
   - Max dimensions: 1200x1200px
   - Format: JPEG
   - Quality: 85%
   - Progressive encoding enabled
3. Only the filename is stored in the database

## Health Check

Monitor database connectivity using the health endpoint:

```bash
curl http://localhost:5000/api/health
```

Response includes database connection status:
```json
{
  "message": "Twinkle Jewellery API is running!",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "database": "connected|connecting|disconnected|error",
  "dbHost": "cluster.mongodb.net"
}
```

## Troubleshooting

### Connection Issues
- Verify your MongoDB Atlas connection string
- Check network connectivity to MongoDB Atlas
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user permissions

### Migration Issues
- Ensure JSON files exist in `server/data/` directory
- Check file format and structure
- Verify MongoDB connection before running migration

### Image Optimization Issues
- Sharp library requires native dependencies
- On some systems, you may need to rebuild: `npm rebuild sharp`
- If optimization fails, the original image is kept

## Fallback Behavior

The application gracefully handles MongoDB connection failures:
- Server starts even if MongoDB is unreachable
- Health endpoint reports database status
- Error messages are logged but don't crash the application
- Timeout set to 5 seconds for connection attempts

## Security Considerations

- Never commit `.env` file to version control
- Use strong passwords for MongoDB users
- Limit MongoDB Atlas network access to specific IPs in production
- Keep JWT secrets secure and unique per environment