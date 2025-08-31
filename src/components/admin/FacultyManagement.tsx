import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Card,
  CardContent,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  DataTable,
  Modal,
  ErrorMessage,
  FacultyForm,
} from '../ui';
import { Grid } from '../ui/Grid';
import { Layout } from '../layout';
import { apiService } from '../../services/api';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import type { Faculty } from '../../types/user';
import type { FacultyFormData } from '../../types/forms';
import type { Column } from '../../types/components';
import type { FacultyFilters } from '../../types/api';
import { getGenderDisplay } from '../../utils/enumUtils';

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
      id={`faculty-tabpanel-${index}`}
      aria-labelledby={`faculty-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

interface FacultyDetailViewProps {
  faculty: Faculty;
  onClose: () => void;
  onEdit: (faculty: Faculty) => void;
  onDelete: (faculty: Faculty) => void;
}

const FacultyDetailView: React.FC<FacultyDetailViewProps> = ({
  faculty,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { canManageUsers } = useAdminPermissions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get assigned students for this faculty from the faculty object
  const assignedStudents = faculty.assignedStudents?.filter(student => student.isActive) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Faculty Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canManageUsers && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => onEdit(faculty)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(faculty)}
              >
                Delete
              </Button>
            </>
          )}
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {faculty.fullName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {faculty.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">
                    {faculty.phoneNumber}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(faculty.dateOfBirth)} (Age: {faculty.age})
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography variant="body1">
                    {getGenderDisplay(faculty.gender)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {faculty.address}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Professional Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon />
                Professional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Employee ID
                  </Typography>
                  <Typography variant="body1">
                    {faculty.employeeId || 'Not assigned'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1">
                    {faculty.department}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Subject
                  </Typography>
                  <Typography variant="body1">
                    {faculty.subject}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Hire Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(faculty.hireDate)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Years of Service
                  </Typography>
                  <Typography variant="body1">
                    {faculty.yearsOfService} years
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={faculty.isActive ? 'Active' : 'Inactive'}
                    color={faculty.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Assigned Students */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon />
                Assigned Students ({assignedStudents.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {assignedStudents.length > 0 ? (
                  assignedStudents.map((student) => (
                    <Chip
                      key={student.studentId}
                      label={`${student.studentName} (${student.studentRollNumber})`}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No students assigned
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export const FacultyManagement: React.FC = () => {
  const { canManageUsers } = useAdminPermissions();
  const { showSuccess, showError } = useToast();
  const { isAuthenticated } = useAuth();

  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  // Data states
  const [allFaculties, setAllFaculties] = useState<Faculty[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  const [totalFaculties, setTotalFaculties] = useState(0);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Current item states
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FacultyFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Client-side filtering and pagination
  const filteredFaculties = useMemo(() => {
    let filtered = [...allFaculties];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(faculty =>
        faculty.fullName.toLowerCase().includes(searchLower) ||
        faculty.email.toLowerCase().includes(searchLower) ||
        faculty.department.toLowerCase().includes(searchLower) ||
        faculty.subject.toLowerCase().includes(searchLower) ||
        (faculty.employeeId && faculty.employeeId.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (filters.department) {
      filtered = filtered.filter(faculty =>
        faculty.department.toLowerCase().includes(filters.department!.toLowerCase())
      );
    }

    if (filters.subject) {
      filtered = filtered.filter(faculty =>
        faculty.subject.toLowerCase().includes(filters.subject!.toLowerCase())
      );
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(faculty => faculty.isActive === filters.isActive);
    }

    return filtered;
  }, [allFaculties, searchTerm, filters]);

  // Paginated faculties
  const paginatedFaculties = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredFaculties.slice(startIndex, endIndex);
  }, [filteredFaculties, currentPage, pageSize]);

  // Update counts when filtered data changes
  useEffect(() => {
    setTotalCount(filteredFaculties.length);
    setTotalFaculties(filteredFaculties.length);
    setFaculties(paginatedFaculties);
  }, [filteredFaculties, paginatedFaculties]);

  // Load data
  const loadFaculties = useCallback(async (abortSignal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      // Check if request was aborted
      if (abortSignal?.aborted) {
        return;
      }

      // Check authentication status
      if (!isAuthenticated) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await apiService.getFaculties();

      // Check if request was aborted before updating state
      if (abortSignal?.aborted) {
        return;
      }

      // Backend returns direct array, not paginated response
      const validFaculties = Array.isArray(response) ? response.filter(faculty => {
        return faculty && typeof faculty === 'object' && faculty.id;
      }) : [];

      setAllFaculties([...validFaculties]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load faculties');
      setAllFaculties([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);



  // Effects
  useEffect(() => {
    const abortController = new AbortController();
    loadFaculties(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [loadFaculties]);



  // Handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Reset to first page when search changes
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof FacultyFilters, value: any) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value === '' ? undefined : value,
      };
      return newFilters;
    });
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (page: number, newPageSize: number) => {
    if (newPageSize !== pageSize) {
      // Page size changed
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset to first page when page size changes
    } else {
      // Just page changed
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    loadFaculties();
  };

  const handleCreateFaculty = () => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to create faculty');
      return;
    }
    setSelectedFaculty(null);
    setCreateModalOpen(true);
  };

  const handleEditFaculty = (faculty: Faculty) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to edit faculty');
      return;
    }
    // Close detail modal if it's open
    setDetailModalOpen(false);
    setSelectedFaculty(faculty);
    setEditModalOpen(true);
  };

  const handleViewFaculty = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setDetailModalOpen(true);
  };

  const handleDeleteFaculty = (faculty: Faculty) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to delete faculty');
      return;
    }
    setFacultyToDelete(faculty);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!facultyToDelete) return;

    try {
      await apiService.deleteFaculty(facultyToDelete.id);
      showSuccess(
        'Faculty Deleted',
        `${facultyToDelete.fullName} has been deleted successfully`
      );
      setDeleteDialogOpen(false);
      setFacultyToDelete(null);
      await loadFaculties();
    } catch (err) {
      console.error('Error deleting faculty:', err);
      showError(
        'Delete Failed',
        err instanceof Error ? err.message : 'Failed to delete faculty'
      );
    }
  };

  const handleFormSubmit = async (data: FacultyFormData) => {
    try {
      setFormSubmitting(true);

      // Convert form data to API format
      const apiData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        hireDate: new Date(data.hireDate),
        // Convert empty userId to undefined
        userId: data.userId || undefined,
      };

      if (selectedFaculty) {
        // Update existing faculty
        await apiService.updateFaculty(selectedFaculty.id, apiData);
        showSuccess(
          'Faculty Updated',
          `${data.firstName} ${data.lastName} has been updated successfully`
        );
        setEditModalOpen(false);
      } else {
        // Create new faculty
        await apiService.createFaculty(apiData);
        showSuccess(
          'Faculty Created',
          `${data.firstName} ${data.lastName} has been created successfully`
        );
        setCreateModalOpen(false);
      }

      setSelectedFaculty(null);
      await loadFaculties();
    } catch (err) {
      console.error('Form submission error:', err);
      showError(
        'Submission Failed',
        err instanceof Error ? err.message : 'Failed to save faculty'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Table columns
  const facultyColumns: Column<Faculty>[] = [
    { key: 'employeeId', title: 'Employee ID', sortable: true },
    { key: 'fullName', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'department', title: 'Department', sortable: true },
    { key: 'subject', title: 'Subject', sortable: true },
    {
      key: 'isActive',
      title: 'Status',
      sortable: true,
      render: (_, record) => (
        <Chip
          label={record.isActive ? 'Active' : 'Inactive'}
          color={record.isActive ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              handleViewFaculty(record);
            }}
          >
            View
          </Button>
          {canManageUsers && (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditFaculty(record);
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFaculty(record);
                }}
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
          <WorkIcon color="primary" />
          <Typography variant="h4" component="h1">
            Faculty Management
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
                loadFaculties();
              }}
            />
          </Box>
        )}

        {/* Main Content */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab
                icon={<PersonIcon />}
                label={`All Faculty (${totalFaculties})`}
                iconPosition="start"
              />
              <Tab
                icon={<SearchIcon />}
                label="Search & Filter"
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
                    placeholder="Search faculty..."
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchTerm('')}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ minWidth: 300 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    Filters
                  </Button>
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
                    onClick={handleCreateFaculty}
                  >
                    Add Faculty
                  </Button>
                )}
              </Box>

              {/* Filters */}
              {showFilters && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Filters
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Department"
                          value={filters.department || ''}
                          onChange={(e) => handleFilterChange('department', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Subject"
                          value={filters.subject || ''}
                          onChange={(e) => handleFilterChange('subject', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={filters.isActive !== undefined ? String(filters.isActive) : ''}
                            label="Status"
                            onChange={(e) => {
                              const value = e.target.value;
                              handleFilterChange('isActive', value === '' ? undefined : value === 'true');
                            }}
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="true">Active</MenuItem>
                            <MenuItem value="false">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={clearFilters}
                        startIcon={<ClearIcon />}
                      >
                        Clear Filters
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Faculty Table */}
              <DataTable
                data={faculties}
                columns={facultyColumns}
                loading={loading}
                onRowClick={handleViewFaculty}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalCount,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handlePageChange,
                }}
              />
            </Box>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Box sx={{ p: 3 }}>
              <Alert severity="info">
                Advanced search and filtering features will be available here.
              </Alert>
            </Box>
          </TabPanel>
        </Paper>

        {/* Create Faculty Modal */}
        <Modal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create New Faculty"
          width="md"
        >
          <FacultyForm
            mode="create"
            onSubmit={handleFormSubmit}
            onCancel={() => setCreateModalOpen(false)}
            loading={formSubmitting}
          />
        </Modal>

        {/* Edit Faculty Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Faculty"
          width="md"
        >
          {selectedFaculty && (
            <FacultyForm
              mode="edit"
              initialData={{
                firstName: selectedFaculty.firstName,
                lastName: selectedFaculty.lastName,
                email: selectedFaculty.email,
                phoneNumber: selectedFaculty.phoneNumber,
                dateOfBirth: selectedFaculty.dateOfBirth.split('T')[0],
                address: selectedFaculty.address,
                gender: selectedFaculty.gender,
                department: selectedFaculty.department,
                subject: selectedFaculty.subject,
                hireDate: selectedFaculty.hireDate.split('T')[0],
                userId: selectedFaculty.userId || '',
                isActive: selectedFaculty.isActive,
              }}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditModalOpen(false)}
              loading={formSubmitting}
            />
          )}
        </Modal>

        {/* Faculty Detail Modal */}
        <Modal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title=""
          width="lg"
        >
          {selectedFaculty && (
            <FacultyDetailView
              faculty={selectedFaculty}
              onClose={() => setDetailModalOpen(false)}
              onEdit={handleEditFaculty}
              onDelete={handleDeleteFaculty}
            />
          )}
        </Modal>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete faculty member{' '}
              <strong>{facultyToDelete?.fullName}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default FacultyManagement;