import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  ChildCare as ChildIcon,
  Assessment as MetricsIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useParentData } from '../../hooks/useParentData';
import { Layout } from '../../components/layout';
import { ParentProfile, ChildSelector, ParentMetrics } from '../../components/parent';
import { LoadingSpinner } from '../../components/ui';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`parent-tabpanel-${index}`}
      aria-labelledby={`parent-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const ParentDashboard: React.FC = () => {
  const { user, getDisplayName, getEmail } = useAuth();
  const {
    parent,
    children,
    selectedChild,
    metrics,
    isLoading,
    error,
    selectChild,
    refreshData,
  } = useParentData();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ p: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {getDisplayName()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {getEmail()} • Role: {user?.role}
            </Typography>
            {parent && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Parent ID: {parent.id} • Children: {children.length}
              </Typography>
            )}
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Loading State */}
      {isLoading && !parent && (
        <Box sx={{ p: 4 }}>
          <LoadingSpinner tip="Loading parent dashboard..." />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={handleRefresh}>
            Try Again
          </Button>
        </Box>
      )}

      {/* Dashboard Content */}
      {parent && !isLoading && (
        <Box sx={{ p: 4 }}>
          {/* Navigation Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="parent dashboard tabs"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab
                icon={<PersonIcon />}
                label="My Profile"
                id="parent-tab-0"
                aria-controls="parent-tabpanel-0"
              />
              <Tab
                icon={<ChildIcon />}
                label="My Children"
                id="parent-tab-1"
                aria-controls="parent-tabpanel-1"
              />
              <Tab
                icon={<MetricsIcon />}
                label="Overview & Metrics"
                id="parent-tab-2"
                aria-controls="parent-tabpanel-2"
              />
            </Tabs>

            {/* Tab Panels */}
            <TabPanel value={activeTab} index={0}>
              <ParentProfile parent={parent} />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <ChildSelector
                children={children}
                selectedChild={selectedChild}
                onChildSelect={selectChild}
                isLoading={isLoading}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              {metrics ? (
                <ParentMetrics metrics={metrics} />
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Loading metrics...
                  </Typography>
                </Paper>
              )}
            </TabPanel>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setActiveTab(1)}
                disabled={children.length === 0}
              >
                View Children ({children.length})
              </Button>
              <Button
                variant="outlined"
                color="info"
                onClick={() => setActiveTab(2)}
              >
                View Metrics
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setActiveTab(0)}
              >
                View My Profile
              </Button>
            </Box>
            
            {children.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No children are currently assigned to your account. Please contact the school administration to assign children to your parent account.
              </Alert>
            )}
          </Paper>
        </Box>
      )}
    </Layout>
  );
};

export default ParentDashboard;