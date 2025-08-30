import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  PersonAdd as PersonAddIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  SupervisorAccount as SupervisorAccountIcon,
  FamilyRestroom as FamilyRestroomIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/layout';
import { ApiService } from '../../services/api';
import type { AdminMetrics } from '../../types/api';
import { useNavigate } from 'react-router-dom';
import { Grid } from '../../components/ui/Grid';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle,
  trend 
}) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 2, 
              backgroundColor: `${color}.light`,
              color: `${color}.contrastText`,
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="div" fontWeight="bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <TrendingUpIcon 
                  sx={{ 
                    fontSize: 16, 
                    color: trend.isPositive ? 'success.main' : 'error.main',
                    transform: trend.isPositive ? 'none' : 'rotate(180deg)',
                    mr: 0.5
                  }} 
                />
                <Typography 
                  variant="caption" 
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                >
                  {trend.value}%
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export const AdminDashboard: React.FC = () => {
  const { user, getDisplayName, getEmail } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiService = ApiService.getInstance();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getAdminMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to fetch admin metrics:', err);
        setError('Failed to load dashboard metrics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Layout>
      {/* Admin Profile Header */}
      <Box sx={{ p: { xs: 2, md: 4 }, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: { xs: 60, md: 80 }, 
              height: { xs: 60, md: 80 }, 
              mr: 3,
              bgcolor: 'primary.main',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            {getInitials(getDisplayName())}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom>
              Welcome back, {getDisplayName()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body1" color="text.secondary">
                {getEmail()}
              </Typography>
              <Chip 
                label={`Role: ${user?.role}`} 
                color="primary" 
                size="small"
                icon={<SupervisorAccountIcon />}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Dashboard Content */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Metrics Overview */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          System Overview
        </Typography>

        {loading ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="rectangular" height={120} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : metrics ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Total Students"
                value={metrics.totalStudents}
                icon={<PeopleIcon />}
                color="primary"
                subtitle={`${metrics.activeStudents} active, ${metrics.inactiveStudents} inactive`}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Total Faculty"
                value={metrics.totalFaculty}
                icon={<SchoolIcon />}
                color="secondary"
                subtitle={`${metrics.activeFaculty} active, ${metrics.inactiveFaculty} inactive`}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Total Parents"
                value={metrics.totalParents}
                icon={<FamilyRestroomIcon />}
                color="info"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Recent Enrollments"
                value={metrics.recentEnrollments}
                icon={<PersonAddIcon />}
                color="success"
                subtitle="Last 30 days"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Overdue Payments"
                value={metrics.overduePayments}
                icon={<WarningIcon />}
                color="warning"
                subtitle={`Total: ${formatCurrency(metrics.totalOverdueAmount)}`}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Outstanding Amount"
                value={formatCurrency(metrics.totalOverdueAmount)}
                icon={<AccountBalanceIcon />}
                color="error"
                subtitle={`${metrics.overduePayments} students affected`}
              />
            </Grid>
          </Grid>
        ) : null}

        {/* Quick Actions */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Quick Actions
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
              onClick={() => navigate('/admin/users')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage students, faculty, and parents
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
              onClick={() => navigate('/admin/students')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <SchoolIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Student Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive student CRUD operations
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
              onClick={() => navigate('/admin/settings')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <SettingsIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  System Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure system preferences
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <ReportsIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Generate analytics reports
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* System Status */}
        {metrics && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Student Enrollment Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                      label={`${metrics.activeStudents} Active`} 
                      color="success" 
                      size="small" 
                    />
                    <Chip 
                      label={`${metrics.inactiveStudents} Inactive`} 
                      color="default" 
                      size="small" 
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Faculty Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                      label={`${metrics.activeFaculty} Active`} 
                      color="success" 
                      size="small" 
                    />
                    <Chip 
                      label={`${metrics.inactiveFaculty} Inactive`} 
                      color="default" 
                      size="small" 
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            {metrics.overduePayments > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Attention:</strong> {metrics.overduePayments} students have overdue payments 
                  totaling {formatCurrency(metrics.totalOverdueAmount)}. 
                  Consider sending payment reminders.
                </Typography>
              </Alert>
            )}
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default AdminDashboard;