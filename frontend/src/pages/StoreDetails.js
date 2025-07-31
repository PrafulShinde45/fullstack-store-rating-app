import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Rating,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ArrowBack, Store as StoreIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [ratingError, setRatingError] = useState('');

  const fetchStoreDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stores/${id}`);
      setStore(response.data);
      
      // Get user's rating if logged in
      if (user) {
        try {
          const ratingsResponse = await api.get('/ratings/user');
          const userRatingRecord = ratingsResponse.data.find(r => r.storeId === parseInt(id));
          if (userRatingRecord) {
            setUserRating(userRatingRecord.rating);
          }
        } catch (error) {
          console.error('Error fetching user rating:', error);
        }
      }
    } catch (error) {
      setError('Store not found or error loading store details');
      console.error('Error fetching store details:', error);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchStoreDetails();
  }, [fetchStoreDetails]);

  const handleRateStore = async (rating) => {
    try {
      setRatingError('');
      await api.post('/ratings', { storeId: parseInt(id), rating });
      setUserRating(rating);
      // Refresh store details to update average rating
      await fetchStoreDetails();
    } catch (error) {
      console.error('Error rating store:', error);
      setRatingError(error.response?.data?.message || 'Error submitting rating');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !store) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Store not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/stores')}
          sx={{ mt: 2 }}
        >
          Back to Stores
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/stores')}
        sx={{ mb: 3 }}
      >
        Back to Stores
      </Button>

      <Grid container spacing={3}>
        {/* Store Information */}
        <Grid xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <StoreIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {store.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {store.address}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating
                  value={store.averageRating || 0}
                  readOnly
                  precision={0.5}
                  size="large"
                />
                <Typography variant="h6" sx={{ ml: 2 }}>
                  {store.averageRating || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({store.totalRatings || 0} ratings)
                </Typography>
              </Box>

              {user && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Rate this store:
                  </Typography>
                  <Rating
                    value={userRating}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handleRateStore(newValue);
                      }
                    }}
                    size="large"
                  />
                  {ratingError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {ratingError}
                    </Alert>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Store Owner Information */}
        <Grid xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Store Owner
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {store.owner?.name || 'Unknown Owner'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {store.owner?.email || 'No email available'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Store Email
              </Typography>
              <Typography variant="body1">
                {store.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StoreDetails; 