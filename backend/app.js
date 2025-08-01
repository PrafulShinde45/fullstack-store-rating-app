const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const { User, Store, Rating } = require('./models');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/ratings', require('./routes/ratings'));

// Serve static files from the React app build directory
const buildPath = path.join(__dirname, '../frontend/build');
const indexPath = path.join(buildPath, 'index.html');

// Check if frontend build exists
if (require('fs').existsSync(buildPath)) {
  app.use(express.static(buildPath));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Store Rating API is running',
      status: 'Frontend build not available',
      endpoints: ['/api/auth', '/api/users', '/api/stores', '/api/ratings']
    });
  });
}

const PORT = process.env.PORT || 5000;

// Database sync and server start
async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    
    // Check if database is empty and seed if needed (only in production)
    if (process.env.NODE_ENV === 'production') {
      const userCount = await User.count();
      if (userCount === 0) {
        console.log('Database is empty, seeding with test data...');
        
        // Create test users
        const users = [
          {
            name: 'Administrator User Account',
            email: 'admin@example.com',
            password: await bcrypt.hash('admin123', 10),
            address: 'Administrator Address Location',
            role: 'admin'
          },
          {
            name: 'Store Owner User Account',
            email: 'storeowner@example.com',
            password: await bcrypt.hash('owner123', 10),
            address: 'Store Owner Address Location',
            role: 'owner'
          },
          {
            name: 'Normal User Account',
            email: 'user@example.com',
            password: await bcrypt.hash('user123', 10),
            address: 'Normal User Address Location',
            role: 'user'
          }
        ];

        // Create users
        const createdUsers = await User.bulkCreate(users);

        // Create some sample stores
        const stores = [
          {
            name: 'Tech Store',
            email: 'tech@store.com',
            address: '123 Tech Street, Digital City',
            ownerId: createdUsers[1].id // Store owner
          },
          {
            name: 'Food Market',
            email: 'food@market.com',
            address: '456 Food Avenue, Tasty Town',
            ownerId: createdUsers[1].id // Store owner
          },
          {
            name: 'Book Shop',
            email: 'books@shop.com',
            address: '789 Book Lane, Reading City',
            ownerId: createdUsers[1].id // Store owner
          }
        ];

        // Create stores
        const createdStores = await Store.bulkCreate(stores);

        // Create some sample ratings
        const ratings = [
          {
            userId: createdUsers[2].id, // Normal user
            storeId: createdStores[0].id, // Tech Store
            rating: 4
          },
          {
            userId: createdUsers[2].id, // Normal user
            storeId: createdStores[1].id, // Food Market
            rating: 5
          },
          {
            userId: createdUsers[2].id, // Normal user
            storeId: createdStores[2].id, // Book Shop
            rating: 3
          },
          {
            userId: createdUsers[0].id, // Admin
            storeId: createdStores[0].id, // Tech Store
            rating: 4
          },
          {
            userId: createdUsers[0].id, // Admin
            storeId: createdStores[1].id, // Food Market
            rating: 4
          }
        ];

        // Create ratings
        await Rating.bulkCreate(ratings);
        console.log('Database seeded successfully');
      }
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database sync error:', error);
    process.exit(1);
  }
}

startServer(); 