import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
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
        <ErrorIcon
          sx={{
            fontSize: 80,
            color: 'error.main',
            mb: 3
          }}
        />
        
        <Typography variant="h3" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleGoHome}
            size="large"
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleGoBack}
            size="large"
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;