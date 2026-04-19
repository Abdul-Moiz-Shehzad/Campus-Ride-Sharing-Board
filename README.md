# Campus Ride-Sharing Board - Full Stack Setup Guide

## Overview
This application consists of:
- **Frontend**: React with Redux (runs on port 3000)
- **Backend**: Node.js/Express with MongoDB (runs on port 5000)
- **Database**: MongoDB (runs on port 27017)

## Prerequisites
- Node.js (v14+)
- MongoDB Community Edition
- npm or yarn

## Installation & Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd src/..
npm install
```

### Step 3: Start MongoDB

**On Windows:**
```bash
mongod
```

MongoDB should start on port 27017. Leave this terminal open.

**On Mac/Linux:**
```bash
brew services start mongodb-community
```

### Step 4: Start the Backend Server

Open a new terminal in the project root:

```bash
cd backend
npm start
```

The backend should start on `http://localhost:5000`. You should see:
```
Server is running on port 5000
MongoDB Connected: localhost
```

### Step 5: Start the Frontend Development Server

Open another new terminal in the project root:

```bash
npm start
```

The frontend should automatically open at `http://localhost:3000`

## API Endpoints

### User Routes (`/api/users`)
- `POST /register` - Register a new user
  - Body: `{ username, password, confirmPassword, phone }`
- `POST /login` - Login user
  - Body: `{ username, password }`
- `GET /profile` - Get current user profile (requires auth)
- `PUT /profile` - Update profile (requires auth)
  - Body: `{ username, phone, password, confirmPassword }`

### Ride Routes (`/api/rides`)
- `GET /` - Get all active rides
- `GET /:id` - Get ride details
- `POST /` - Create a new ride (requires auth)
  - Body: `{ pickup, destination, departureTime, availableSeats, vehicleType, notes }`
- `PUT /:id` - Update ride (requires auth, owner only)
- `DELETE /:id` - Delete ride (requires auth, owner only)
- `POST /book` - Book a ride (requires auth)
  - Body: `{ rideId }`
- `GET /bookings/my-bookings` - Get user's ride bookings (requires auth)

### Request Routes (`/api/requests`)
- `GET /` - Get all open ride requests
- `GET /:id` - Get request details
- `POST /` - Create ride request (requires auth)
  - Body: `{ pickup, destination, departureTime, vehicleType, notes }`
- `PUT /:id` - Update request (requires auth, owner only)
- `DELETE /:id` - Delete request (requires auth, owner only)
- `POST /fulfill` - Respond to request (requires auth)
  - Body: `{ requestId }`
- `GET /responses/my-responses` - Get user's responses (requires auth)

## Authentication

The app uses JWT (JSON Web Tokens) for authentication:

1. When users register or login, they receive a token
2. The token is stored in localStorage
3. Token is sent in the `Authorization` header for protected routes
4. Token expires in 7 days

## Testing the Application

### 1. Register a New User
- Go to `http://localhost:3000/register`
- Fill in username, phone, password
- Click Register

### 2. Login
- Go to `http://localhost:3000/login`
- Enter credentials
- Click Login

### 3. View Dashboard
- After login, you'll see the dashboard
- Shows your bookings, posted rides, and requests

### 4. Post a Ride
- Click "Post New Ride" button
- Fill in details (pickup, destination, time, seats, vehicle type)
- Click "Post Ride"

### 5. Request a Ride
- Click "Request Ride" button
- Fill in details
- Click "Submit Request"

### 6. Browse All Rides
- Click "View All Rides"
- See available rides and requests
- Filter by location, vehicle type, or time
- Click "Book Ride" or "Respond to Request"

### 7. Update Profile
- Click "My Profile"
- Update username, phone, or password
- Click "Save Changes"

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-ride-sharing
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check if port 27017 is available
- Verify MongoDB connection string in backend/.env

### Backend won't start
- Delete node_modules and package-lock.json
- Run `npm install` again
- Make sure all ports (3000, 5000) are available

### Frontend shows "Cannot find module"
- Run `npm install` in root directory
- Clear browser cache (Ctrl+F5)

### Authentication Issues
- Check if token is stored in localStorage (DevTools > Application)
- Verify JWT_SECRET is set in backend/.env
- Check API response in network tab (DevTools > Network)

## Database Schema

### User Collection
- username (unique, string)
- password (hashed, string)
- phone (string)
- timestamps (created/updated)

### Ride Collection
- driverName (string)
- createdBy (ObjectId, ref to User)
- pickup (string)
- destination (string)
- departureTime (string)
- availableSeats (number)
- vehicleType (enum: Car, Bike, Van, SUV)
- contactInfo (string)
- notes (string)
- status (enum: active, completed, cancelled)
- timestamps

### RideRequest Collection
- userId (ObjectId, ref to User)
- name (string)
- phone (string)
- pickup (string)
- destination (string)
- departureTime (string)
- vehicleType (enum)
- notes (string)
- status (enum: open, fulfilled, cancelled)
- fulfilledBy (ObjectId, ref to User)
- timestamps

### Booking Collection
- type (enum: ride, request)
- rideId (ObjectId, ref to Ride, optional)
- requestId (ObjectId, ref to RideRequest, optional)
- userId (ObjectId, ref to User)
- ownerId (ObjectId, ref to User)
- pickup (string)
- destination (string)
- departureTime (string)
- vehicleType (string)
- status (enum: active, completed, cancelled)
- timestamps

## Frontend Architecture (Preserved)

The frontend maintains the original structure:
- **Pages**: Landing, Login, Register, Dashboard, Rides, RideDetails, NewRide, RequestRide, Profile
- **Redux Store**: user and ride slices
- **Routing**: React Router v7
- **UI**: CSS-based styling

## Backend Architecture

- **Config**: Database connection configuration
- **Models**: MongoDB Mongoose schemas (User, Ride, RideRequest, Booking)
- **Controllers**: Business logic for users, rides, and requests
- **Routes**: Express route handlers
- **Middleware**: Authentication middleware (JWT verification)

## Notes

- The frontend localStorage stores the JWT token for each user session
- The Redux store is still used for managing local state and caching
- All sensitive operations (posting rides, booking, etc.) require authentication
- Passwords are hashed using bcryptjs before storing in database
- The app handles both ride posting and ride request workflows

## Next Steps for Production

1. Change JWT_SECRET to a strong value
2. Set NODE_ENV to "production"
3. Deploy backend to a hosting service (Heroku, AWS, etc.)
4. Deploy frontend to a static hosting service (Vercel, Netlify, etc.)
5. Update REACT_APP_API_URL to point to production backend
6. Set up HTTPS/SSL certificates
7. Configure CORS for frontend domain
8. Implement rate limiting
9. Add input validation and sanitization
10. Set up logging and monitoring