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
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database sync error:', error);
    process.exit(1);
  }
}

startServer(); 