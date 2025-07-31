const sequelize = require('./config/database');
const { User, Store, Rating } = require('./models');

async function syncDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models with database
    console.log('Creating tables...');
    await sequelize.sync({ force: true });
    console.log('Database synced successfully!');
    console.log('Tables created: users, stores, ratings');
    
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase(); 