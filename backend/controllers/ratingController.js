const { Rating, Store, User } = require('../models');

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: { userId, storeId },
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this store' });
    }

    // Create rating
    const newRating = await Rating.create({
      userId,
      storeId,
      rating,
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating,
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Find existing rating
    const existingRating = await Rating.findOne({
      where: { userId, storeId },
    });

    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Update rating
    await existingRating.update({ rating });

    res.json({
      message: 'Rating updated successfully',
      rating: existingRating,
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // If user is store owner, verify ownership
    if (req.user.role === 'owner' && store.ownerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get all ratings for the store
    const ratings = await Rating.findAll({
      where: { storeId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Calculate average rating
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? (totalRating / ratings.length).toFixed(1) : 0;

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      ratings,
      averageRating: parseFloat(averageRating),
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    const ratings = await Rating.findAll({
      where: { userId },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'email', 'address'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(ratings);
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findByPk(id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Check if user owns this rating
    if (rating.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await rating.destroy();

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  submitRating,
  updateRating,
  getStoreRatings,
  getUserRatings,
  deleteRating,
}; 