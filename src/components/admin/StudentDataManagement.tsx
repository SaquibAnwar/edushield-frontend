import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import {
  DataTable,
  Modal,
  ErrorMessage,
} from '../ui';
import { PerformanceForm, FeeForm, FacultyAssignmentForm, ParentAssignmentForm } from '../ui/Forms';
import { Layout } from '../layout';
import { apiService } from '../../services/api';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import { useToast } from '../../contexts/ToastContext';

import type {
  Student,
  Faculty,
  Parent,
  StudentPerformance,
  StudentFee,
  ExamType,
  FeeType,
  PaymentStatus
} from '../../types/user';

// Form data interfaces
interface PerformanceFormData {
  studentId: string;
  subject: string;
  examType: ExamType;
  examDate: string;
  score: number;
  maxScore: number;
  examTitle?: string;
  comments?: string;
}

interface FeeFormData {
  studentId: string;
  feeType: FeeType;
  term: string;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  lastPaymentDate?: string;
  fineAmount?: number;
  notes?: string;
}

interface FacultyAssignmentFormData {
  studentId: string;
  facultyId: string;
  subject?: string;
  notes?: string;
  isActive: boolean;
}

interface ParentAssignmentFormData {
  parentId: string;
  studentId: string;
  relationship: string;
  isPrimaryContact: boolean;
  isAuthorizedToPickup: boolean;
  isEmergencyContact: boolean;
  isActive: boolean;
  notes?: string;
}
import type { Column } from '../../types/components';

