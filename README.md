# ✨ Twinkle Jewellery

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for a jewelry catalog and e-commerce platform.

## Project Structure

```
twinkle-jewellery/
├── server/                 # Express.js backend
│   ├── controllers/        # Route controllers
│   │   └── jewelryController.js
│   ├── models/            # MongoDB schemas
│   │   └── Jewelry.js
│   ├── routes/            # API routes
│   │   └── jewelry.js
│   ├── uploads/           # File upload directory
│   ├── app.js             # Express server setup
│   ├── config.js          # Configuration settings
│   └── package.json       # Backend dependencies
├── client/                # React frontend
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── components/    # Reusable components
│   │   │   ├── Header.jsx
│   │   │   └── JewelryCard.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.jsx
│   │   │   └── CatalogPage.jsx
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # React entry point
│   └── package.json       # Frontend dependencies
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RaguramK24/twinkle-jewellery.git
   cd twinkle-jewellery
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Development Setup

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/twinkle-jewellery
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Technology Stack

### Backend
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **Vite** - Build tool and development server
- **CSS3** - Styling

## API Endpoints

### Jewelry Routes
- `GET /api/jewelry` - Get all jewelry items
- `GET /api/jewelry/:id` - Get jewelry item by ID
- `POST /api/jewelry` - Create new jewelry item
- `PUT /api/jewelry/:id` - Update jewelry item
- `DELETE /api/jewelry/:id` - Delete jewelry item

## Features (Planned)

- 📱 Responsive design for all devices
- 🔍 Advanced search and filtering
- 🛒 Shopping cart functionality
- 👤 User authentication and profiles
- 💳 Payment processing integration
- 📊 Admin dashboard for inventory management
- 📸 Image upload and gallery
- ⭐ Product reviews and ratings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on GitHub.
