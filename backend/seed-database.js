const sequelize = require('./config/database');
const { User, Store, Rating } = require('./models');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });

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
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 