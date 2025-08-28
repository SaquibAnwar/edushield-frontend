import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import {
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/layout';

export const StudentDashboard: React.FC = () => {
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
          Academic Overview
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
              <BookIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                My Courses
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                View enrolled courses and schedules
              </Typography>
              <Button variant="contained" size="small">
                View Courses
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
                Pending assignments and submissions
              </Typography>
              <Button variant="contained" size="small">
                View Tasks
              </Button>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <GradeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Grades
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Academic performance and results
              </Typography>
              <Button variant="contained" size="small">
                View Grades
              </Button>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <PaymentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Fee Status
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Payment status and history
              </Typography>
              <Button variant="contained" size="small">
                View Fees
              </Button>
            </Paper>
          </Box>
        </Box>

        {/* Additional Content */}
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your recent academic activities and updates will be displayed here.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
};

export default StudentDashboard;