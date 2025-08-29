import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/layout';

export const AdminDashboard: React.FC = () => {
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
          Dashboard Overview
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
                User Management
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Manage students, faculty, and parents
              </Typography>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => window.location.href = '/admin/users'}
              >
                Manage
              </Button>
            </Paper>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
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
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
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
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
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
          </Box>
        </Box>

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
    </Layout>
  );
};

export default AdminDashboard;