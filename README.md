# Twinkle Jewellery - MERN Stack Application

A complete jewellery catalog application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to browse products and provides admin functionality for managing products and categories.

## Features

### User Features
- Browse all products in a beautiful grid layout
- View detailed product information
- Filter by categories
- Responsive design for all devices

### Admin Features
- Create, edit, and delete products
- Manage categories
- Upload product images
- Admin toggle in navigation (no authentication required - development mode)

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Frontend**: React with TypeScript, React Router
- **File Upload**: Multer for image handling
- **Styling**: Plain CSS with responsive design

## Project Structure

```
twinkle-jewellery/
├── server/                 # Backend application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # Uploaded images storage
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
└── README.md              # This file
```

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or connection string to MongoDB Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

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
# MONGODB_URI=mongodb://localhost:27017/twinkle-jewellery
# ADMIN_KEY=admin123
# NODE_ENV=development

# Create uploads directory for images
mkdir uploads

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file if needed
# REACT_APP_API_URL=http://localhost:5000/api
# REACT_APP_ADMIN_KEY=admin123

# Start the React development server
npm start
```

The frontend will start on `http://localhost:3000`

### 4. MongoDB Setup

Make sure MongoDB is running on your system:

```bash
# For local MongoDB installation
mongod
```

Or update the `MONGODB_URI` in your `.env` file to point to your MongoDB Atlas connection string.

## Usage

### For Regular Users

1. Visit `http://localhost:3000`
2. Browse the product catalog
3. Click on any product to view detailed information

### For Admin Users

1. Toggle "Admin Mode" in the navigation bar
2. Visit the "Admin Panel" from the navigation
3. Add/edit/delete categories and products
4. Upload product images

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

## File Upload

Product images are stored locally in the `server/uploads/` directory. Supported formats:
- JPEG, JPG
- PNG
- GIF
- WebP
- Maximum file size: 5MB

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
MONGODB_URI=mongodb://localhost:27017/twinkle-jewellery
ADMIN_KEY=admin123
NODE_ENV=development
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ADMIN_KEY=admin123
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
