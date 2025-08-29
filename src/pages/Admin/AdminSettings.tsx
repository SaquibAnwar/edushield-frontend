import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Divider,
  TextField,
  Chip
} from '@mui/material';
import { Grid } from '../../components/ui/Grid';

import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  BugReport as TestIcon
} from '@mui/icons-material';
import { Layout } from '../../components/layout';
import { LoadingSpinner, ErrorMessage } from '../../components/ui';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import type { SystemSettingsUpdate } from '../../types/settings';

export const AdminSettings: React.FC = () => {
  const {
    settings,
    isLoading,
    error,
    updateSettings,
    refreshSettings
  } = useSystemSettings();

  const {
    hasAdminAccess,
    validationResult,
    getUserRoleDisplayName
  } = useAdminPermissions();

  const [localSettings, setLocalSettings] = useState<SystemSettingsUpdate>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Update local settings when global settings change
  React.useEffect(() => {
    if (settings) {
      setLocalSettings({
        testComponentsEnabled: settings.testComponentsEnabled,
        debugModeEnabled: settings.debugModeEnabled,
        maintenanceMode: settings.maintenanceMode,
        allowUserRegistration: settings.allowUserRegistration,
        maxFileUploadSize: settings.maxFileUploadSize,
        sessionTimeoutMinutes: settings.sessionTimeoutMinutes
      });
    }
  }, [settings]);

  // Show loading while checking permissions or fetching settings
  if (isLoading) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <LoadingSpinner tip="Loading system settings..." />
        </Box>
      </Layout>
    );
  }

  // Access denied for non-admins
  if (!hasAdminAccess) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SecurityIcon />
              <Typography variant="h6">Access Denied</Typography>
            </Box>
            <Typography variant="body2">
              {validationResult.reason || 'You do not have permission to access system settings.'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Current role: <strong>{getUserRoleDisplayName()}</strong>
            </Typography>
          </Alert>
        </Box>
      </Layout>
    );
  }

  const handleSettingChange = (key: keyof SystemSettingsUpdate, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSettingsError(null);

      await updateSettings(localSettings);
      setSuccessMessage('System settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      setSettingsError(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setSettingsError(null);
      await refreshSettings();
      setSuccessMessage('Settings refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing settings:', error);
      setSettingsError(error instanceof Error ? error.message : 'Failed to refresh settings');
    }
  };

  const hasChanges = settings && Object.keys(localSettings).some(
    key => localSettings[key as keyof SystemSettingsUpdate] !== settings[key as keyof SystemSettingsUpdate]
  );

  return (
    <Layout>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <SettingsIcon color="primary" fontSize="large" />
          <Typography variant="h4" component="h1">
            System Settings
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Configure system-wide settings that affect all users
        </Typography>

        {error && (
          <Box sx={{ mb: 3 }}>
            <ErrorMessage
              error={error}
              showRetry
              onRetry={handleRefresh}
            />
          </Box>
        )}

        {settingsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {settingsError}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Feature Toggles */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TestIcon color="primary" />
                  <Typography variant="h6">Feature Controls</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localSettings.testComponentsEnabled || false}
                        onChange={(e) => handleSettingChange('testComponentsEnabled', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">Enable Test Components</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Allow all users to access the test components page at /test-components
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={localSettings.debugModeEnabled || false}
                        onChange={(e) => handleSettingChange('debugModeEnabled', e.target.checked)}
                        color="warning"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">Debug Mode</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Enable debug information and developer tools
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={localSettings.maintenanceMode || false}
                        onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                        color="error"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">Maintenance Mode</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Restrict access to the system for maintenance
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={localSettings.allowUserRegistration || false}
                        onChange={(e) => handleSettingChange('allowUserRegistration', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">Allow User Registration</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Allow new users to register accounts
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* System Configuration */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SettingsIcon color="primary" />
                  <Typography variant="h6">System Configuration</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Max File Upload Size (MB)"
                    type="number"
                    value={localSettings.maxFileUploadSize || 10}
                    onChange={(e) => handleSettingChange('maxFileUploadSize', parseInt(e.target.value))}
                    inputProps={{ min: 1, max: 100 }}
                    helperText="Maximum file size allowed for uploads"
                    fullWidth
                  />

                  <TextField
                    label="Session Timeout (Minutes)"
                    type="number"
                    value={localSettings.sessionTimeoutMinutes || 60}
                    onChange={(e) => handleSettingChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                    inputProps={{ min: 15, max: 480 }}
                    helperText="How long user sessions remain active"
                    fullWidth
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Current Status */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Status
                </Typography>

                {settings && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                      label={`Test Components: ${settings.testComponentsEnabled ? 'Enabled' : 'Disabled'}`}
                      color={settings.testComponentsEnabled ? 'success' : 'default'}
                      icon={<TestIcon />}
                    />
                    <Chip
                      label={`Debug Mode: ${settings.debugModeEnabled ? 'On' : 'Off'}`}
                      color={settings.debugModeEnabled ? 'warning' : 'default'}
                    />
                    <Chip
                      label={`Maintenance: ${settings.maintenanceMode ? 'Active' : 'Normal'}`}
                      color={settings.maintenanceMode ? 'error' : 'success'}
                    />
                    <Chip
                      label={`Registration: ${settings.allowUserRegistration ? 'Open' : 'Closed'}`}
                      color={settings.allowUserRegistration ? 'success' : 'default'}
                    />
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary">
                  Last updated: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Never'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Updated by: {settings?.updatedBy || 'System'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving || !hasChanges}
            size="large"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={saving}
            size="large"
          >
            Refresh
          </Button>

          {hasChanges && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setLocalSettings(settings ? {
                testComponentsEnabled: settings.testComponentsEnabled,
                debugModeEnabled: settings.debugModeEnabled,
                maintenanceMode: settings.maintenanceMode,
                allowUserRegistration: settings.allowUserRegistration,
                maxFileUploadSize: settings.maxFileUploadSize,
                sessionTimeoutMinutes: settings.sessionTimeoutMinutes
              } : {})}
              size="large"
            >
              Reset Changes
            </Button>
          )}
        </Box>

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage(null)}
        >
          <Alert
            onClose={() => setSuccessMessage(null)}
            severity="success"
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default AdminSettings;