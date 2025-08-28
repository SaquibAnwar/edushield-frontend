import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Box
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../../types/auth';

interface NavigationProps {
  onSidebarToggle: () => void;
  isSidebarOpen: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ onSidebarToggle }) => {
  const { user, logout, getUserInitials, getDisplayName } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await logout();
      // Explicitly navigate to home page after logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, navigate to home
      navigate('/', { replace: true });
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return 'Administrator';
      case UserRole.Faculty:
        return 'Faculty';
      case UserRole.Parent:
        return 'Parent';
      case UserRole.Student:
        return 'Student';
      default:
        return 'User';
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'white',
        color: 'text.primary',
        boxShadow: 1
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onSidebarToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          EduShield
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {getRoleDisplayName(user.role)}
            </Typography>
            
            <Button
              onClick={handleUserMenuOpen}
              startIcon={
                user.profilePictureUrl ? (
                  <Avatar 
                    src={user.profilePictureUrl} 
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {getUserInitials()}
                  </Avatar>
                )
              }
              sx={{ textTransform: 'none' }}
            >
              {getDisplayName()}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleUserMenuClose}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;