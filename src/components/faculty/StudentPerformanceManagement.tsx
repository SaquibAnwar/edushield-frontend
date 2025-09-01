import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Grade as GradeIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import type { Student, StudentPerformance, StudentFee } from '../../types/user';
import type { PerformanceFilters, FeeFilters } from '../../types/api';
import { apiService } from '../../services/api';
import { DataTable } from '../ui/DataTable';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { PerformanceForm } from '../ui/Forms/PerformanceForm';
import { formatDate } from '../../utils/dateUtils';
import { getExamTypeLabel, getPaymentStatusLabel, getFeeTypeLabel } from '../../utils/enumUtils';

interface StudentPerformanceManagementProps {
  student: Student;
  onClose: () => void;
}

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
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const StudentPerformanceManagement: React.FC<StudentPerformanceManagementProps> = ({
  student,
  onClose,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [performances, setPerformances] = useState<StudentPerformance[]>([]);
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceFormOpen, setPerformanceFormOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState<StudentPerformance | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [performanceToDelete, setPerformanceToDelete] = useState<StudentPerformance | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch student performances
      const performanceFilters: PerformanceFilters = {
        studentId: student.id,
        page: 1,
        limit: 100,
        sortBy: 'examDate',
        sortOrder: 'desc',
      };
      const performanceResponse = await apiService.getStudentPerformances(performanceFilters);
      setPerformances(performanceResponse.data || []);

      // Fetch student fees
      const feeFilters: FeeFilters = {
        studentId: student.id,
        page: 1,
        limit: 100,
        sortBy: 'dueDate',
        sortOrder: 'desc',
      };
      const feeResponse = await apiService.getStudentFees(feeFilters);
      setFees(feeResponse.data || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [student.id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreatePerformance = () => {
    setSelectedPerformance(null);
    setPerformanceFormOpen(true);
  };

  const handleEditPerformance = (performance: StudentPerformance) => {
    setSelectedPerformance(performance);
    setPerformanceFormOpen(true);
  };

  const handleDeletePerformance = (performance: StudentPerformance) => {
    setPerformanceToDelete(performance);
    setDeleteConfirmOpen(true);
  };

  const handlePerformanceSubmit = async (data: any) => {
    try {
      if (selectedPerformance) {
        // Update existing performance
        await apiService.updatePerformance(selectedPerformance.id, data);
      } else {
        // Create new performance
        await apiService.createPerformance({
          ...data,
          studentId: student.id,
        });
      }
      
      setPerformanceFormOpen(false);
      setSelectedPerformance(null);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving performance:', error);
      throw error; // Let the form handle the error
    }
  };

  const confirmDeletePerformance = async () => {
    if (!performanceToDelete) return;

    try {
      await apiService.deletePerformance(performanceToDelete.id);
      setDeleteConfirmOpen(false);
      setPerformanceToDelete(null);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting performance:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete performance');
    }
  };

  // Performance table columns
  const performanceColumns = [
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

  // Fee table columns
  const feeColumns = [
    {
      key: 'feeType',
      title: 'Fee Type',
      sortable: true,
      render: (value: any) => getFeeTypeLabel(value),
    },
    {
      key: 'term',
      title: 'Term',
      sortable: true,
    },
    {
      key: 'totalAmount',
      title: 'Total Amount',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'amountPaid',
      title: 'Amount Paid',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'amountDue',
      title: 'Amount Due',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'paymentStatus',
      title: 'Status',
      sortable: true,
      render: (value: any, row: StudentFee) => (
        <Chip
          label={getPaymentStatusLabel(value)}
          color={
            value === 2 ? 'success' : // Paid
            value === 1 ? 'warning' : // Partial
            row.isOverdue ? 'error' : 'default' // Overdue or Pending
          }
          size="small"
        />
      ),
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
  ];

  if (loading) {
    return (
      <Dialog open onClose={onClose} maxWidth="lg" fullWidth>
        <DialogContent>
          <LoadingSpinner />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GradeIcon />
          <Box>
            <Typography variant="h6">
              Student Management: {student.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Roll Number: {student.rollNumber} • Grade: {student.grade || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label={`Performance (${performances.length})`}
              icon={<GradeIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Fees (${fees.length})`}
              icon={<AssignmentIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Academic Performance
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePerformance}
            >
              Add Performance
            </Button>
          </Box>

          <DataTable
            data={performances}
            columns={performanceColumns}
            loading={loading}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">
              Fee Information (View Only)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fee management is handled by the administration
            </Typography>
          </Box>

          <DataTable
            data={fees}
            columns={feeColumns}
            loading={loading}
          />
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>

      {/* Performance Form Dialog */}
      <Dialog
        open={performanceFormOpen}
        onClose={() => setPerformanceFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPerformance ? 'Edit Performance' : 'Add Performance'}
        </DialogTitle>
        <DialogContent>
          <PerformanceForm
            students={[student]}
            initialData={selectedPerformance}
            onSubmit={handlePerformanceSubmit}
            onCancel={() => setPerformanceFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this performance record?
          </Typography>
          {performanceToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Subject:</strong> {performanceToDelete.subject}
              </Typography>
              <Typography variant="body2">
                <strong>Exam:</strong> {getExamTypeLabel(performanceToDelete.examType)}
              </Typography>
              <Typography variant="body2">
                <strong>Score:</strong> {performanceToDelete.formattedScore}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {formatDate(performanceToDelete.examDate)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmDeletePerformance}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default StudentPerformanceManagement;