import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import {
  ChildCare as ChildIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/layout';

export const ParentDashboard: React.FC = () => {
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
          Child's Overview
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
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
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
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
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
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
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
          </Box>
        </Box>

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
    </Layout>
  );
};

export default ParentDashboard;