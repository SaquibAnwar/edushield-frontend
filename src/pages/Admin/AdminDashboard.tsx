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
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboard: React.FC = () => {
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          Admin Panel
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="text"
            startIcon={<PeopleIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Manage Users
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
            Academic Management
          </Button>
          <Button
            variant="text"
            startIcon={<ReportsIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Reports & Analytics
          </Button>
          <Button
            variant="text"
            startIcon={<SettingsIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            System Settings
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
            Dashboard Overview
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Manage students, faculty, and parents
                </Typography>
                <Button variant="contained" size="small">
                  Manage
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Academic
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Courses, grades, and schedules
                </Typography>
                <Button variant="contained" size="small">
                  View
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <ReportsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Reports
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Analytics and performance reports
                </Typography>
                <Button variant="contained" size="small">
                  Generate
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <SettingsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  System configuration and preferences
                </Typography>
                <Button variant="contained" size="small">
                  Configure
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {/* Additional Content */}
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System activity and user interactions will be displayed here.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;