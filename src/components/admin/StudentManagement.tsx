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
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import {
  DataTable,
  Modal,
  ErrorMessage,
  StudentForm,
} from '../ui';
import { Grid } from '../ui/Grid';
import { Layout } from '../layout';
import { apiService } from '../../services/api';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import type { Student, Faculty, Parent } from '../../types/user';
import type { StudentFormData } from '../../types/forms';
import type { Column } from '../../types/components';
import type { StudentFilters } from '../../types/api';
import { StudentStatus, Gender } from '../../types/user';
import { getGenderDisplay, getStudentStatusDisplay, getStudentStatusColor } from '../../utils/enumUtils';

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
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

interface StudentDetailViewProps {
  student: Student;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  parents: Parent[];
}

const StudentDetailView: React.FC<StudentDetailViewProps> = ({
  student,
  onClose,
  onEdit,
  onDelete,
  parents,
}) => {
  const { canManageUsers } = useAdminPermissions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Remove the local getStatusColor function since we're using the utility

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Student Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canManageUsers && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => onEdit(student)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(student)}
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
                    {student.fullName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {student.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">
                    {student.phoneNumber}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(student.dateOfBirth)} (Age: {student.age})
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography variant="body1">
                    {getGenderDisplay(student.gender)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {student.address}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Academic Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon />
                Academic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Roll Number
                  </Typography>
                  <Typography variant="body1">
                    {student.rollNumber}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Grade & Section
                  </Typography>
                  <Typography variant="body1">
                    {student.grade ? `Grade ${student.grade}` : 'Not assigned'}
                    {student.section && ` - Section ${student.section}`}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Enrollment Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(student.enrollmentDate)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={getStudentStatusDisplay(student.status)}
                    color={getStudentStatusColor(student.status) as any}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Enrollment Status
                  </Typography>
                  <Chip
                    label={student.isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                    color={student.isEnrolled ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Assigned Parent */}
        {student.parentId && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Assigned Parent
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(() => {
                    const parent = parents.find((p: any) => p.id === student.parentId);
                    const parentName = parent ? parent.fullName : `Parent ID: ${student.parentId}`;

                    return (
                      <Chip
                        label={parentName}
                        variant="outlined"
                        size="small"
                        color={parent ? 'primary' : 'secondary'}
                      />
                    );
                  })()}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Assigned Faculty */}
        {student.assignedFaculties && student.assignedFaculties.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon />
                  Assigned Faculty ({student.assignedFaculties.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {student.assignedFaculties?.length > 0 ? (
                    student.assignedFaculties.map((assignment) => {
                      // Use the embedded faculty data from the assignment
                      const facultyName = assignment.fullName ||
                        `${assignment.firstName || ''} ${assignment.lastName || ''}`.trim() ||
                        'Unknown Faculty';

                      const subject = assignment.subject || '';
                      const displayName = subject ? `${facultyName} - ${subject}` : facultyName;

                      return (
                        <Chip
                          key={assignment.id}
                          label={displayName}
                          variant="outlined"
                          size="small"
                          color="primary"
                        />
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No faculty assigned
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export const StudentManagement: React.FC = () => {
  const { canManageUsers } = useAdminPermissions();
  const { showSuccess, showError } = useToast();
  const { isAuthenticated } = useAuth();

  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Current item states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StudentFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Memoize the search filters to prevent unnecessary re-renders
  const searchFilters = useMemo(() => {
    return {
      ...filters,
      search: searchTerm || undefined,
      page: currentPage,
      limit: pageSize,
    };
  }, [filters, searchTerm, currentPage, pageSize]);

  // Load data
  const loadStudents = useCallback(async (abortSignal?: AbortSignal) => {

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
      const response = await apiService.getStudents(searchFilters);

      // The backend now returns a paginated response
      if (!response || !response.data) {
        setStudents([]);
        setTotalStudents(0);
        setTotalCount(0);
        return;
      }

      // Filter out any null/undefined students and ensure they have required properties
      const validStudents = response.data.filter(student => {
        return student && typeof student === 'object' && student.id;
      });

      // Check if request was aborted before updating state
      if (abortSignal?.aborted) {
        return;
      }

      // Update state with paginated data
      setStudents([...validStudents]);
      setTotalStudents(validStudents.length);
      setTotalCount(response.totalCount);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
      // Ensure we set empty arrays on error
      setStudents([]);
      setTotalStudents(0);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [searchFilters, isAuthenticated]);

  const loadParentsAndFaculties = useCallback(async () => {
    try {
      const [parentsResponse, facultiesResponse] = await Promise.all([
        apiService.getParents(),
        apiService.getFaculties(),
      ]);


      // Backend returns direct arrays, not paginated responses
      setParents(Array.isArray(parentsResponse) ? parentsResponse : []);
      setFaculties(Array.isArray(facultiesResponse) ? facultiesResponse : []);
    } catch (err) {
      // Set empty arrays on error
      setParents([]);
      setFaculties([]);
    }
  }, []);

  // Effects
  useEffect(() => {
    const abortController = new AbortController();
    loadStudents(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [loadStudents]);

  useEffect(() => {
    loadParentsAndFaculties();
  }, [loadParentsAndFaculties]);

  // Monitor students state changes
  useEffect(() => {
    // Students state monitoring removed
  }, [students]);

  // Handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Reset to first page when search changes
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof StudentFilters, value: any) => {
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

  const handleRefresh = () => {
    setCurrentPage(1);
    loadStudents();
  };

  const handleCreateStudent = () => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to create students');
      return;
    }
    setSelectedStudent(null);
    setCreateModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to edit students');
      return;
    }
    // Close detail modal if it's open
    setDetailModalOpen(false);
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setDetailModalOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to delete students');
      return;
    }
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      await apiService.deleteStudent(studentToDelete.id);
      showSuccess(
        'Student Deleted',
        `${studentToDelete.fullName} has been deleted successfully`
      );
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      await loadStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      showError(
        'Delete Failed',
        err instanceof Error ? err.message : 'Failed to delete student'
      );
    }
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

  const handleFormSubmit = async (data: StudentFormData) => {
    try {
      setFormSubmitting(true);

      // Convert form data to API format
      const apiData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        enrollmentDate: new Date(data.enrollmentDate),
        // Convert empty parentId to undefined
        parentId: data.parentId || undefined,
        // Convert empty facultyIds to empty array
        facultyIds: Array.isArray(data.facultyIds) ? data.facultyIds.filter(id => id) : [],
      };

      if (selectedStudent) {
        // Update existing student
        await apiService.updateStudent(selectedStudent.id, apiData);
        showSuccess(
          'Student Updated',
          `${data.firstName} ${data.lastName} has been updated successfully`
        );
        setEditModalOpen(false);
      } else {
        // Create new student
        await apiService.createStudent(apiData);
        showSuccess(
          'Student Created',
          `${data.firstName} ${data.lastName} has been created successfully`
        );
        setCreateModalOpen(false);
      }

      setSelectedStudent(null);
      await loadStudents();
    } catch (err) {
      console.error('Form submission error:', err);
      showError(
        'Submission Failed',
        err instanceof Error ? err.message : 'Failed to save student'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Table columns - simplified to match working AdminManagement
  const studentColumns: Column<Student>[] = [
    { key: 'rollNumber', title: 'Roll Number', sortable: true },
    { key: 'fullName', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'grade', title: 'Grade', sortable: true },
    { key: 'section', title: 'Section', sortable: true },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (_, record) => (
        <Chip
          label={getStudentStatusDisplay(record.status)}
          color={getStudentStatusColor(record.status) as any}
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
              handleViewStudent(record);
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
                  handleEditStudent(record);
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
                  handleDeleteStudent(record);
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
          <SchoolIcon color="primary" />
          <Typography variant="h4" component="h1">
            Student Management
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
                loadStudents();
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
                label={`All Students (${totalStudents})`}
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
                    placeholder="Search students..."
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
                    onClick={handleCreateStudent}
                  >
                    Add Student
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
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={filters.status !== undefined ? String(filters.status) : ''}
                            label="Status"
                            onChange={(e) => {
                              const value = e.target.value;
                              handleFilterChange('status', value === '' ? undefined : Number(value));
                            }}
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value={String(StudentStatus.ACTIVE)}>Active</MenuItem>
                            <MenuItem value={String(StudentStatus.INACTIVE)}>Inactive</MenuItem>
                            <MenuItem value={String(StudentStatus.SUSPENDED)}>Suspended</MenuItem>
                            <MenuItem value={String(StudentStatus.GRADUATED)}>Graduated</MenuItem>
                            <MenuItem value={String(StudentStatus.TRANSFERRED)}>Transferred</MenuItem>
                            <MenuItem value={String(StudentStatus.WITHDRAWN)}>Withdrawn</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={filters.gender !== undefined ? String(filters.gender) : ''}
                            label="Gender"
                            onChange={(e) => {
                              const value = e.target.value;
                              handleFilterChange('gender', value === '' ? undefined : Number(value));
                            }}
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value={String(Gender.MALE)}>Male</MenuItem>
                            <MenuItem value={String(Gender.FEMALE)}>Female</MenuItem>
                            <MenuItem value={String(Gender.OTHER)}>Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Grade"
                          value={filters.grade || ''}
                          onChange={(e) => handleFilterChange('grade', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Section"
                          value={filters.section || ''}
                          onChange={(e) => handleFilterChange('section', e.target.value)}
                        />
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

              {/* Students Table */}
              <DataTable
                data={students || []}
                columns={studentColumns}
                loading={loading}
                onRowClick={handleViewStudent}
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
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Use the search and filter options in the "All Students" tab to find specific students.
                  You can search by name, email, roll number, or use filters for status, gender, grade, and section.
                </Typography>
              </Alert>
            </Box>
          </TabPanel>
        </Paper >

        {/* Create Student Modal */}
        < Modal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create New Student"
          width="lg"
          loading={formSubmitting}
        >
          <StudentForm
            onSubmit={handleFormSubmit}
            onCancel={() => setCreateModalOpen(false)}
            loading={formSubmitting}
            mode="create"
            parents={Array.isArray(parents) ? parents.map(p => ({ id: p.id, fullName: p.fullName })) : []}
            faculties={Array.isArray(faculties) ? faculties.map(f => ({ id: f.id, fullName: f.fullName })) : []}
          />
        </Modal >

        {/* Edit Student Modal */}
        < Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Student"
          width="lg"
          loading={formSubmitting}
        >
          {selectedStudent && (
            <StudentForm
              initialData={{
                ...selectedStudent,
                // Since faculty IDs don't match between assignments and available faculties,
                // we need to find matching faculties by name or other criteria
                facultyIds: (() => {
                  if (!selectedStudent.assignedFaculties || !Array.isArray(faculties)) {
                    return [];
                  }

                  const matchedIds: string[] = [];
                  selectedStudent.assignedFaculties.forEach(assignment => {
                    // Use the assignment ID directly since it contains the faculty ID
                    const matchingFaculty = faculties.find((f: any) =>
                      f.fullName === assignment.fullName ||
                      `${f.firstName} ${f.lastName}` === assignment.fullName
                    );

                    if (matchingFaculty) {
                      matchedIds.push(matchingFaculty.id);
                    } else {
                      // If we can't find by name, use the assignment ID
                      matchedIds.push(assignment.id);
                    }
                  });


                  return matchedIds;
                })()
              }}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditModalOpen(false)}
              loading={formSubmitting}
              mode="edit"
              parents={Array.isArray(parents) ? parents.map(p => ({ id: p.id, fullName: p.fullName })) : []}
              faculties={Array.isArray(faculties) ? faculties.map(f => ({ id: f.id, fullName: f.fullName })) : []}
            />
          )}
        </Modal >

        {/* Student Detail Modal */}
        < Modal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title=""
          width="lg"
        >
          {selectedStudent && (
            <StudentDetailView
              student={selectedStudent}
              onClose={() => setDetailModalOpen(false)}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
              parents={parents}
            />
          )}
        </Modal >

        {/* Delete Confirmation Dialog */}
        < Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete student "{studentToDelete?.fullName}"?
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
        </Dialog >
      </Box >
    </Layout >
  );
};

export default StudentManagement;