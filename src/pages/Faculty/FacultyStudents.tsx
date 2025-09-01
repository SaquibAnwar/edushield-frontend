import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
} from '@mui/material';

import { useFacultyData } from '../../hooks/useFacultyData';
import { Layout } from '../../components/layout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StudentList, StudentPerformanceManagement } from '../../components/faculty';
import type { Student } from '../../types/user';

export const FacultyStudents: React.FC = () => {
  const { profile, assignedStudents, loading, error, refreshData } = useFacultyData();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [, setPerformanceManagementOpen] = useState(false);

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
          My Students
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track your assigned students
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

      {/* Students List */}
      <Box sx={{ p: 4 }}>
        <StudentList
          students={assignedStudents}
          onViewStudent={handleViewStudent}
          onManagePerformance={handleManagePerformance}
          loading={loading}
        />
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

export default FacultyStudents;