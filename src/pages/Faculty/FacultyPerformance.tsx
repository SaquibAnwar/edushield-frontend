import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Grade as GradeIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

import { useFacultyData } from '../../hooks/useFacultyData';
import { Layout } from '../../components/layout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { DataTable } from '../../components/ui/DataTable';
import { PerformanceForm } from '../../components/ui/Forms/PerformanceForm';
import type { StudentPerformance } from '../../types/user';
import type { PerformanceFilters } from '../../types/api';
import { apiService } from '../../services/api';
import { formatDate } from '../../utils/dateUtils';
import { getExamTypeLabel } from '../../utils/enumUtils';

export const FacultyPerformance: React.FC = () => {
  const { profile, assignedStudents, loading: facultyLoading, error: facultyError } = useFacultyData();
  const [performances, setPerformances] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [performanceFormOpen, setPerformanceFormOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState<StudentPerformance | null>(null);

  const fetchPerformances = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all performances for assigned students
      const studentIds = assignedStudents.map(s => s.id);
      
      if (studentIds.length === 0) {
        setPerformances([]);
        return;
      }

      // For now, get all performances and filter client-side
      // TODO: Implement server-side filtering by faculty's students
      const filters: PerformanceFilters = {
        page: 1,
        limit: 1000,
        sortBy: 'examDate',
        sortOrder: 'desc',
      };

      const response = await apiService.getStudentPerformances(filters);
      
      // Filter performances for assigned students only
      const filteredPerformances = (response.data || []).filter(p => 
        studentIds.includes(p.studentId)
      );
      
      setPerformances(filteredPerformances);
    } catch (error) {
      console.error('Error fetching performances:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch performances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!facultyLoading && assignedStudents.length >= 0) {
      fetchPerformances();
    }
  }, [facultyLoading, assignedStudents]);

  const handleCreatePerformance = () => {
    setSelectedPerformance(null);
    setPerformanceFormOpen(true);
  };

  const handleEditPerformance = (performance: StudentPerformance) => {
    setSelectedPerformance(performance);
    setPerformanceFormOpen(true);
  };

  const handleDeletePerformance = async (performance: StudentPerformance) => {
    if (!confirm('Are you sure you want to delete this performance record?')) {
      return;
    }

    try {
      await apiService.deletePerformance(performance.id);
      await fetchPerformances(); // Refresh data
    } catch (error) {
      console.error('Error deleting performance:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete performance');
    }
  };

  const handlePerformanceSubmit = async (data: any) => {
    try {
      if (selectedPerformance) {
        await apiService.updatePerformance(selectedPerformance.id, data);
      } else {
        await apiService.createPerformance(data);
      }
      
      setPerformanceFormOpen(false);
      setSelectedPerformance(null);
      await fetchPerformances(); // Refresh data
    } catch (error) {
      console.error('Error saving performance:', error);
      throw error; // Let the form handle the error
    }
  };

  // Filter performances based on search term
  const filteredPerformances = performances.filter(performance =>
    !searchTerm.trim() || 
    performance.studentFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.studentLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (performance.examTitle && performance.examTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Performance table columns
  const columns = [
    {
      key: 'studentName',
      title: 'Student',
      sortable: true,
      render: (_value: any, row: StudentPerformance) => 
        `${row.studentFirstName} ${row.studentLastName}`,
    },
    {
      key: 'subject',
      title: 'Subject',
      sortable: true,
    },
    {
      key: 'examType',
      title: 'Exam Type',
      sortable: true,
      render: (value: any) => getExamTypeLabel(value),
    },
    {
      key: 'examTitle',
      title: 'Exam Title',
      sortable: true,
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'examDate',
      title: 'Exam Date',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'formattedScore',
      title: 'Score',
      sortable: false,
    },
    {
      key: 'percentage',
      title: 'Percentage',
      sortable: true,
      render: (value: number) => value ? `${value.toFixed(1)}%` : 'N/A',
    },
    {
      key: 'grade',
      title: 'Grade',
      sortable: true,
      render: (value: string) => (
        <Chip
          label={value}
          color={
            value === 'A' || value === 'A+' ? 'success' :
            value === 'B' || value === 'B+' ? 'info' :
            value === 'C' || value === 'C+' ? 'warning' :
            'error'
          }
          size="small"
        />
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      sortable: false,
      render: (_value: any, row: StudentPerformance) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Performance">
            <IconButton
              size="small"
              onClick={() => handleEditPerformance(row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Performance">
            <IconButton
              size="small"
              onClick={() => handleDeletePerformance(row)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (facultyLoading) {
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
          Performance Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage academic performance for your assigned students
        </Typography>
        {profile && (
          <Typography variant="body2" color="text.secondary">
            {profile.department} • {profile.subject}
          </Typography>
        )}
      </Box>

      {/* Error Alert */}
      {(facultyError || error) && (
        <Box sx={{ p: 4, pb: 0 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {facultyError || error}
          </Alert>
        </Box>
      )}

      {/* Content */}
      <Box sx={{ p: 4 }}>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 140 }}>
              <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <GradeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" component="div" gutterBottom>
                  {performances.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Assessments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 140 }}>
              <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" component="div" gutterBottom>
                  {assignedStudents.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assigned Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 140 }}>
              <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" component="div" gutterBottom>
                  {profile?.subject ? 1 : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Subjects Teaching
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 140 }}>
              <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" component="div" gutterBottom>
                  {performances.filter(p => {
                    const examDate = new Date(p.examDate);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return examDate >= thirtyDaysAgo;
                  }).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recent Assessments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Management */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Student Performance Records
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePerformance}
              disabled={assignedStudents.length === 0}
            >
              Add Performance
            </Button>
          </Box>

          {/* Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by student name, subject, or exam title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 600 }}
            />
          </Box>

          {/* Performance Table */}
          <DataTable
            data={filteredPerformances}
            columns={columns}
            loading={loading}
          />
        </Paper>
      </Box>

      {/* Performance Form Dialog */}
      {performanceFormOpen && (
        <PerformanceForm
          students={assignedStudents}
          initialData={selectedPerformance}
          onSubmit={handlePerformanceSubmit}
          onCancel={() => setPerformanceFormOpen(false)}
        />
      )}
    </Layout>
  );
};

export default FacultyPerformance;