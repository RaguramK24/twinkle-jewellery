# Admin Authentication Guide

## Overview

The Twinkle Jewellery application now features a secure JWT-based authentication system for admin access. This replaces the previous insecure admin toggle with proper login/logout functionality.

## Admin Credentials

- **Email:** ragurameee24@gmail.com
- **Password:** Admin@123

## Authentication Flow

### 1. Admin Login
1. Navigate to the application homepage
2. Click the "Admin Login" button in the top-right navigation
3. Enter the admin credentials on the login page
4. Upon successful authentication, you'll be redirected to the admin panel

### 2. Admin Session
- After login, the navigation shows "Welcome, Admin" and a "Logout" button
- Admin-only links (Admin Panel, Messages) become visible in the navigation
- The session is maintained using secure httpOnly cookies with JWT tokens

### 3. Admin Logout
- Click the "Logout" button in the navigation
- This clears your session and redirects you to the login page
- Admin links are no longer visible after logout

## Protected Routes

The following routes require admin authentication:

- `/admin` - Admin Panel for managing products and categories
- `/messages` - View customer support messages

Attempting to access these routes without authentication will redirect to the login page.

## Admin Functionality

Once authenticated, admins can:

### Product Management
- View all existing products
- Create new products with images, descriptions, and categories
- Edit existing product information
- Delete products

### Category Management
- View all product categories
- Create new categories
- Edit category information

### Message Management
- View customer support messages from the contact form
- Monitor customer inquiries and support requests

## Security Features

### Backend Security
- JWT token-based authentication with bcrypt password hashing
- All admin API endpoints protected with JWT middleware
- Secure httpOnly cookie storage for tokens
- 24-hour token expiration

### Frontend Security
- No admin credentials exposed in client code
- Protected routes with automatic redirection
- Authentication context for state management
- Proper session cleanup on logout

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current user info

### Protected Admin Endpoints
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/:id` - Update product (requires auth)
- `DELETE /api/products/:id` - Delete product (requires auth)
- `POST /api/categories` - Create category (requires auth)
- `PUT /api/categories/:id` - Update category (requires auth)
- `DELETE /api/categories/:id` - Delete category (requires auth)
- `GET /api/messages` - Get messages (requires auth)

### Public Endpoints
- `GET /api/products` - View products
- `GET /api/categories` - View categories
- `POST /api/messages` - Submit contact message

## Development Notes

### Environment Variables
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
```

### CORS Configuration
The server is configured to accept credentials from:
- Development: `http://localhost:3000`
- Production: `https://www.twinklesjewellery.in`

## Troubleshooting

### Common Issues

1. **"Invalid credentials" error**
   - Verify you're using the correct email and password
   - Check for typos in the credentials

2. **Redirected to login unexpectedly**
   - Your session may have expired (24-hour limit)
   - Simply log in again to continue

3. **Admin links not visible**
   - Ensure you're properly logged in
   - Check that your session hasn't expired

4. **API authentication errors**
   - Clear your browser cookies and log in again
   - Check that the server is running and accessible

5. **Session lost on page refresh (Fixed)**
   - This issue has been resolved with improved cookie settings
   - Development uses `SameSite=Lax` for better local compatibility
   - Production uses `SameSite=None; Secure` for cross-site support
   - If you still experience issues, ensure:
     - CORS is properly configured with `credentials: true`
     - Frontend includes `credentials: 'include'` in fetch requests
     - Browser is not blocking third-party cookies (in production)

### Cookie and CORS Configuration

**For Developers:**
- The application uses httpOnly cookies for secure token storage
- Cookie settings automatically adjust based on NODE_ENV:
  - **Development**: `SameSite=Lax` (more permissive for localhost)
  - **Production**: `SameSite=None; Secure` (required for cross-site requests)
- All API requests must include `credentials: 'include'` to send cookies
- CORS is configured to accept credentials from whitelisted origins

**If experiencing cookie issues:**
1. Check browser developer tools > Application > Cookies
2. Verify the `adminToken` cookie is set with correct flags
3. Ensure the frontend and backend origins are in the CORS whitelist
4. Test in an incognito window to rule out browser extensions

## Migration from Previous System

The previous admin toggle system has been completely removed:
- No more client-side admin mode switching
- No more `REACT_APP_ADMIN_KEY` environment variable needed
- All admin functionality now requires proper authentication
- More secure and follows authentication best practices