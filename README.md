# Twinkle Jewellery - MERN Stack Application

A complete jewellery catalog application built with the MERN stack (MongoDB, Express, React, Node.js). This application allows users to browse products and provides admin functionality for managing products and categories with MongoDB Atlas as the database.

**Custom Domain**: [www.twinklesjewellery.in](https://www.twinklesjewellery.in)

## Features

### User Features
- Browse all products in a beautiful grid layout
- View detailed product information
- Filter by categories
- Responsive design for all devices

### Admin Features
- Secure JWT-based authentication system
- Create, edit, and delete products
- Manage categories
- Upload product images with automatic optimization
- View customer support messages
- Protected admin routes with login/logout

## Technology Stack

- **Backend**: Node.js, Express.js, JWT authentication, MongoDB Atlas, Mongoose ODM
- **Frontend**: React with TypeScript, React Router, Authentication Context
- **Database**: MongoDB Atlas (cloud database)
- **Image Storage**: ImageKit.io for cloud-based image storage and optimization
- **Security**: JWT tokens, bcrypt password hashing, protected routes
- **File Upload**: Multer for image handling with Sharp for optimization, ImageKit.io for storage
- **Styling**: Plain CSS with responsive design
- **Domain**: Custom domain at www.twinklesjewellery.in

## Project Structure

```
twinkle-jewellery/
├── server/                 # Backend application
│   ├── models/            # Mongoose models and schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions (database, image optimization, ImageKit)
│   ├── uploads/           # Local uploads (backward compatibility)
│   ├── tmp/               # Temporary files during image processing
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main App component
│   ├── package.json       # Frontend dependencies
│   └── .env.example       # Frontend environment template
├── CNAME                  # Custom domain configuration
└── README.md              # This file
```

## Prerequisites

Before running this application, make sure you have the following:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- MongoDB Atlas account (free tier available)
- [ImageKit.io](https://imagekit.io/) account for image storage (free tier available)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/RaguramK24/twinkle-jewellery.git
cd twinkle-jewellery
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# PORT=5000
# ADMIN_KEY=admin123
# NODE_ENV=development
# JWT_SECRET=your_jwt_secret_key_here
# MONGODB_URI=your_mongodb_atlas_connection_string
# IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key_here
# IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key_here
# IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint_here

# Create uploads directory for backward compatibility (optional)
mkdir uploads

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`. Data will be stored in MongoDB Atlas.

### 3. MongoDB Atlas Setup

1. Create a free MongoDB Atlas account at [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user with read/write permissions
4. Add your IP address to the network access list (or allow all IPs with 0.0.0.0/0 for development)
5. Get your connection string and add it to the `.env` file as `MONGODB_URI`

### 4. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file if needed
# REACT_APP_API_URL=http://localhost:5000/api

# Start the React development server
npm start
```

The frontend will start on `http://localhost:3000`

### 5. Image Storage with ImageKit.io

The application now uses ImageKit.io for cloud-based image storage and optimization. This provides:

- **Cloud Storage**: Images are stored on ImageKit.io's global CDN
- **Real-time Optimization**: Automatic image resizing, format conversion, and quality optimization
- **Fast Delivery**: Global CDN ensures fast image loading worldwide
- **Transformation API**: Generate different image sizes and formats on-demand

#### ImageKit.io Setup

1. **Create ImageKit Account**
   - Sign up at [ImageKit.io](https://imagekit.io/)
   - Create a new project or use an existing one

2. **Get API Credentials**
   - Go to Developer Options in your ImageKit dashboard
   - Copy your:
     - Public Key
     - Private Key
     - URL Endpoint

3. **Configure Environment Variables**
   ```bash
   IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxxxxxxxxxx
   IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxxxxxxxxx
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
   ```

#### Image Processing Pipeline

1. **Upload Process**:
   - Admin uploads image through the admin panel
   - Image is temporarily stored locally
   - Sharp library optimizes the image (resize to 1200px max, JPEG 85% quality)
   - Optimized image is uploaded to ImageKit.io
   - Local temporary file is deleted
   - ImageKit URL is stored in the database

2. **Serving Images**:
   - Frontend receives ImageKit URLs from the API
   - Images are served directly from ImageKit.io's CDN
   - Real-time transformations available via URL parameters

3. **Cleanup**:
   - When products are deleted, associated images are removed from ImageKit.io
   - Old images are automatically deleted when products are updated with new images

#### Migration from Local Storage

The application maintains backward compatibility with existing local images:
- Existing products with local images continue to work
- New uploads automatically use ImageKit.io
- The `imageUrl` virtual field handles both local and ImageKit URLs seamlessly

### 6. Database Migration & Seeding

If you're upgrading from the JSON-based version or need to populate your database:

#### Migrate from JSON files to MongoDB:
```bash
cd server
npm run migrate
```

#### Seed the database with sample data:
```bash
cd server
npm run seed
```

These utilities will help you:
- **Migrate**: Transfer existing data from `server/data/*.json` files to MongoDB
- **Seed**: Create sample categories and products for testing

## Usage

### For Regular Users

1. Visit `http://localhost:3000`
2. Browse the product catalog
3. Click on any product to view detailed information

### For Admin Users

1. Click "Admin Login" in the navigation bar
2. Login with admin credentials:
   - **Email**: ragurameee24@gmail.com
   - **Password**: Admin@123
3. Access the "Admin Panel" and "Messages" from the navigation
4. Add/edit/delete categories and products
5. Upload product images
6. View customer support messages
7. Click "Logout" when finished

For detailed admin authentication information, see [ADMIN_AUTH_GUIDE.md](./ADMIN_AUTH_GUIDE.md).

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Admin Authentication

For admin endpoints, include the admin key in the request headers:

```
admin-key: admin123
```

Or as a query parameter:

```
?adminKey=admin123
```

## Default Data

The application creates default categories on first run:
- Rings
- Necklaces  
- Earrings
- Bracelets

Data is persisted in JSON files and will survive server restarts.

## File Upload

Product images are now stored on ImageKit.io cloud storage with the following features:

- **Supported formats**: JPEG, JPG, PNG, GIF, WebP
- **Maximum file size**: 5MB
- **Automatic optimization**: Images are resized to max 1200px and converted to JPEG with 85% quality
- **Cloud delivery**: Images served via ImageKit.io's global CDN
- **Real-time transformations**: Generate thumbnails and different sizes on-demand
- **Backward compatibility**: Existing local images continue to work

### Image Upload Process:
1. File uploaded via admin panel
2. Temporary local storage for processing
3. Sharp optimization (resize, format conversion)
4. Upload to ImageKit.io
5. Local file cleanup
6. ImageKit URL stored in database

## Development

### Backend Development

```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

```bash
cd client
npm start    # React development server with hot reload
```

### Building for Production

```bash
# Build React app
cd client
npm run build

# The built files will be in client/build/
```

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
ADMIN_KEY=admin123
MONGODB_URI=your_mongodb_atlas_connection_string

# ImageKit.io Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key_here
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key_here
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint_here
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ADMIN_KEY=admin123
```

## Access the Application

- **Production Site**: [www.twinklesjewellery.in](https://www.twinklesjewellery.in)
- **Local Development**: `http://localhost:3000`
- **API Endpoint**: `http://localhost:5000/api`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment on Render

This application is configured for easy deployment on [Render](https://render.com), a modern cloud platform that offers free hosting for static sites and web services.

### Prerequisites for Deployment

1. A [Render account](https://render.com) (free to create)
2. Your code pushed to a GitHub repository
3. (Optional) A custom domain registered with GoDaddy or another domain provider

### Deploy to Render

#### Option 1: Automatic Deployment (Recommended)

1. **Connect Your Repository**
   - Log in to your Render account
   - Click "New +" and select "Web Service"
   - Connect your GitHub account and select your repository
   - Render will automatically detect the `render.yaml` configuration

2. **Configure Environment Variables**
   - Render will use the settings from `render.yaml`
   - Set your `ADMIN_KEY` in the Render dashboard under Environment Variables
   - All other settings (Node environment, build commands) are pre-configured

3. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - The build process will install dependencies and build the React client
   - Your app will be available at `https://your-app-name.onrender.com`

#### Option 2: Manual Configuration

If you prefer to configure manually instead of using the `render.yaml` file:

1. **Create a New Web Service**
   - Repository: Your GitHub repository
   - Branch: `main` (or your preferred branch)
   - Runtime: `Node`
   - Build Command: `npm install && npm run heroku-postbuild`
   - Start Command: `npm start`

2. **Advanced Settings**
   - Plan: `Free`
   - Node Version: `18` (or later)
   - Health Check Path: `/api/health`

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   ADMIN_KEY=your-secure-admin-key
   JWT_SECRET=your-secure-jwt-secret
   MONGODB_URI=your-mongodb-connection-string
   IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
   IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
   IMAGEKIT_URL_ENDPOINT=your-imagekit-url-endpoint
   ```

### Custom Domain Setup with GoDaddy

Once your app is deployed on Render, you can connect a custom domain purchased from GoDaddy.

#### Step 1: Configure Domain in Render

1. **Add Custom Domain**
   - Go to your Render service dashboard
   - Navigate to "Settings" → "Custom Domains"
   - Click "Add" and enter your domain (e.g., `www.twinklesjewellery.in`)
   - Render will provide you with a CNAME target (e.g., `your-app.onrender.com`)

#### Step 2: Configure DNS Records in GoDaddy

1. **Access GoDaddy DNS Management**
   - Log in to your [GoDaddy account](https://account.godaddy.com)
   - Go to "My Products" → "Domains"
   - Click on your domain name
   - Select "DNS" → "Manage Zones"

2. **Add DNS Records**

   For `www.twinklesjewellery.in`:
   ```
   Type: CNAME
   Name: www
   Value: your-app-name.onrender.com
   TTL: 600 (10 minutes)
   ```

   For root domain redirect (optional):
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   TTL: 600
   ```
   Note: This IP redirects to www subdomain. Check Render's documentation for current IPs.

3. **SSL Certificate**
   - Render automatically provides SSL certificates for custom domains
   - After DNS propagation (usually 10-60 minutes), your site will be available with HTTPS

#### Step 3: Update Application Configuration

1. **Update Client Environment**
   - In your client/.env file, update the API URL if needed:
   ```
   REACT_APP_API_URL=https://www.twinklesjewellery.in/api
   ```

2. **CORS Configuration**
   - Update server CORS settings to allow your custom domain:
   ```javascript
   app.use(cors({
     origin: ['https://www.twinklesjewellery.in', 'http://localhost:3000']
   }));
   ```

### Deployment Best Practices

1. **Environment Variables**
   - Never commit sensitive information like admin keys to your repository
   - Use Render's environment variable feature for sensitive data
   - Different environments (development, production) should have different keys

2. **Database Considerations**
   - This app uses JSON file storage, which works for the free tier
   - For production apps with high traffic, consider migrating to a proper database
   - Render offers PostgreSQL databases on paid plans

3. **File Uploads**
   - Images are now stored on ImageKit.io cloud storage
   - No need for persistent disk storage on the hosting platform
   - Ensure ImageKit.io credentials are properly configured in environment variables
   - ImageKit.io provides global CDN and automatic optimization

4. **Monitoring**
   - Use Render's built-in logs and metrics
   - Monitor your app's performance in the Render dashboard
   - Set up alerts for downtime or errors

### Troubleshooting Deployment

**Build Fails:**
- Check that all dependencies are in package.json
- Ensure Node version compatibility (14+)
- Review build logs in Render dashboard

**App Won't Start:**
- Verify the start command: `npm start`
- Check for missing environment variables
- Review server logs for specific error messages

**Custom Domain Issues:**
- Verify DNS records are correct and propagated
- Use tools like `dig` or online DNS checkers
- Allow 24-48 hours for full DNS propagation

**File Upload Issues:**
- Check that ImageKit.io credentials are correctly set in .env
- Verify ImageKit.io account has sufficient storage quota
- Check that the uploads directory exists (for temporary processing)
- Verify file size limits (5MB default)
- Ensure ImageKit.io endpoint URL is correct and accessible

**ImageKit Configuration Issues:**
- Verify all three ImageKit environment variables are set:
  - IMAGEKIT_PUBLIC_KEY
  - IMAGEKIT_PRIVATE_KEY
  - IMAGEKIT_URL_ENDPOINT
- Check ImageKit.io dashboard for API key validity
- Ensure your ImageKit.io plan supports the required features

For more detailed information, visit the [Render Documentation](https://render.com/docs).

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

## Future Enhancements

- User authentication and authorization
- Shopping cart functionality
- Order management
- Payment integration
- Advanced search and filtering
- Product reviews and ratings
- Email notifications
- Admin dashboard with analytics