import {
  getExamTypeDisplay,
  getFeeTypeDisplay,
  getPaymentStatusDisplay,
  getPaymentStatusColor
} from '../../utils/enumUtils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-data-tabpanel-${index}`}
      aria-labelledby={`student-data-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const StudentDataManagement: React.FC = () => {
  const { canManageUsers } = useAdminPermissions();
  const { showSuccess, showError } = useToast();

  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [performances, setPerformances] = useState<StudentPerformance[]>([]);
  const [fees, setFees] = useState<StudentFee[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);

  // Modal states
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [facultyAssignmentModalOpen, setFacultyAssignmentModalOpen] = useState(false);
  const [parentAssignmentModalOpen, setParentAssignmentModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Current item states
  const [selectedPerformance, setSelectedPerformance] = useState<StudentPerformance | null>(null);
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);

  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'performance' | 'fee'>('performance');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Load data functions
  const loadStudents = useCallback(async () => {
    try {
      const response = await apiService.getStudents();
      setStudents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error loading students:', err);
      setStudents([]);
    }
  }, []);

  const loadParentsAndFaculties = useCallback(async () => {
    try {
      const [parentsResponse, facultiesResponse] = await Promise.all([
        apiService.getParents(),
        apiService.getFaculties(),
      ]);
      setParents(Array.isArray(parentsResponse) ? parentsResponse : []);
      setFaculties(Array.isArray(facultiesResponse) ? facultiesResponse : []);
    } catch (err) {
      console.error('Error loading parents and faculties:', err);
      setParents([]);
      setFaculties([]);
    }
  }, []);

  const loadPerformances = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm || undefined,
        page: currentPage,
        limit: pageSize,
      };
      const response = await apiService.getStudentPerformances(filters);
      
      // Debug logging
      console.log('Performance API Response:', JSON.stringify(response, null, 2));
      
      // Handle paginated response
      const data = Array.isArray(response.data) ? response.data : [];
      const count = response.totalCount || 0;
      console.log('Setting performances (paginated):', JSON.stringify(data, null, 2), 'Total:', count);
      setPerformances(data);
      setTotalCount(count);
    } catch (err) {
      console.error('Error loading performances:', err);
      console.error('Error details:', err);
      setError(`Failed to load performances: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setPerformances([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, pageSize]);

  const loadFees = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm || undefined,
        page: currentPage,
        limit: pageSize,
      };
      const response = await apiService.getStudentFees(filters);
      
      // Debug logging
      console.log('Fee API Response:', JSON.stringify(response, null, 2));
      
      // Handle paginated response
      const data = Array.isArray(response.data) ? response.data : [];
      const count = response.totalCount || 0;
      console.log('Setting fees (paginated):', JSON.stringify(data, null, 2), 'Total:', count);
      setFees(data);
      setTotalCount(count);
    } catch (err) {
      console.error('Error loading fees:', err);
      console.error('Error details:', err);
      setError(`Failed to load fees: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setFees([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, pageSize]);

  // Effects
  useEffect(() => {
    loadStudents();
    loadParentsAndFaculties();
  }, [loadStudents, loadParentsAndFaculties]);

  useEffect(() => {
    if (currentTab === 0) {
      loadPerformances();
    } else if (currentTab === 1) {
      loadFees();
    }
  }, [currentTab, loadPerformances, loadFees]);

  // Handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setCurrentPage(1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    if (currentTab === 0) {
      loadPerformances();
    } else if (currentTab === 1) {
      loadFees();
    }
  };

  // Performance handlers
  const handleCreatePerformance = () => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to create performance records');
      return;
    }
    setSelectedPerformance(null);
    setPerformanceModalOpen(true);
  };

  const handleEditPerformance = (performance: StudentPerformance) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to edit performance records');
      return;
    }
    setSelectedPerformance(performance);
    setPerformanceModalOpen(true);
  };

  const handleDeletePerformance = (performance: StudentPerformance) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to delete performance records');
      return;
    }
    setItemToDelete(performance);
    setDeleteType('performance');
    setDeleteDialogOpen(true);
  };

  // Fee handlers
  const handleCreateFee = () => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to create fee records');
      return;
    }
    setSelectedFee(null);
    setFeeModalOpen(true);
  };

  const handleEditFee = (fee: StudentFee) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to edit fee records');
      return;
    }
    setSelectedFee(fee);
    setFeeModalOpen(true);
  };

  const handleDeleteFee = (fee: StudentFee) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to delete fee records');
      return;
    }
    setItemToDelete(fee);
    setDeleteType('fee');
    setDeleteDialogOpen(true);
  };

  // Delete confirmation
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      switch (deleteType) {
        case 'performance':
          await apiService.deletePerformance(itemToDelete.id);
          showSuccess('Performance Deleted', 'Performance record has been deleted successfully');
          await loadPerformances();
          break;
        case 'fee':
          await apiService.deleteFee(itemToDelete.id);
          showSuccess('Fee Deleted', 'Fee record has been deleted successfully');
          await loadFees();
          break;
      }
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      showError('Delete Failed', err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  // Table columns
  const performanceColumns: Column<StudentPerformance>[] = [
    {
      key: 'studentFirstName',
      title: 'Student',
      sortable: true,
      render: (_, record) => `${record.studentFirstName} ${record.studentLastName}`
    },
    { key: 'subject', title: 'Subject', sortable: true },
    {
      key: 'examType',
      title: 'Exam Type',
      sortable: true,
      render: (_, record) => getExamTypeDisplay(record.examType)
    },
    {
      key: 'examDate',
      title: 'Date',
      sortable: true,
      render: (_, record) => new Date(record.examDate).toLocaleDateString()
    },
    { key: 'formattedScore', title: 'Score', sortable: true },
    { key: 'grade', title: 'Grade', sortable: true },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canManageUsers && (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleEditPerformance(record)}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleDeletePerformance(record)}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      ),
    },
  ];

  const feeColumns: Column<StudentFee>[] = [
    {
      key: 'studentFirstName',
      title: 'Student',
      sortable: true,
      render: (_, record) => `${record.studentFirstName} ${record.studentLastName}`
    },
    { key: 'studentRollNumber', title: 'Roll No.', sortable: true },
    {
      key: 'feeType',
      title: 'Fee Type',
      sortable: true,
      render: (_, record) => getFeeTypeDisplay(record.feeType)
    },
    { key: 'term', title: 'Term', sortable: true },
    {
      key: 'totalAmount',
      title: 'Total',
      sortable: true,
      render: (_, record) => `$${record.totalAmount.toFixed(2)}`
    },
    {
      key: 'amountDue',
      title: 'Due',
      sortable: true,
      render: (_, record) => `$${record.amountDue.toFixed(2)}`
    },
    {
      key: 'paymentStatus',
      title: 'Status',
      sortable: true,
      render: (_, record) => (
        <Chip
          label={getPaymentStatusDisplay(record.paymentStatus)}
          color={getPaymentStatusColor(record.paymentStatus) as any}
          size="small"
        />
      )
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      sortable: true,
      render: (_, record) => new Date(record.dueDate).toLocaleDateString()
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canManageUsers && (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleEditFee(record)}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleDeleteFee(record)}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Layout>
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <SchoolIcon color="primary" />
          <Typography variant="h4" component="h1">
            Student Data Management
          </Typography>
        </Box>

        {/* Error Display */}
        {error && (
          <Box sx={{ mb: 3 }}>
            <ErrorMessage
              error={error}
              showRetry
              onRetry={() => {
                setError(null);
                handleRefresh();
              }}
            />
          </Box>
        )}

        {/* Main Content */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab
                icon={<AssessmentIcon />}
                label={`Performance Records (${performances.length})`}
                iconPosition="start"
              />
              <Tab
                icon={<MoneyIcon />}
                label={`Fee Records (${fees.length})`}
                iconPosition="start"
              />
              <Tab
                icon={<GroupIcon />}
                label="Assignments"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <Box sx={{ p: 3 }}>
              {/* Action Bar */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search performances..."
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ minWidth: 300 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                </Box>

                {canManageUsers && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreatePerformance}
                  >
                    Add Performance
                  </Button>
                )}
              </Box>

              {/* Performance Table */}
              <DataTable
                columns={performanceColumns}
                data={performances}
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalCount,
                  onChange: (page: number, newPageSize: number) => {
                    setCurrentPage(page);
                    if (newPageSize !== pageSize) {
                      setPageSize(newPageSize);
                    }
                  },
                }}
              />
            </Box>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Box sx={{ p: 3 }}>
              {/* Action Bar */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search fees..."
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ minWidth: 300 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                </Box>

                {canManageUsers && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateFee}
                  >
                    Add Fee Record
                  </Button>
                )}
              </Box>

              {/* Fee Table */}
              <DataTable
                columns={feeColumns}
                data={fees}
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalCount,
                  onChange: (page: number, newPageSize: number) => {
                    setCurrentPage(page);
                    if (newPageSize !== pageSize) {
                      setPageSize(newPageSize);
                    }
                  },
                }}
              />
            </Box>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Student Assignments
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {canManageUsers && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<GroupIcon />}
                      onClick={() => setFacultyAssignmentModalOpen(true)}
                    >
                      Assign Faculty
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PersonIcon />}
                      onClick={() => setParentAssignmentModalOpen(true)}
                    >
                      Assign Parent
                    </Button>
                  </>
                )}
              </Box>

              <Alert severity="info">
                Use the assignment forms to manage faculty and parent assignments for students.
                You can also manage assignments from the main Student Management page.

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Available Operations:</strong>
                  </Typography>
                  <ul>
                    <li>Assign faculty members to students for specific subjects</li>
                    <li>Assign parents/guardians to students with different permission levels</li>
                    <li>Manage bulk operations on student performance and fee records</li>
                    <li>View and edit comprehensive student-related data</li>
                  </ul>
                </Box>
              </Alert>
            </Box>
          </TabPanel>
        </Paper>

        {/* Performance Form Modal */}
        <Modal
          open={performanceModalOpen}
          onClose={() => setPerformanceModalOpen(false)}
          title={selectedPerformance ? 'Edit Performance Record' : 'Add Performance Record'}
          width="md"
        >
          <PerformanceForm
            students={students}
            initialData={selectedPerformance}
            onSubmit={async (data: PerformanceFormData) => {
              try {
                if (selectedPerformance) {
                  // For updates, send only fields expected by UpdateStudentPerformanceRequest
                  const updateData = {
                    subject: data.subject,
                    examType: data.examType,
                    examDate: data.examDate, // Will be converted to ISO format in API service
                    score: data.score, // Already converted to number by form
                    maxScore: data.maxScore || undefined,
                    examTitle: data.examTitle || undefined,
                    comments: data.comments || undefined,
                  };
                  await apiService.updatePerformance(selectedPerformance.id, updateData);
                  showSuccess('Performance Updated', 'Performance record has been updated successfully');
                } else {
                  // For creation, send all fields expected by CreateStudentPerformanceRequest
                  const createData = {
                    studentId: data.studentId, // Should already be a valid GUID string
                    subject: data.subject,
                    examType: data.examType,
                    examDate: data.examDate, // Will be converted to ISO format in API service
                    score: data.score, // Already converted to number by form
                    maxScore: data.maxScore || undefined,
                    examTitle: data.examTitle || undefined,
                    comments: data.comments || undefined,
                  };
                  await apiService.createPerformance(createData);
                  showSuccess('Performance Created', 'Performance record has been created successfully');
                }
                setPerformanceModalOpen(false);
                await loadPerformances();
              } catch (error) {
                throw error; // Let the form handle the error display
              }
            }}
            onCancel={() => setPerformanceModalOpen(false)}
          />
        </Modal>

        {/* Fee Form Modal */}
        <Modal
          open={feeModalOpen}
          onClose={() => setFeeModalOpen(false)}
          title={selectedFee ? 'Edit Fee Record' : 'Add Fee Record'}
          width="md"
        >
          <FeeForm
            students={students}
            initialData={selectedFee}
            onSubmit={async (data: FeeFormData) => {
              try {
                if (selectedFee) {
                  // For updates, send only fields expected by UpdateStudentFeeRequest
                  const updateData = {
                    feeType: data.feeType,
                    term: data.term,
                    totalAmount: data.totalAmount,
                    amountPaid: data.amountPaid || 0,
                    dueDate: data.dueDate,
                    notes: data.notes || undefined,
                  };
                  await apiService.updateFee(selectedFee.id, updateData);
                  showSuccess('Fee Updated', 'Fee record has been updated successfully');
                } else {
                  // For creation, send only fields expected by CreateStudentFeeRequest
                  const createData = {
                    studentId: data.studentId, // Should already be a valid GUID string
                    feeType: data.feeType,
                    term: data.term,
                    totalAmount: data.totalAmount, // Already converted to number by form
                    dueDate: data.dueDate, // Will be converted to ISO format in API service
                    notes: data.notes || undefined,
                  };
                  await apiService.createFee(createData);
                  showSuccess('Fee Created', 'Fee record has been created successfully');
                }
                setFeeModalOpen(false);
                await loadFees();
              } catch (error) {
                throw error; // Let the form handle the error display
              }
            }}
            onCancel={() => setFeeModalOpen(false)}
          />
        </Modal>

        {/* Faculty Assignment Form Modal */}
        <Modal
          open={facultyAssignmentModalOpen}
          onClose={() => setFacultyAssignmentModalOpen(false)}
          title="Assign Faculty to Student"
          width="md"
        >
          <FacultyAssignmentForm
            students={students}
            faculties={faculties}
            onSubmit={async (data: FacultyAssignmentFormData) => {
              try {
                await apiService.assignFacultyToStudent(data);
                showSuccess('Faculty Assigned', 'Faculty has been assigned to student successfully');
                setFacultyAssignmentModalOpen(false);
                // Refresh students to get updated assignments
                await loadStudents();
              } catch (error) {
                throw error; // Let the form handle the error display
              }
            }}
            onCancel={() => setFacultyAssignmentModalOpen(false)}
          />
        </Modal>

        {/* Parent Assignment Form Modal */}
        <Modal
          open={parentAssignmentModalOpen}
          onClose={() => setParentAssignmentModalOpen(false)}
          title="Assign Parent to Student"
          width="md"
        >
          <ParentAssignmentForm
            students={students}
            parents={parents}
            onSubmit={async (data: ParentAssignmentFormData) => {
              try {
                await apiService.assignParentToStudent(data);
                showSuccess('Parent Assigned', 'Parent has been assigned to student successfully');
                setParentAssignmentModalOpen(false);
                // Refresh students to get updated assignments
                await loadStudents();
              } catch (error) {
                throw error; // Let the form handle the error display
              }
            }}
            onCancel={() => setParentAssignmentModalOpen(false)}
          />
        </Modal>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this {deleteType} record? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};