import React from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Skeleton,
  Paper,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Grade as GradeIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useStudentData } from '../../hooks/useStudentData';
import { Layout } from '../../components/layout';
import { 
  StudentProfile, 
  StudentMetricsComponent, 
  RecentActivity 
} from '../../components/student';

export const StudentDashboard: React.FC = () => {
  const { getDisplayName } = useAuth();
  const navigate = useNavigate();
  const {
    student,
    metrics,
    recentPerformances,
    recentFees,
    isLoading,
    error,
    refetch
  } = useStudentData();

  const handleRefresh = async () => {
    await refetch();
  };

  const handleNavigateToPerformance = () => {
    navigate('/student/performance');
  };

  const handleNavigateToFees = () => {
    navigate('/student/fees');
  };

  if (isLoading) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <Skeleton variant="text" width="60%" height={60} />
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 4 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="rectangular" height={150} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 400px', minWidth: '300px' }}>
                <Skeleton variant="rectangular" height={300} />
              </Box>
              <Box sx={{ flex: '1 1 400px', minWidth: '300px' }}>
                <Skeleton variant="rectangular" height={300} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <Alert 
            severity="error" 
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRefresh}
                startIcon={<RefreshIcon />}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <Alert severity="warning">
            Student profile not found. Please contact your administrator.
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumbs */}
      <Box sx={{ p: 4, pb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/student');
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </Link>
          <Typography
            sx={{ display: 'flex', alignItems: 'center' }}
            color="text.primary"
          >
            <PersonIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Profile
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <Box sx={{ px: 4, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {getDisplayName()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Student Dashboard • {student.rollNumber}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="small"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Dashboard Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Student Profile */}
          <StudentProfile student={student} />

          {/* Academic Metrics */}
          {metrics && (
            <StudentMetricsComponent metrics={metrics} />
          )}

          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px', maxWidth: '300px' }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<GradeIcon />}
                  onClick={handleNavigateToPerformance}
                  sx={{ py: 2 }}
                >
                  View Performance
                </Button>
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px', maxWidth: '300px' }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PaymentIcon />}
                  onClick={handleNavigateToFees}
                  sx={{ py: 2 }}
                >
                  View Fees
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Recent Activity */}
          <RecentActivity 
            recentPerformances={recentPerformances}
            recentFees={recentFees}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default StudentDashboard;