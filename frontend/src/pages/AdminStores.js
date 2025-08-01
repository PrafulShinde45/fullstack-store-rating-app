import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Sort as SortIcon 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AddStoreDialog from '../components/AddStoreDialog';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [selectedStore, setSelectedStore] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addStoreDialogOpen, setAddStoreDialogOpen] = useState(false);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        sortBy,
        sortOrder,
      };
      const response = await api.get('/stores', { params });
      
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
      setError('Failed to load stores');
      console.error('Stores error:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNameFilterChange = useCallback((e) => {
    handleFilterChange('name', e.target.value);
  }, [handleFilterChange]);

  const handleEmailFilterChange = useCallback((e) => {
    handleFilterChange('email', e.target.value);
  }, [handleFilterChange]);

  const handleAddressFilterChange = useCallback((e) => {
    handleFilterChange('address', e.target.value);
  }, [handleFilterChange]);

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  }, [sortBy, sortOrder]);

  const handleViewStore = useCallback((store) => {
    setSelectedStore(store);
    setViewDialogOpen(true);
  }, []);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Store Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddStoreDialogOpen(true)}
        >
          Add Store
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Store Name"
              value={filters.name}
              onChange={handleNameFilterChange}
              size="small"
            />
            <TextField
              label="Email"
              value={filters.email}
              onChange={handleEmailFilterChange}
              size="small"
            />
            <TextField
              label="Address"
              value={filters.address}
              onChange={handleAddressFilterChange}
              size="small"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Stores Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Button
                  startIcon={<SortIcon />}
                  onClick={() => handleSort('name')}
                  sx={{ textTransform: 'none' }}
                >
                  Name {sortBy === 'name' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  startIcon={<SortIcon />}
                  onClick={() => handleSort('email')}
                  sx={{ textTransform: 'none' }}
                >
                  Email {sortBy === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </Button>
              </TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(stores || []).map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.email}</TableCell>
                <TableCell>{store.address}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={store.averageRating || 0} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({store.totalRatings || 0})
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewStore(store)}
                  >
                    <ViewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Store Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Store Details</DialogTitle>
        <DialogContent>
          {selectedStore && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedStore.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Email:</strong> {selectedStore.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Address:</strong> {selectedStore.address}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Owner:</strong> {selectedStore.owner?.name || 'Unknown'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Average Rating:</strong> 
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating 
                    value={selectedStore.averageRating || 0} 
                    readOnly 
                    precision={0.1}
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({selectedStore.totalRatings || 0} ratings)
                  </Typography>
                </Box>
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Created:</strong> {new Date(selectedStore.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Store Dialog */}
      <AddStoreDialog
        open={addStoreDialogOpen}
        onClose={() => setAddStoreDialogOpen(false)}
        onStoreAdded={fetchStores}
      />
    </Container>
  );
};

export default AdminStores; 