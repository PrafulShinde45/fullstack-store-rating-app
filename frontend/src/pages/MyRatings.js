import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Rating,
  Box,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const MyRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRatings();
  }, []);

  const fetchMyRatings = async () => {
    try {
      const response = await api.get('/ratings/user');
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching my ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      await api.delete(`/ratings/${ratingId}`);
      setRatings(ratings.filter(rating => rating.id !== ratingId));
    } catch (error) {
      console.error('Error deleting rating:', error);
    }
  };

  const handleUpdateRating = async (ratingId, newRating) => {
    try {
      await api.put(`/ratings/${ratingId}`, { rating: newRating });
      setRatings(ratings.map(rating => 
        rating.id === ratingId ? { ...rating, rating: newRating } : rating
      ));
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          Loading your ratings...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Ratings
      </Typography>

      {ratings.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          You haven't rated any stores yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {ratings.map((rating) => (
            <Grid xs={12} sm={6} md={4} key={rating.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {rating.store?.name || 'Store Name'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {rating.store?.address || 'Store Address'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Your rating:
                    </Typography>
                    <Rating
                      value={rating.rating}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          handleUpdateRating(rating.id, newValue);
                        }
                      }}
                      size="small"
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Rated on: {new Date(rating.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteRating(rating.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Button size="small" color="primary">
                    View Store
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyRatings; 