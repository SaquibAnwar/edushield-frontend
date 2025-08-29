import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import { PermissionService } from '../../services/permissions';

/**
 * Test component to verify admin access control functionality
 * This component displays the current user's permissions and access levels
 */
export const AdminAccessTest: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const {
    hasAdminAccess,
    canAccessCRUDForms,
    canManageUsers,
    canAccessAdminDashboard,
    canAccessAdminManagement,
    validationResult,
    getUserRoleDisplayName,
    getRoleBasedRedirect
  } = useAdminPermissions();

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading authentication state...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <SecurityIcon color="primary" fontSize="large" />
        <Typography variant="h4" component="h1">
          Admin Access Control Test
        </Typography>
      </Box>

      {/* Authentication Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Authentication Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {isAuthenticated ? (
              <CheckIcon color="success" />
            ) : (
              <CancelIcon color="error" />
            )}
            <Typography>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </Typography>
          </Box>
          
          {user && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>User Information:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip icon={<PersonIcon />} label={`Name: ${user.name}`} />
                <Chip label={`Email: ${user.email}`} />
                <Chip 
                  label={`Role: ${getUserRoleDisplayName()}`}
                  color={hasAdminAccess ? 'success' : 'default'}
                />
                <Chip 
                  label={`Status: ${user.isActive ? 'Active' : 'Inactive'}`}
                  color={user.isActive ? 'success' : 'error'}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Permission Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Admin Permissions
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <PermissionRow 
              label="Has Admin Access"
              hasPermission={hasAdminAccess}
              description="Can access admin-only features"
            />
            <PermissionRow 
              label="Can Access CRUD Forms"
              hasPermission={canAccessCRUDForms}
              description="Can create, read, update, delete user records"
            />
            <PermissionRow 
              label="Can Manage Users"
              hasPermission={canManageUsers}
              description="Can perform user management operations"
            />
            <PermissionRow 
              label="Can Access Admin Dashboard"
              hasPermission={canAccessAdminDashboard}
              description="Can view admin dashboard"
            />
            <PermissionRow 
              label="Can Access Admin Management"
              hasPermission={canAccessAdminManagement}
              description="Can access admin management pages"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Validation Result */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Permission Validation
          </Typography>
          
          <Alert 
            severity={validationResult.hasAccess ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            <Typography variant="body2">
              <strong>Access Status:</strong> {validationResult.hasAccess ? 'Granted' : 'Denied'}
            </Typography>
            {validationResult.reason && (
              <Typography variant="body2">
                <strong>Reason:</strong> {validationResult.reason}
              </Typography>
            )}
            <Typography variant="body2">
              <strong>User Role:</strong> {validationResult.userRole}
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Route Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Route Information
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Current Path:</strong> {window.location.pathname}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Is Admin Route:</strong> {PermissionService.isAdminRoute(window.location.pathname) ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Recommended Redirect:</strong> {getRoleBasedRedirect()}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Available Admin Routes:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {PermissionService.getAdminRoutes().map(route => (
              <Chip 
                key={route}
                label={route}
                size="small"
                color={hasAdminAccess ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Actions
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/admin'}
              disabled={!hasAdminAccess}
            >
              Go to Admin Dashboard
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/admin/users'}
              disabled={!canAccessCRUDForms}
            >
              Go to User Management
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.href = getRoleBasedRedirect()}
            >
              Go to My Dashboard
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

interface PermissionRowProps {
  label: string;
  hasPermission: boolean;
  description: string;
}

const PermissionRow: React.FC<PermissionRowProps> = ({ label, hasPermission, description }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    {hasPermission ? (
      <CheckIcon color="success" />
    ) : (
      <CancelIcon color="error" />
    )}
    <Box sx={{ flex: 1 }}>
      <Typography variant="body1" fontWeight="medium">
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
    <Chip 
      label={hasPermission ? 'Allowed' : 'Denied'}
      color={hasPermission ? 'success' : 'error'}
      size="small"
    />
  </Box>
);

export default AdminAccessTest;