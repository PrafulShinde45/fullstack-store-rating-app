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
  console.log('⚠️ Frontend build not found. Serving API only.');
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
    // Debug: Log all environment variables
    console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
    console.log('All env vars:', Object.keys(process.env));
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('PORT:', process.env.PORT);
    console.log('===================================');
    
    // Check if database environment variables are available
    if (!process.env.DB_HOST || !process.env.DB_NAME) {
      console.log('❌ Database environment variables not set. Starting server without database...');
      console.log('Available DB env vars:', Object.keys(process.env).filter(key => key.startsWith('DB_')));
      console.log('💡 Make sure you have created a PostgreSQL database service named "store-rating-db" on Render');
      
      app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT} (WITHOUT DATABASE)`);
        console.log('🌐 Your React app will be available, but API calls will fail');
        console.log('📋 Next steps:');
        console.log('   1. Go to Render Dashboard');
        console.log('   2. Create PostgreSQL service named "store-rating-db"');
        console.log('   3. Redeploy this service');
      });
      return;
    }
    
    console.log('🔌 Attempting database connection...');
    console.log('📍 DB_HOST:', process.env.DB_HOST);
    console.log('📊 DB_NAME:', process.env.DB_NAME);
    
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log('🎉 Full application is ready!');
    });
  } catch (error) {
    console.error('❌ Database sync error:', error);
    console.log('⚠️ Starting server without database connection...');
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT} (DATABASE CONNECTION FAILED)`);
      console.log('🔧 Database troubleshooting:');
      console.log('   - Check if PostgreSQL service exists on Render');
      console.log('   - Verify service name is "store-rating-db"');
      console.log('   - Ensure database is in "Available" status');
    });
  }
}

startServer(); 