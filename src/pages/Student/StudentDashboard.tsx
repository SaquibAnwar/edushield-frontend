import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useStudentData } from '../../hooks/useStudentData';
import { Layout } from '../../components/layout';
import { StudentProfile, StudentMetricsComponent, RecentActivity } from '../../components/student';

export const StudentDashboard: React.FC = () => {
  const { user, getDisplayName, getEmail } = useAuth();
  const { student, metrics, isLoading } = useStudentData();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Quick stats data
  const quickStats = [
    {
      title: 'Overall GPA',
      value: metrics?.averageGrade || 'N/A',
      icon: <GradeIcon />,
      color: '#4caf50',
      trend: '+0.2',
      trendUp: true
    },
    {
      title: 'Total Subjects',
      value: metrics?.totalSubjects || 0,
      icon: <BookIcon />,
      color: '#2196f3',
      trend: '+1',
      trendUp: true
    },
    {
      title: 'Pending Fees',
      value: `$${metrics?.pendingFees?.toFixed(2) || '0.00'}`,
      icon: <PaymentIcon />,
      color: metrics?.pendingFees > 0 ? '#ff9800' : '#4caf50',
      trend: metrics?.pendingFees > 0 ? 'Due' : 'Paid',
      trendUp: metrics?.pendingFees === 0
    },
    {
      title: 'Total Exams',
      value: metrics?.totalExams || 0,
      icon: <AssignmentIcon />,
      color: '#9c27b0',
      trend: '+3',
      trendUp: true
    }
  ];

  const actionCards = [
    {
      title: 'My Performance',
      description: 'View your academic performance, grades, and progress across all subjects',
      icon: <GradeIcon sx={{ fontSize: 40 }} />,
      color: '#667eea',
      action: () => navigate('/student/performance'),
      buttonText: 'View Performance',
      stats: `${metrics?.totalExams || 0} exams completed`
    },
    {
      title: 'Fee Management',
      description: 'Check payment status, view fee history, and manage your financial records',
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      color: '#764ba2',
      action: () => navigate('/student/fees'),
      buttonText: 'View Fees',
      stats: metrics?.pendingFees > 0 ? `$${metrics.pendingFees.toFixed(2)} pending` : 'All fees paid'
    },
    {
      title: 'Assignments',
      description: 'Track your assignments, submissions, and upcoming deadlines',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#f093fb',
      action: () => {},
      buttonText: 'View Assignments',
      stats: 'Coming soon',
      disabled: true
    },
    {
      title: 'Schedule',
      description: 'View your class schedule, exam dates, and important academic events',
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      color: '#f5576c',
      action: () => {},
      buttonText: 'View Schedule',
      stats: 'Coming soon',
      disabled: true
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: { xs: 3, md: 4 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            transform: 'translate(-50%, 50%)'
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: { xs: 60, md: 80 },
                    height: { xs: 60, md: 80 },
                    mr: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  {getDisplayName().split(' ').map(n => n[0]).join('').slice(0, 2)}
                </Avatar>
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} component="h1" fontWeight="bold">
                    Welcome back, {getDisplayName()}!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                    {getEmail()} • {student?.rollNumber || 'Student'}
                  </Typography>
                  <Chip
                    label={student?.status || 'Active'}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 'medium'
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Today's Date
                </Typography>
                <Typography variant="h6" fontWeight="medium">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ p: { xs: 2, md: 4 }, mt: -2 }}>
        <Grid container spacing={3}>
          {quickStats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: 3,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        width: { xs: 40, md: 48 },
                        height: { xs: 40, md: 48 },
                        mr: 2
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {stat.title}
                      </Typography>
                      <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" noWrap>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon
                      sx={{
                        fontSize: 16,
                        color: stat.trendUp ? 'success.main' : 'error.main',
                        mr: 0.5
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: stat.trendUp ? 'success.main' : 'error.main',
                        fontWeight: 'medium'
                      }}
                    >
                      {stat.trend}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Action Cards */}
          <Grid item xs={12} lg={8}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              {actionCards.map((card, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`,
                      color: 'white',
                      borderRadius: 3,
                      transition: 'all 0.3s ease-in-out',
                      cursor: card.disabled ? 'default' : 'pointer',
                      opacity: card.disabled ? 0.7 : 1,
                      '&:hover': card.disabled ? {} : {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                      }
                    }}
                    onClick={card.disabled ? undefined : card.action}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            width: 56,
                            height: 56,
                            mr: 2
                          }}
                        >
                          {card.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {card.title}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {card.stats}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 3, flex: 1 }}>
                        {card.description}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.3)'
                          },
                          alignSelf: 'flex-start'
                        }}
                        disabled={card.disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!card.disabled) card.action();
                        }}
                      >
                        {card.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Sidebar Content */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Student Profile Card */}
              {student && (
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Profile Overview
                    </Typography>
                    <StudentProfile student={student} />
                  </CardContent>
                </Card>
              )}

              {/* Recent Activity */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Activity
                  </Typography>
                  <RecentActivity />
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Links
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      startIcon={<CalendarIcon />}
                      variant="text"
                      sx={{ justifyContent: 'flex-start' }}
                      disabled
                    >
                      Academic Calendar
                    </Button>
                    <Button
                      startIcon={<NotificationsIcon />}
                      variant="text"
                      sx={{ justifyContent: 'flex-start' }}
                      disabled
                    >
                      Notifications
                    </Button>
                    <Button
                      startIcon={<BookIcon />}
                      variant="text"
                      sx={{ justifyContent: 'flex-start' }}
                      disabled
                    >
                      Course Materials
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default StudentDashboard;