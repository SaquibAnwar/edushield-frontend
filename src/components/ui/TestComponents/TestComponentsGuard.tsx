import React from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  Card,
  CardContent
} from '@mui/material';
import {
  Lock as LockIcon,
  Settings as SettingsIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useSystemSettings } from '../../../contexts/SystemSettingsContext';
import { useAdminPermissions } from '../../../hooks/useAdminPermissions';
import { LoadingSpinner } from '../LoadingSpinner';
import TestComponents from './TestComponents';

/**
 * Guard component that controls access to test components based on admin settings
 */
export const TestComponentsGuard: React.FC = () => {
  const { settings, isLoading, error } = useSystemSettings();
  const { hasAdminAccess } = useAdminPermissions();

  // Show loading while fetching settings
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
        <LoadingSpinner tip="Checking test components availability..." />
      </Box>
    );
  }

  // Show error if settings couldn't be loaded
  if (error) {
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
        <Alert severity="error" sx={{ maxWidth: 'md' }}>
          <Typography variant="body1" gutterBottom>
            Unable to load system settings
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  // Check if test components are enabled or if user is admin
  const canAccess = settings?.testComponentsEnabled || hasAdminAccess;

  if (!canAccess) {
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
          Test Components Disabled
        </Typography>
        
        <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth="md">
          The test components page is currently disabled by the system administrator.
        </Typography>

        <Card sx={{ maxWidth: 'md', width: '100%' }}>
          <CardContent>
            <Alert severity="info">
              <Typography variant="body2" gutterBottom>
                <strong>For Administrators:</strong>
              </Typography>
              <Typography variant="body2">
                You can enable test components for all users by going to Admin Settings and toggling the "Enable Test Components" option.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {hasAdminAccess && (
            <Button
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => window.location.href = '/admin/settings'}
            >
              Go to Admin Settings
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => window.location.href = '/'}
          >
            Return to Home
          </Button>
        </Box>
      </Box>
    );
  }

  // Render test components if access is granted
  return (
    <Box>
      {hasAdminAccess && !settings?.testComponentsEnabled && (
        <Alert severity="info" sx={{ m: 3 }}>
          <Typography variant="body2">
            <strong>Admin Notice:</strong> Test components are currently disabled for regular users. 
            You can see this page because you have admin privileges. 
            <Button 
              size="small" 
              sx={{ ml: 1 }}
              onClick={() => window.location.href = '/admin/settings'}
            >
              Enable for all users
            </Button>
          </Typography>
        </Alert>
      )}
      <TestComponents />
    </Box>
  );
};

export default TestComponentsGuard;