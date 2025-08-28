import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { routeConfigs, hasRouteAccess } from '../../../routes';


export const RouteTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const testRoutes = [
    '/',
    '/admin',
    '/student', 
    '/parent',
    '/faculty',
    '/unauthorized',
    '/nonexistent'
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const getRouteStatus = (path: string) => {
    const route = routeConfigs.find(r => r.path === path);
    if (!route) return 'Not Found';
    
    if (!isAuthenticated && route.requiredRoles && route.requiredRoles.length > 0) {
      return 'Requires Auth';
    }
    
    if (route.requiredRoles && route.requiredRoles.length > 0 && user) {
      return hasRouteAccess(route, user.role) ? 'Accessible' : 'Forbidden';
    }
    
    return 'Public';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accessible': return 'success';
      case 'Public': return 'info';
      case 'Requires Auth': return 'warning';
      case 'Forbidden': return 'error';
      case 'Not Found': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Route Testing Component
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Current Path: <strong>{location.pathname}</strong>
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          User: {user ? `${user.name} (${user.role})` : 'Not authenticated'}
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Test Routes:
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {testRoutes.map((path) => {
            const status = getRouteStatus(path);
            const isCurrentPath = location.pathname === path;
            
            return (
              <Box key={path} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Button
                  variant={isCurrentPath ? 'contained' : 'outlined'}
                  onClick={() => handleNavigate(path)}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  {path === '/' ? 'Home' : path}
                </Button>
                <Chip
                  label={status}
                  color={getStatusColor(status) as any}
                  size="small"
                />
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default RouteTest;