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
  FamilyRestroom as FamilyIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import {
  DataTable,
  Modal,
  ErrorMessage,
  ParentForm,
} from '../ui';
import { Grid } from '../ui/Grid';
import { Layout } from '../layout';
import { apiService } from '../../services/api';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import type { Parent, Student } from '../../types/user';
import type { ParentFormData } from '../../types/forms';
import type { Column } from '../../types/components';
import type { ParentFilters } from '../../types/api';
import { getGenderDisplay, getParentTypeDisplay, getParentTypeColor } from '../../utils/enumUtils';
import { ParentType } from '../../types/user';

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
      id={`parent-tabpanel-${index}`}
      aria-labelledby={`parent-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

interface ParentDetailViewProps {
  parent: Parent;
  onClose: () => void;
  onEdit: (parent: Parent) => void;
  onDelete: (parent: Parent) => void;
  students: Student[];
}

const ParentDetailView: React.FC<ParentDetailViewProps> = ({
  parent,
  onClose,
  onEdit,
  onDelete,
  students,
}) => {
  const { canManageUsers } = useAdminPermissions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get assigned students for this parent (filter students that have this parent assigned)
  const assignedStudents = students.filter(student => student.parentId === parent.id);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Parent Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canManageUsers && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => onEdit(parent)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(parent)}
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
                    {parent.fullName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {parent.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">
                    {parent.phoneNumber}
                  </Typography>
                </Box>

                {parent.alternatePhoneNumber && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Alternate Phone
                    </Typography>
                    <Typography variant="body1">
                      {parent.alternatePhoneNumber}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(parent.dateOfBirth)} (Age: {parent.age})
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography variant="body1">
                    {getGenderDisplay(parent.gender)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Parent Type
                  </Typography>
                  <Chip
                    label={getParentTypeDisplay(parent.parentType)}
                    color={getParentTypeColor(parent.parentType) as any}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact & Address Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon />
                Contact & Address
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {parent.address}
                  </Typography>
                </Box>

                {parent.city && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      City
                    </Typography>
                    <Typography variant="body1">
                      {parent.city}
                    </Typography>
                  </Box>
                )}

                {parent.state && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      State
                    </Typography>
                    <Typography variant="body1">
                      {parent.state}
                    </Typography>
                  </Box>
                )}

                {parent.postalCode && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Postal Code
                    </Typography>
                    <Typography variant="body1">
                      {parent.postalCode}
                    </Typography>
                  </Box>
                )}

                {parent.country && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Country
                    </Typography>
                    <Typography variant="body1">
                      {parent.country}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Professional Information */}
        {(parent.occupation || parent.employer || parent.workPhone) && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon />
                  Professional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {parent.occupation && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Occupation
                      </Typography>
                      <Typography variant="body1">
                        {parent.occupation}
                      </Typography>
                    </Box>
                  )}

                  {parent.employer && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Employer
                      </Typography>
                      <Typography variant="body1">
                        {parent.employer}
                      </Typography>
                    </Box>
                  )}

                  {parent.workPhone && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Work Phone
                      </Typography>
                      <Typography variant="body1">
                        {parent.workPhone}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Emergency Contact Information */}
        {(parent.emergencyContactName || parent.emergencyContactPhone) && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon />
                  Emergency Contact
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {parent.emergencyContactName && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Emergency Contact Name
                      </Typography>
                      <Typography variant="body1">
                        {parent.emergencyContactName}
                      </Typography>
                    </Box>
                  )}

                  {parent.emergencyContactPhone && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Emergency Contact Phone
                      </Typography>
                      <Typography variant="body1">
                        {parent.emergencyContactPhone}
                      </Typography>
                    </Box>
                  )}

                  {parent.emergencyContactRelationship && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Relationship
                      </Typography>
                      <Typography variant="body1">
                        {parent.emergencyContactRelationship}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Permissions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                Permissions
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Emergency Contact
                  </Typography>
                  <Chip
                    label={parent.isEmergencyContact ? 'Yes' : 'No'}
                    color={parent.isEmergencyContact ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Authorized to Pickup
                  </Typography>
                  <Chip
                    label={parent.isAuthorizedToPickup ? 'Yes' : 'No'}
                    color={parent.isAuthorizedToPickup ? 'success' : 'default'}
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
                <FamilyIcon />
                Assigned Students ({assignedStudents.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {assignedStudents.length > 0 ? (
                  assignedStudents.map((student) => (
                    <Chip
                      key={student.id}
                      label={`${student.fullName} (${student.rollNumber})`}
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

export const ParentManagement: React.FC = () => {
  const { canManageUsers } = useAdminPermissions();
  const { showSuccess, showError } = useToast();
  const { isAuthenticated } = useAuth();

  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  // Data states
  const [allParents, setAllParents] = useState<Parent[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [totalParents, setTotalParents] = useState(0);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Current item states
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ParentFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Client-side filtering and pagination
  const filteredParents = useMemo(() => {
    let filtered = [...allParents];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(parent =>
        parent.fullName.toLowerCase().includes(searchLower) ||
        parent.email.toLowerCase().includes(searchLower) ||
        parent.phoneNumber.toLowerCase().includes(searchLower) ||
        (parent.alternatePhoneNumber && parent.alternatePhoneNumber.toLowerCase().includes(searchLower)) ||
        (parent.occupation && parent.occupation.toLowerCase().includes(searchLower)) ||
        (parent.employer && parent.employer.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (filters.parentType !== undefined) {
      filtered = filtered.filter(parent => parent.parentType === filters.parentType);
    }

    if (filters.city) {
      filtered = filtered.filter(parent =>
        parent.city && parent.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.state) {
      filtered = filtered.filter(parent =>
        parent.state && parent.state.toLowerCase().includes(filters.state!.toLowerCase())
      );
    }

    if (filters.isEmergencyContact !== undefined) {
      filtered = filtered.filter(parent => parent.isEmergencyContact === filters.isEmergencyContact);
    }

    if (filters.isAuthorizedToPickup !== undefined) {
      filtered = filtered.filter(parent => parent.isAuthorizedToPickup === filters.isAuthorizedToPickup);
    }

    return filtered;
  }, [allParents, searchTerm, filters]);

  // Paginated parents
  const paginatedParents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredParents.slice(startIndex, endIndex);
  }, [filteredParents, currentPage, pageSize]);

  // Update counts when filtered data changes
  useEffect(() => {
    setTotalCount(filteredParents.length);
    setTotalParents(filteredParents.length);
    setParents(paginatedParents);
  }, [filteredParents, paginatedParents]);

  // Load data
  const loadParents = useCallback(async (abortSignal?: AbortSignal) => {
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

      const response = await apiService.getParents();

      // Check if request was aborted before updating state
      if (abortSignal?.aborted) {
        return;
      }

      // Backend returns direct array, not paginated response
      const validParents = Array.isArray(response) ? response.filter(parent => {
        return parent && typeof parent === 'object' && parent.id;
      }) : [];

      setAllParents([...validParents]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load parents');
      setAllParents([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadStudents = useCallback(async () => {
    try {
      const response = await apiService.getStudents();
      // Backend returns paginated response for students
      const validStudents = response?.data ? response.data.filter(student => {
        return student && typeof student === 'object' && student.id;
      }) : [];
      setStudents(validStudents);
    } catch (err) {
      // Set empty array on error
      setStudents([]);
    }
  }, []);

  // Effects
  useEffect(() => {
    const abortController = new AbortController();
    loadParents(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [loadParents]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Reset to first page when search changes
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof ParentFilters, value: any) => {
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
    loadParents();
  };

  const handleCreateParent = () => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to create parents');
      return;
    }
    setSelectedParent(null);
    setCreateModalOpen(true);
  };

  const handleEditParent = (parent: Parent) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to edit parents');
      return;
    }
    // Close detail modal if it's open
    setDetailModalOpen(false);
    setSelectedParent(parent);
    setEditModalOpen(true);
  };

  const handleViewParent = (parent: Parent) => {
    setSelectedParent(parent);
    setDetailModalOpen(true);
  };

  const handleDeleteParent = (parent: Parent) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to delete parents');
      return;
    }
    setParentToDelete(parent);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!parentToDelete) return;

    try {
      await apiService.deleteParent(parentToDelete.id);
      showSuccess(
        'Parent Deleted',
        `${parentToDelete.fullName} has been deleted successfully`
      );
      setDeleteDialogOpen(false);
      setParentToDelete(null);
      await loadParents();
    } catch (err) {
      console.error('Error deleting parent:', err);
      showError(
        'Delete Failed',
        err instanceof Error ? err.message : 'Failed to delete parent'
      );
    }
  };

  const handleFormSubmit = async (data: ParentFormData) => {
    try {
      setFormSubmitting(true);

      // Convert form data to API format
      const apiData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        // Convert empty userId to undefined
        userId: data.userId || undefined,
      };

      if (selectedParent) {
        // Update existing parent
        await apiService.updateParent(selectedParent.id, apiData);
        showSuccess(
          'Parent Updated',
          `${data.firstName} ${data.lastName} has been updated successfully`
        );
        setEditModalOpen(false);
      } else {
        // Create new parent
        await apiService.createParent(apiData);
        showSuccess(
          'Parent Created',
          `${data.firstName} ${data.lastName} has been created successfully`
        );
        setCreateModalOpen(false);
      }

      setSelectedParent(null);
      await loadParents();
    } catch (err) {
      console.error('Form submission error:', err);
      showError(
        'Submission Failed',
        err instanceof Error ? err.message : 'Failed to save parent'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Table columns
  const parentColumns: Column<Parent>[] = [
    { key: 'fullName', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'phoneNumber', title: 'Phone', sortable: true },
    {
      key: 'parentType',
      title: 'Type',
      sortable: true,
      render: (_, record) => (
        <Chip
          label={getParentTypeDisplay(record.parentType)}
          color={getParentTypeColor(record.parentType) as any}
          size="small"
        />
      )
    },
    { key: 'city', title: 'City', sortable: true },
    {
      key: 'isEmergencyContact',
      title: 'Emergency Contact',
      sortable: true,
      render: (_, record) => (
        <Chip
          label={record.isEmergencyContact ? 'Yes' : 'No'}
          color={record.isEmergencyContact ? 'success' : 'default'}
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
              handleViewParent(record);
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
                  handleEditParent(record);
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
                  handleDeleteParent(record);
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
          <FamilyIcon color="primary" />
          <Typography variant="h4" component="h1">
            Parent Management
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
                loadParents();
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
                label={`All Parents (${totalParents})`}
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
                    placeholder="Search parents..."
                    value={searchTerm}
                    onChange={handleSearch}
                    slotProps={{
                      input: {
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
                      }
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
                    onClick={handleCreateParent}
                  >
                    Add Parent
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
                          <InputLabel>Parent Type</InputLabel>
                          <Select
                            value={filters.parentType !== undefined ? String(filters.parentType) : ''}
                            label="Parent Type"
                            onChange={(e) => {
                              const value = e.target.value;
                              handleFilterChange('parentType', value === '' ? undefined : Number(value));
                            }}
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value={String(ParentType.PRIMARY)}>Primary</MenuItem>
                            <MenuItem value={String(ParentType.SECONDARY)}>Secondary</MenuItem>
                            <MenuItem value={String(ParentType.GUARDIAN)}>Guardian</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="City"
                          value={filters.city || ''}
                          onChange={(e) => handleFilterChange('city', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="State"
                          value={filters.state || ''}
                          onChange={(e) => handleFilterChange('state', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Emergency Contact</InputLabel>
                          <Select
                            value={filters.isEmergencyContact !== undefined ? String(filters.isEmergencyContact) : ''}
                            label="Emergency Contact"
                            onChange={(e) => {
                              const value = e.target.value;
                              handleFilterChange('isEmergencyContact', value === '' ? undefined : value === 'true');
                            }}
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
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

              {/* Parents Table */}
              <DataTable
                data={parents}
                columns={parentColumns}
                loading={loading}
                onRowClick={handleViewParent}
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
                Use the search and filter options in the "All Parents" tab to find specific parents.
                You can search by name, email, phone number, occupation, or use filters for parent type, location, and permissions.
              </Alert>
            </Box>
          </TabPanel>
        </Paper>

        {/* Create Parent Modal */}
        <Modal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create New Parent"
          width="lg"
        >
          <ParentForm
            mode="create"
            onSubmit={handleFormSubmit}
            onCancel={() => setCreateModalOpen(false)}
            loading={formSubmitting}
          />
        </Modal>

        {/* Edit Parent Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Parent"
          width="lg"
        >
          {selectedParent && (
            <ParentForm
              mode="edit"
              initialData={{
                firstName: selectedParent.firstName,
                lastName: selectedParent.lastName,
                email: selectedParent.email,
                phoneNumber: selectedParent.phoneNumber,
                alternatePhoneNumber: selectedParent.alternatePhoneNumber || '',
                dateOfBirth: selectedParent.dateOfBirth.split('T')[0],
                address: selectedParent.address,
                city: selectedParent.city || '',
                state: selectedParent.state || '',
                postalCode: selectedParent.postalCode || '',
                country: selectedParent.country || 'USA',
                gender: selectedParent.gender,
                occupation: selectedParent.occupation || '',
                employer: selectedParent.employer || '',
                workPhone: selectedParent.workPhone || '',
                emergencyContactName: selectedParent.emergencyContactName || '',
                emergencyContactPhone: selectedParent.emergencyContactPhone || '',
                emergencyContactRelationship: selectedParent.emergencyContactRelationship || '',
                parentType: selectedParent.parentType,
                isEmergencyContact: selectedParent.isEmergencyContact,
                isAuthorizedToPickup: selectedParent.isAuthorizedToPickup,
                userId: selectedParent.userId || '',
              }}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditModalOpen(false)}
              loading={formSubmitting}
            />
          )}
        </Modal>

        {/* Parent Detail Modal */}
        <Modal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title=""
          width="lg"
        >
          {selectedParent && (
            <ParentDetailView
              parent={selectedParent}
              onClose={() => setDetailModalOpen(false)}
              onEdit={handleEditParent}
              onDelete={handleDeleteParent}
              students={students}
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
              Are you sure you want to delete parent{' '}
              <strong>{parentToDelete?.fullName}</strong>?
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

export default ParentManagement;