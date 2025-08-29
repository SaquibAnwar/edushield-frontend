import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { Lock as LockIcon, Home as HomeIcon, Warning as WarningIcon } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../../types/auth';
import { useToast } from '../../../contexts/ToastContext';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

/**
 * AdminRouteGuard component specifically for protecting admin-only routes
 * Implements comprehensive access control with proper authentication and role validation
 */
export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  fallbackPath = '/unauthorized'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const { showWarning } = useToast();

  // Show warning toast when access is denied
  React.useEffect(() => {
    if (!isLoading && isAuthenticated && user && user.role !== UserRole.Admin) {
      showWarning(
        'Access Denied',
        'You do not have permission to access the admin area. Administrator privileges are required.'
      );
    }
  }, [isLoading, isAuthenticated, user, showWarning]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Verifying admin access...
        </Typography>
      </Box>
    );
  }

  // First check: Authentication state
  if (!isAuthenticated || !user) {
    // Redirect to home page with return path for unauthenticated users
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location.pathname,
          message: 'Please log in to access this page'
        }} 
        replace 
      />
    );
  }

  // Second check: Admin role validation
  if (user.role !== UserRole.Admin) {
    // For non-admin users, show unauthorized page or redirect to their dashboard
    if (fallbackPath === '/unauthorized') {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
          gap={3}
          sx={{ p: 4 }}
        >
          <LockIcon sx={{ fontSize: 64, color: 'error.main' }} />
          <Typography variant="h4" component="h1" textAlign="center">
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth="md">
            You don't have permission to access this page. This area is restricted to administrators only.
          </Typography>
          <Alert severity="warning" sx={{ maxWidth: 'md' }} icon={<WarningIcon />}>
            <Typography variant="body2">
              <strong>Current role:</strong> {getUserRoleDisplayName(user.role)}
              <br />
              <strong>Required role:</strong> Administrator
              <br />
              <strong>Requested page:</strong> {location.pathname}
            </Typography>
          </Alert>
          <Alert severity="info" sx={{ maxWidth: 'md' }}>
            <Typography variant="body2">
              If you believe you should have admin access, please contact your system administrator. 
              Make sure you're logged in with the correct account that has administrative privileges.
            </Typography>
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => window.location.href = getRoleBasedRedirect(user.role)}
            >
              Go to My Dashboard
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      );
    }
    
    // Redirect to user's appropriate dashboard
    const redirectPath = getRoleBasedRedirect(user.role);
    return (
      <Navigate 
        to={redirectPath} 
        state={{
          message: 'You do not have permission to access the admin area'
        }}
        replace 
      />
    );
  }

  // Third check: User account status (additional security)
  if (!user.isActive) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        gap={3}
        sx={{ p: 4 }}
      >
        <LockIcon sx={{ fontSize: 64, color: 'warning.main' }} />
        <Typography variant="h4" component="h1" textAlign="center">
          Account Inactive
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth="md">
          Your admin account is currently inactive. Please contact the system administrator.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  // All checks passed - render protected admin content
  return <>{children}</>;
};

/**
 * Get user-friendly display name for user roles
 */
const getUserRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return 'Administrator';
    case UserRole.Student:
      return 'Student';
    case UserRole.Parent:
      return 'Parent';
    case UserRole.Faculty:
      return 'Faculty';
    default:
      return 'Unknown';
  }
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

export default AdminRouteGuard;