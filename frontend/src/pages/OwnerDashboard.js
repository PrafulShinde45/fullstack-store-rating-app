import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Store, Star, People } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStoreData = useCallback(async () => {
    try {
      setLoading(true);
      // Get store owned by current user
      const storesResponse = await api.get('/stores', {
        params: { ownerId: user.id }
      });
      
      if (storesResponse.data.length === 0) {
        setError('No store found for this account');
        return;
      }

      const store = storesResponse.data[0];
      
      // Get ratings for this store
      const ratingsResponse = await api.get(`/ratings/store/${store.id}`);
      setStoreData({
        store,
        ratings: ratingsResponse.data.ratings || [],
        averageRating: ratingsResponse.data.averageRating || 0,
        totalRatings: ratingsResponse.data.totalRatings || 0
      });
    } catch (error) {
      setError('Failed to load store data');
      console.error('Store data error:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!storeData) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          No store found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Store Owner Dashboard
      </Typography>

      {/* Store Information */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Store sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {storeData.store.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {storeData.store.address}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {storeData.averageRating}
                  </Typography>
                  <Typography color="text.secondary">
                    Average Rating ({storeData.totalRatings} ratings)
                  </Typography>
                </Box>
              </Box>
              <Rating 
                value={storeData.averageRating} 
                readOnly 
                precision={0.1}
                size="large"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ratings Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <People sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
            <Typography variant="h6">
              Users Who Rated Your Store
            </Typography>
          </Box>

          {storeData.ratings.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No ratings yet for your store.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storeData.ratings.map((rating) => (
                    <TableRow key={rating.id}>
                      <TableCell>{rating.user?.name || 'Unknown User'}</TableCell>
                      <TableCell>{rating.user?.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Rating value={rating.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({rating.rating}/5)
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default OwnerDashboard; 