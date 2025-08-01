import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  TextField,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Search as SearchIcon, Store as StoreIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Stores = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const [ratingError, setRatingError] = useState('');

  const fetchStores = useCallback(async () => {
    try {
      const response = await api.get('/stores');
      
      // Handle different response structures
      let storesData = [];
      if (response.data && response.data.stores) {
        storesData = response.data.stores;
      } else if (Array.isArray(response.data)) {
        storesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        storesData = response.data.data;
      }
      
      setStores(storesData || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserRatings = useCallback(async () => {
    try {
      const response = await api.get('/ratings/user');
      const ratingsMap = {};
      
      // Handle different response structures
      let ratingsData = [];
      if (Array.isArray(response.data)) {
        ratingsData = response.data;
      } else if (response.data && Array.isArray(response.data.ratings)) {
        ratingsData = response.data.ratings;
      } else if (response.data && Array.isArray(response.data.data)) {
        ratingsData = response.data.data;
      }
      
      ratingsData.forEach(rating => {
        ratingsMap[rating.storeId] = rating.rating;
      });
      setUserRatings(ratingsMap);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      setUserRatings({});
    }
  }, []);

  useEffect(() => {
    fetchStores();
    if (user) {
      fetchUserRatings();
    }
  }, [user, fetchStores, fetchUserRatings]);

  const handleRateStore = async (storeId, rating) => {
    try {
      setRatingError('');
      await api.post('/ratings', { storeId, rating });
      setUserRatings(prev => ({ ...prev, [storeId]: rating }));
      // Refresh stores to update average rating and count
      await fetchStores();
    } catch (error) {
      console.error('Error rating store:', error);
      setRatingError(error.response?.data?.message || 'Error submitting rating');
    }
  };

  const handleViewDetails = (storeId) => {
    navigate(`/stores/${storeId}`);
  };

  const filteredStores = (stores || []).filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          Loading stores...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Stores
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search stores by name or address..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {ratingError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {ratingError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredStores.map((store) => (
          <Grid xs={12} sm={6} md={4} key={store.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StoreIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" gutterBottom>
                    {store.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {store.address}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={store.averageRating || 0}
                    readOnly
                    precision={0.5}
                    size="small"
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({store.totalRatings || 0} ratings)
                  </Typography>
                </Box>

                {user && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Your rating:
                    </Typography>
                    <Rating
                      value={userRatings[store.id] || 0}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          handleRateStore(store.id, newValue);
                        }
                      }}
                      size="small"
                    />
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewDetails(store.id)}
                  startIcon={<StoreIcon />}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredStores.length === 0 && (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          No stores found.
        </Typography>
      )}
    </Container>
  );
};

export default Stores; 