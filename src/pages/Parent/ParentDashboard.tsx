import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid
} from '@mui/material';
import {
  ExitToApp as LogoutIcon,
  ChildCare as ChildIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

export const ParentDashboard: React.FC = () => {
  const { user, logout, getDisplayName, getEmail } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '300px 1fr' },
        p: 0,
        m: 0,
        width: '100vw',
        overflow: 'hidden'
      }}
    >
      {/* Left Sidebar - Navigation (hidden on mobile) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          p: 3,
          minHeight: '100vh'
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={4}>
          Parent Portal
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="text"
            startIcon={<ChildIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Child's Progress
          </Button>
          <Button
            variant="text"
            startIcon={<SchoolIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Attendance
          </Button>
          <Button
            variant="text"
            startIcon={<PaymentIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Fee Payments
          </Button>
          <Button
            variant="text"
            startIcon={<MessageIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Communication
          </Button>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'white'
              }
            }}
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Right Content Area */}
      <Box
        sx={{
          bgcolor: 'white',
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        {/* Header */}
        <Box sx={{ p: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {getDisplayName()}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {getEmail()} • Role: {user?.role}
          </Typography>
          
          {/* Mobile Logout Button */}
          <Box sx={{ display: { xs: 'block', lg: 'none' }, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              color="error"
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Dashboard Content */}
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Child's Overview
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <ChildIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Child's Progress
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Academic performance and grades
                </Typography>
                <Button variant="contained" size="small">
                  View Progress
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Attendance
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Daily attendance records
                </Typography>
                <Button variant="contained" size="small">
                  View Attendance
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <PaymentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Fee Payments
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Payment status and history
                </Typography>
                <Button variant="contained" size="small">
                  Manage Fees
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <MessageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Communication
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Messages from teachers and school
                </Typography>
                <Button variant="contained" size="small">
                  View Messages
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {/* Additional Content */}
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Recent Updates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent updates about your child's academic activities and school events.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ParentDashboard;