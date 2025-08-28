import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: readonly UserRole[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/'
}) => {
  const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth();
  const location = useLocation();



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
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // Redirect to home if not authenticated (never redirect unauthenticated users to unauthorized page)
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access if roles are specified
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles as UserRole[])) {
    // Redirect to unauthorized page for role-based access denial
    if (fallbackPath === '/unauthorized') {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Redirect to appropriate dashboard based on user role
    const redirectPath = getRoleBasedRedirect(user.role);
    return (
      <Navigate 
        to={redirectPath} 
        replace 
      />
    );
  }

  // Render protected content
  return <>{children}</>;
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

export default ProtectedRoute;