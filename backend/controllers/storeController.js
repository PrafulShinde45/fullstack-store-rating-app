const { Store, User, Rating } = require('../models');
const { Op } = require('sequelize');

const getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    let whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating'],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    // Calculate average rating for each store
    const storesWithRating = stores.map(store => {
      const storeData = store.toJSON();
      const ratings = storeData.ratings || [];
      const averageRating = ratings.length > 0 
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;
      
      return {
        ...storeData,
        averageRating: parseFloat(averageRating),
        totalRatings: ratings.length,
      };
    });

    res.json(storesWithRating);
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerName, ownerEmail, ownerPassword, ownerAddress } = req.body;

    // Check if store already exists
    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ message: 'Store already exists' });
    }

    // Check if owner email already exists
    const existingOwner = await User.findOne({ where: { email: ownerEmail } });
    if (existingOwner) {
      return res.status(400).json({ message: 'Owner email already exists' });
    }

    // Create new store owner
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(ownerPassword, saltRounds);

    const owner = await User.create({
      name: ownerName,
      email: ownerEmail,
      password: hashedPassword,
      address: ownerAddress,
      role: 'owner',
    });

    // Create store
    const store = await Store.create({
      name,
      email,
      address,
      ownerId: owner.id,
    });

    res.status(201).json({
      message: 'Store and owner created successfully',
      store: {
        ...store.toJSON(),
        owner: {
          id: owner.id,
          name: owner.name,
          email: owner.email,
        },
      },
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const store = await Store.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['id', 'rating', 'createdAt'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Calculate average rating
    const storeData = store.toJSON();
    const ratings = storeData.ratings || [];
    const averageRating = ratings.length > 0 
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    // Get user's rating if logged in
    let userRating = null;
    if (userId) {
      const userRatingRecord = await Rating.findOne({
        where: { userId, storeId: id },
      });
      if (userRatingRecord) {
        userRating = userRatingRecord.rating;
      }
    }

    res.json({
      ...storeData,
      averageRating: parseFloat(averageRating),
      totalRatings: ratings.length,
      userRating,
    });
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const searchStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    
    let whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating'],
        },
      ],
    });

    // Calculate average rating for each store
    const storesWithRating = stores.map(store => {
      const storeData = store.toJSON();
      const ratings = storeData.ratings || [];
      const averageRating = ratings.length > 0 
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;
      
      return {
        ...storeData,
        averageRating: parseFloat(averageRating),
        totalRatings: ratings.length,
      };
    });

    res.json(storesWithRating);
  } catch (error) {
    console.error('Search stores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllStores,
  createStore,
  getStoreById,
  searchStores,
}; 