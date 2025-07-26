# Twinkle Jewellery - MERN Stack Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) jewellery catalog application with user-to-admin chat/support functionality.

## 🌟 Features

### Core Application
- **Jewellery Catalog**: Browse diamond rings, gold necklaces, and silver bracelets
- **User-to-Admin Chat**: Simple support system for customer inquiries
- **Responsive Design**: Mobile-friendly interface

### Backend API
- **Message Model**: MongoDB schema with name, email, message, and timestamp
- **POST /api/messages**: Submit support messages
- **GET /api/messages**: Retrieve all messages (admin view)
- **Error Handling**: Proper validation and error responses
- **CORS Enabled**: Cross-origin requests supported

### Frontend Interface
- **Contact Form**: User-friendly message submission with validation
- **Admin Dashboard**: View all submitted messages with refresh functionality
- **Navigation**: Simple tabbed interface between catalog, contact, and admin views
- **Status Messages**: User feedback for form submissions and errors

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd twinkle-jewellery
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   npm run client-install
   # or manually: cd client && npm install
   ```

4. **Environment Setup**
   ```bash
   # Create .env file with:
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/twinkle-jewellery
   NODE_ENV=development
   ```

### Development

**Option 1: Run both servers separately**
```bash
# Terminal 1 - Backend server
npm run dev

# Terminal 2 - React frontend
npm run client
```

**Option 2: Run backend only**
```bash
npm start
```

### Production Build

```bash
# Build React app
npm run build

# Start production server
NODE_ENV=production npm start
```

## 📡 API Endpoints

### Messages
- **POST /api/messages** - Submit a new message
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com", 
    "message": "Your message here"
  }
  ```

- **GET /api/messages** - Retrieve all messages (admin)
  ```json
  [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Your message here",
      "timestamp": "2025-01-01T00:00:00.000Z"
    }
  ]
  ```

## 🎯 Usage

1. **Browse Catalog**: View the main jewellery categories on the home page
2. **Contact Admin**: Click "Contact Admin" to submit support messages
3. **Admin View**: Click "Admin Messages" to view all submitted messages
4. **No Authentication**: All features work without user registration or login

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Frontend**: React.js with Axios for API calls
- **Styling**: CSS3 with responsive design
- **Development**: Nodemon for auto-restart, Create React App

## 📝 Project Structure

```
twinkle-jewellery/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main App component
│   │   └── ...
│   └── package.json
├── models/                 # MongoDB models
│   └── Message.js
├── routes/                 # Express routes
│   └── messages.js
├── server.js              # Express server
├── package.json           # Backend dependencies
└── .env                   # Environment variables
```

## ⚡ Quick Test

After starting both servers:
1. Visit `http://localhost:3000`
2. Navigate to "Contact Admin" 
3. Fill out and submit the form
4. Check "Admin Messages" to view submissions

## 📋 Requirements Fulfilled

- ✅ Message model with name, email, message, timestamp fields
- ✅ POST /api/messages endpoint for message submission
- ✅ GET /api/messages endpoint for admin message viewing  
- ✅ Contact Admin form accessible to all users
- ✅ Admin page for viewing submitted messages
- ✅ No authentication required
- ✅ MongoDB storage for chat history
- ✅ No real-time features (as requested)
