# Store Rating Application

A full-stack web application where users can rate and review stores. Built with React, Node.js, and PostgreSQL.

**🔗 Live Demo:** https://fullstack-store-rating-app-vvxn.onrender.com/  
*Note: Initial load may take up to 40 seconds due to free-tier hosting.*

## 🚀 Key Features Implemented

✅ **User Authentication & Authorization**  
- JWT-based authentication system  
- Role-based access control (Admin, Store Owner, Normal User)  
- Secure password hashing with bcrypt  

✅ **Store Management System**  
- Create, view, and manage stores  
- Store search and filtering  
- Store owner dashboard with ratings analytics  

✅ **Rating & Review System**  
- 1–5 star rating system  
- User rating history  
- Average rating calculations  

✅ **Admin Dashboard**  
- User and store management  
- Dashboard with analytics and statistics  
- Real-time data visualization  

✅ **Responsive Design**  
- Mobile-friendly UI  
- Built with Material-UI components  
- Modern and intuitive user experience  

## What it does

- Users can register and login
- Browse and search stores
- Rate stores from 1 to 5 stars
- View store ratings and reviews
- Different user roles (Admin, User, Store Owner)

## Technologies Used

### Frontend
- React.js
- Material-UI
- React Router
- Axios for API calls

### Backend
- Node.js
- Express.js
- PostgreSQL database
- JWT for authentication

## How to run locally

1. Install all dependencies:
```bash
npm run install-all
```

2. Seed the database with test accounts:
```bash
npm run seed
```

3. Start the development servers:
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000).

## Test Accounts

After running the seed script, you can login with these accounts:

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** System Administrator
- **Access:** Full admin dashboard, user management, store management

### Store Owner Account
- **Email:** storeowner@example.com
- **Password:** owner123
- **Role:** Store Owner
- **Access:** View ratings for their stores, store dashboard

### Normal User Account
- **Email:** user@example.com
- **Password:** user123
- **Role:** Normal User
- **Access:** Browse stores, rate stores, view store details

## Sample Data

The seed script creates:
- **3 Test Users** (Admin, Store Owner, Normal User)
- **3 Sample Stores** (Tech Store, Food Market, Book Shop)
- **5 Sample Ratings** (various ratings from users)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `PUT /api/auth/update-password` - Change password

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/dashboard/stats` - Get statistics

### Stores
- `GET /api/stores` - Get all stores
- `POST /api/stores` - Create new store (Admin only)
- `GET /api/stores/:id` - Get store details

### Ratings
- `POST /api/ratings` - Submit a rating
- `PUT /api/ratings` - Update rating
- `GET /api/ratings/user` - Get user's ratings

## User Roles

### Admin
- Can see all users and stores
- Can create new users and stores
- Has access to dashboard with statistics

### Normal User
- Can browse stores
- Can rate stores
- Can view store details and ratings

### Store Owner
- Can see ratings for their stores
- Has a dashboard for their stores

## Database Tables

### Users
- id, name, email, password, address, role, createdAt, updatedAt

### Stores
- id, name, email, address, ownerId, createdAt, updatedAt

### Ratings
- id, userId, storeId, rating, createdAt, updatedAt

## Environment Variables

See [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) for setup instructions.

## License

MIT 
