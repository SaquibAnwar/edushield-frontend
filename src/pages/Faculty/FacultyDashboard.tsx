import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  AccountCircle as ProfileIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useFacultyData } from '../../hooks/useFacultyData';
import { Layout } from '../../components/layout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { FacultyProfile, FacultyMetrics, StudentList, StudentPerformanceManagement } from '../../components/faculty';
import type { Student } from '../../types/user';

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
      id={`faculty-tabpanel-${index}`}
      aria-labelledby={`faculty-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const FacultyDashboard: React.FC = () => {
  const { user, getDisplayName, getEmail } = useAuth();
  const { profile, metrics, assignedStudents, loading, error, refreshData } = useFacultyData();
  const [tabValue, setTabValue] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [, setPerformanceManagementOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewStudent = (student: Student) => {
    // For now, just show the performance management
    handleManagePerformance(student);
  };

  const handleManagePerformance = (student: Student) => {
    setSelectedStudent(student);
    setPerformanceManagementOpen(true);
  };

  const handleClosePerformanceManagement = () => {
    setPerformanceManagementOpen(false);
    setSelectedStudent(null);
    refreshData(); // Refresh data after closing
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <LoadingSpinner />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ p: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {getDisplayName()}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {getEmail()} • Role: {user?.role}
        </Typography>
        {profile && (
          <Typography variant="body2" color="text.secondary">
            {profile.department} • {profile.subject}
          </Typography>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ p: 4, pb: 0 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Dashboard Content */}
      <Box sx={{ p: 4 }}>
        {/* Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab
                label="Overview"
                icon={<DashboardIcon />}
                iconPosition="start"
              />
              <Tab
                label={`My Students (${assignedStudents.length})`}
                icon={<PeopleIcon />}
                iconPosition="start"
              />
              <Tab
                label="Profile"
                icon={<ProfileIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {metrics ? (
              <FacultyMetrics metrics={metrics} />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Loading faculty metrics...
                </Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <StudentList
              students={assignedStudents}
              onViewStudent={handleViewStudent}
              onManagePerformance={handleManagePerformance}
              loading={loading}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {profile ? (
              <FacultyProfile faculty={profile} />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Loading faculty profile...
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Paper>
      </Box>

      {/* Student Performance Management Dialog */}
      {selectedStudent && (
        <StudentPerformanceManagement
          student={selectedStudent}
          onClose={handleClosePerformanceManagement}
        />
      )}
    </Layout>
  );
};

export default FacultyDashboard;