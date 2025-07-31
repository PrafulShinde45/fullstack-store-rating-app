import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Stack,
  Typography,
} from '@mui/material';
import api from '../services/api';

const AddStoreDialog = ({ open, onClose, onStoreAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    ownerAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.address || 
        !formData.ownerName || !formData.ownerEmail || !formData.ownerPassword || !formData.ownerAddress) {
      setError('All fields are required');
      return;
    }

    if (formData.name.length < 2) {
      setError('Store name must be at least 2 characters long');
      return;
    }

    if (formData.ownerPassword.length < 8) {
      setError('Owner password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/stores', formData);
      setSuccess('Store and owner created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        address: '',
        ownerName: '',
        ownerEmail: '',
        ownerPassword: '',
        ownerAddress: '',
      });

      // Call callback to refresh stores list
      if (onStoreAdded) {
        onStoreAdded();
      }

      // Close dialog after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      address: '',
      ownerName: '',
      ownerEmail: '',
      ownerPassword: '',
      ownerAddress: '',
    });
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add New Store
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Store Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              variant="outlined"
              placeholder="Enter store name"
              helperText="Store name must be at least 2 characters long"
            />
            
            <TextField
              fullWidth
              label="Store Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              variant="outlined"
              placeholder="Enter store email address"
            />
            
            <TextField
              fullWidth
              label="Store Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              variant="outlined"
              multiline
              rows={3}
              placeholder="Enter store address"
            />
            
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Store Owner Information
            </Typography>
            
            <TextField
              fullWidth
              label="Owner Name"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              required
              variant="outlined"
              placeholder="Enter owner's full name"
            />
            
            <TextField
              fullWidth
              label="Owner Email"
              name="ownerEmail"
              type="email"
              value={formData.ownerEmail}
              onChange={handleInputChange}
              required
              variant="outlined"
              placeholder="Enter owner's email address"
            />
            
            <TextField
              fullWidth
              label="Owner Password"
              name="ownerPassword"
              type="password"
              value={formData.ownerPassword}
              onChange={handleInputChange}
              required
              variant="outlined"
              placeholder="Enter owner's password"
              helperText="Password must be at least 8 characters long"
            />
            
            <TextField
              fullWidth
              label="Owner Address"
              name="ownerAddress"
              value={formData.ownerAddress}
              onChange={handleInputChange}
              required
              variant="outlined"
              multiline
              rows={2}
              placeholder="Enter owner's address"
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Store & Owner'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddStoreDialog; 