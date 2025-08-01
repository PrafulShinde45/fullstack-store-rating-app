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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Sort as SortIcon 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AddUserDialog from '../components/AddUserDialog';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        sortBy,
        sortOrder,
      };
      const response = await api.get('/users', { params });
      
      // Handle different response structures
      let usersData = [];
      if (response.data && response.data.users) {
        usersData = response.data.users;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      }
      
      setUsers(usersData || []);
    } catch (error) {
      setError('Failed to load users');
      console.error('Users error:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const handleRoleFilterChange = useCallback((e) => {
    handleFilterChange('role', e.target.value);
  }, [handleFilterChange]);

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  }, [sortBy, sortOrder]);

  const handleViewUser = useCallback((user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'owner': return 'warning';
      default: return 'primary';
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddUserDialogOpen(true)}
        >
          Add User
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
              label="Name"
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
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={filters.role}
                label="Role"
                onChange={handleRoleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="owner">Owner</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Users Table */}
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
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(users || []).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewUser(user)}
                  >
                    <ViewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedUser.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Email:</strong> {selectedUser.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Address:</strong> {selectedUser.address}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Role:</strong> 
                <Chip 
                  label={selectedUser.role} 
                  color={getRoleColor(selectedUser.role)}
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Member since:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}
              </Typography>
              
              {selectedUser.role === 'owner' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Store Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Store details would be displayed here for store owners
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <AddUserDialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        onUserAdded={fetchUsers}
      />
    </Container>
  );
};

export default AdminUsers; 