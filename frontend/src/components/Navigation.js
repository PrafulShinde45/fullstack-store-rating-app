import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { AccountCircle, Store, People, Star, Logout } from '@mui/icons-material';

const Navigation = () => {
  const { user, logout, isAdmin, isOwner, isUser } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Store Ratings Platform
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Navigation buttons based on role */}
          {isAdmin() && (
            <>
              <Button 
                color="inherit" 
                startIcon={<People />}
                onClick={() => navigate('/admin/users')}
              >
                Users
              </Button>
              <Button 
                color="inherit" 
                startIcon={<Store />}
                onClick={() => navigate('/admin/stores')}
              >
                Stores
              </Button>
              <Button 
                color="inherit" 
                startIcon={<Star />}
                onClick={() => navigate('/admin/dashboard')}
              >
                Dashboard
              </Button>
            </>
          )}

          {isUser() && (
            <>
              <Button 
                color="inherit" 
                startIcon={<Store />}
                onClick={() => navigate('/stores')}
              >
                Stores
              </Button>
              <Button 
                color="inherit" 
                startIcon={<Star />}
                onClick={() => navigate('/my-ratings')}
              >
                My Ratings
              </Button>
            </>
          )}

          {isOwner() && (
            <>
              <Button 
                color="inherit" 
                startIcon={<Star />}
                onClick={() => navigate('/owner/dashboard')}
              >
                My Store
              </Button>
            </>
          )}

          {/* User menu */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 