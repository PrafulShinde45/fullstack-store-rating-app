const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
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
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

// Database sync and server start
async function startServer() {
  try {
    // Check if database environment variables are available
    if (!process.env.DB_HOST || !process.env.DB_NAME) {
      console.log('Database environment variables not set. Starting server without database...');
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('DB_')));
      
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (WITHOUT DATABASE)`);
        console.log('Please create the PostgreSQL database service on Render and redeploy.');
      });
      return;
    }
    
    console.log('Attempting database connection...');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database sync error:', error);
    console.log('Starting server without database connection...');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (DATABASE CONNECTION FAILED)`);
      console.log('Please check database configuration and redeploy.');
    });
  }
}

startServer(); 