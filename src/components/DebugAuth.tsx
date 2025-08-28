import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const DebugAuth: React.FC = () => {
  const auth = useAuth();

  const clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Debug Authentication State
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>isAuthenticated:</strong> {String(auth.isAuthenticated)}
        </Typography>
        <Typography variant="body2">
          <strong>isLoading:</strong> {String(auth.isLoading)}
        </Typography>
        <Typography variant="body2">
          <strong>user:</strong> {auth.user ? JSON.stringify(auth.user, null, 2) : 'null'}
        </Typography>
        <Typography variant="body2">
          <strong>error:</strong> {auth.error || 'null'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>localStorage token:</strong> {localStorage.getItem('edushield_token') ? 'exists' : 'null'}
        </Typography>
        <Typography variant="body2">
          <strong>localStorage user:</strong> {localStorage.getItem('edushield_user') ? 'exists' : 'null'}
        </Typography>
        <Typography variant="body2">
          <strong>localStorage refresh:</strong> {localStorage.getItem('edushield_refresh_token') ? 'exists' : 'null'}
        </Typography>
      </Box>

      <Button variant="outlined" onClick={clearStorage} color="error">
        Clear All Storage & Reload
      </Button>
    </Paper>
  );
};

export default DebugAuth;