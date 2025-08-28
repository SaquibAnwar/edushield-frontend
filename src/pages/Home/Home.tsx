import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Divider,
  Button
} from '@mui/material';
import {
  School as SchoolIcon,
  Security as SecurityIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { GoogleLogin } from '../../components/auth/GoogleLogin';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

export const Home: React.FC = () => {
  const { isAuthenticated, user, loginWithDevAuth, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRoleBasedRedirect(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLoginSuccess = () => {
    // User will be redirected by useEffect
  };

  const handleLoginError = (errorMessage: string) => {
    console.error('Login error:', errorMessage);
  };

  const handleDevLogin = async (email: string) => {
    try {
      console.log('Attempting dev login with email:', email);
      clearError();
      await loginWithDevAuth(email);
      console.log('Dev login successful');
    } catch (error: any) {
      console.error('Dev login failed:', error);
      console.error('Error details:', error.message);
    }
  };

  // If user is already authenticated, show loading while redirecting
  if (isAuthenticated && user) {
    const redirectPath = getRoleBasedRedirect(user.role);
    console.log('DEBUG: User authenticated, should redirect to:', redirectPath);
    console.log('DEBUG: User role:', user.role);
    console.log('DEBUG: Current location:', window.location.pathname);

    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            maxWidth: 400,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
            }
          }}
        >
          <SecurityIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" mb={3} fontWeight="medium">
            Redirecting to your dashboard...
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #1976d2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </Box>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        p: 0,
        m: 0,
        width: '100vw',
        overflow: 'hidden'
      }}
    >
      {/* Left side - Feature highlights (hidden on mobile) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          color: 'white',
          p: { lg: 6, xl: 8 },
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Typography variant="h3" fontWeight="bold" mb={3}>
          Welcome to EduShield
        </Typography>
        <Typography variant="h6" mb={4} sx={{ opacity: 0.9 }}>
          The complete educational management solution for modern institutions
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <SchoolIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6">Comprehensive Student Management</Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.8, ml: 5 }}>
            Track student progress, manage enrollments, and monitor academic performance
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <DashboardIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6">Role-based Dashboards</Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.8, ml: 5 }}>
            Customized interfaces for administrators, faculty, students, and parents
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <SecurityIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6">Secure Authentication</Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.8, ml: 5 }}>
            Google-powered secure login with role-based access control
          </Typography>
        </Box>
      </Box>

      {/* Right side - Login card */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: { xs: 3, sm: 4, md: 6 },
          bgcolor: { xs: 'transparent', lg: 'rgba(255, 255, 255, 0.05)' }
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: 4,
            textAlign: 'center',
            width: '100%',
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
            }
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
            <SecurityIcon sx={{ fontSize: { xs: 40, md: 50 }, color: 'primary.main', mr: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              color="primary.main"
              sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
            >
              EduShield
            </Typography>
          </Box>

          <Typography
            variant="h6"
            color="text.secondary"
            mb={6}
            sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
          >
            Educational Management System
          </Typography>

          {/* Features - Only show on mobile/tablet */}
          <Box mb={6} sx={{ display: { xs: 'block', lg: 'none' } }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <SchoolIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 24 }} />
              <Typography variant="body1" color="text.secondary">
                Student Management
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <DashboardIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 24 }} />
              <Typography variant="body1" color="text.secondary">
                Role-based Dashboards
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
              <SecurityIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 24 }} />
              <Typography variant="body1" color="text.secondary">
                Secure Authentication
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4, display: { xs: 'block', lg: 'none' } }} />

          {/* Error Display */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={clearError}
            >
              {error}
            </Alert>
          )}

          {/* Login Section */}
          <Typography variant="h4" mb={4} fontWeight="medium">
            Sign In to Continue
          </Typography>

          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />

          {/* Development Login Section - Only show in development */}
          {import.meta.env.DEV && (
            <>
              <Divider sx={{ my: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Development Login
                </Typography>
              </Divider>

              <Box display="flex" flexDirection="column" gap={2} maxWidth={400} mx="auto">
                <Typography variant="h6" color="text.secondary" mb={2}>
                  Quick Dev Login:
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleDevLogin('iamsaquibanwar@gmail.com')}
                  sx={{ textTransform: 'none', py: 1.5 }}
                >
                  Login as Admin
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleDevLogin('saquibanwar01@gmail.com')}
                  sx={{ textTransform: 'none', py: 1.5 }}
                >
                  Login as Student
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleDevLogin('kirakrypto9ite@gmail.com')}
                  sx={{ textTransform: 'none', py: 1.5 }}
                >
                  Login as Parent
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleDevLogin('saquibedu@gmail.com')}
                  sx={{ textTransform: 'none', py: 1.5 }}
                >
                  Login as Faculty
                </Button>
              </Box>
            </>
          )}

          {/* Footer */}
          <Typography
            variant="body2"
            color="text.secondary"
            mt={4}
          >
            Secure access with your Google account
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

/**
 * Get redirect path based on user role
 */
const getRoleBasedRedirect = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return '/admin';
    case UserRole.Student:
      return '/student';
    case UserRole.Parent:
      return '/parent';
    case UserRole.Faculty:
      return '/faculty';
    default:
      return '/';
  }
};

export default Home;