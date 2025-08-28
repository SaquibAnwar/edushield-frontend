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
  Class as ClassIcon,
  People as StudentsIcon,
  Assignment as AssignmentIcon,
  EventAvailable as AttendanceIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

export const FacultyDashboard: React.FC = () => {
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
        background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
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
          Faculty Portal
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="text"
            startIcon={<ClassIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            My Classes
          </Button>
          <Button
            variant="text"
            startIcon={<StudentsIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Student Management
          </Button>
          <Button
            variant="text"
            startIcon={<AssignmentIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Assignments
          </Button>
          <Button
            variant="text"
            startIcon={<AttendanceIcon />}
            sx={{ 
              color: 'white', 
              justifyContent: 'flex-start',
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Attendance
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
            Teaching Overview
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <ClassIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  My Classes
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  View and manage assigned classes
                </Typography>
                <Button variant="contained" size="small">
                  View Classes
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <StudentsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Students
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Manage student records and grades
                </Typography>
                <Button variant="contained" size="small">
                  Manage Students
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <AssignmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Assignments
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create and manage assignments
                </Typography>
                <Button variant="contained" size="small">
                  Manage Assignments
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <AttendanceIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Attendance
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Mark and track student attendance
                </Typography>
                <Button variant="contained" size="small">
                  Take Attendance
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {/* Additional Content */}
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your recent teaching activities and student interactions.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FacultyDashboard;