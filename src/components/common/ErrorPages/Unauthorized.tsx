import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../../types/auth';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoToDashboard = () => {
    if (user?.role) {
      const dashboardPath = getRoleBasedDashboard(user.role);
      navigate(dashboardPath);
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
    }
  };

  const getRoleBasedDashboard = (role: UserRole): string => {
    switch (role) {
      case UserRole.Admin:
        return '/admin';
      case UserRole.Student:
        return '/student';
      case UserRole.Parent:
        return '/parent';
      case UserRole.Faculty:
        return '/faculty';
      default:
        return '/';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3
      }}
    >
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          maxWidth: 500,
          width: '100%'
        }}
      >
        <BlockIcon
          sx={{
            fontSize: 80,
            color: 'warning.main',
            mb: 3
          }}
        />
        
        <Typography variant="h3" component="h1" gutterBottom>
          403
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom>
          Access Denied
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You don't have permission to access this page.
        </Typography>
        
        {user && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Current role: <strong>{user.role}</strong>
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {user ? (
            <Button
              variant="contained"
              onClick={handleGoToDashboard}
              size="large"
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              size="large"
            >
              Go Home
            </Button>
          )}
          
          <Button
            variant="outlined"
            onClick={handleLogout}
            size="large"
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Unauthorized;