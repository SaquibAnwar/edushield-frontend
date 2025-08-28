import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import {
  People as PeopleIcon,
  Grade as GradeIcon,
  Assignment as AssignmentIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/layout';

export const FacultyDashboard: React.FC = () => {
  const { user, getDisplayName, getEmail } = useAuth();

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ p: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {getDisplayName()}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {getEmail()} • Role: {user?.role}
        </Typography>
      </Box>

      {/* Dashboard Content */}
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Faculty Dashboard
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3, 
            mt: 2 
          }}
        >
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                My Students
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                View and manage your students
              </Typography>
              <Button variant="contained" size="small">
                View Students
              </Button>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <GradeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Performance
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Track student performance and grades
              </Typography>
              <Button variant="contained" size="small">
                View Performance
              </Button>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <AssignmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Assignments
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Create and manage assignments
              </Typography>
              <Button variant="contained" size="small">
                Manage
              </Button>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <ProfileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Profile
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Update your profile information
              </Typography>
              <Button variant="contained" size="small">
                Edit Profile
              </Button>
            </Paper>
          </Box>
        </Box>

        {/* Additional Content */}
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your recent teaching activities and student interactions will be displayed here.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
};

export default FacultyDashboard;