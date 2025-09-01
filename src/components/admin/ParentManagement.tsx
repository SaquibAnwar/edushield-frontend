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
} from '@mui/icons-material';
import {
  DataTable,
  Modal,
  ParentForm,
} from '../ui';
import { Grid } from '../ui/Grid';
import { Layout } from '../layout';
import { apiService } from '../../services/api';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import { useToast } from '../../contexts/ToastContext';

import type { Parent, Student } from '../../types/user';
import type { ParentFormData } from '../../types/forms';
import type { Column } from '../../types/components';
import type { ParentFilters } from '../../types/api';
import { ParentType } from '../../types/user';
import { getGenderDisplay, getParentTypeDisplay } from '../../utils/enumUtils';

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

  // Get assigned children/students for this parent
  const assignedStudents = useMemo(() => {
    return students.filter(student => student.parentId === parent.id);
  }, [students, parent.id]);

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
                  <Typography variant="body1">
                    {getParentTypeDisplay(parent.parentType)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={parent.isActive ? 'Active' : 'Inactive'}
                    color={parent.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Address Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                Address Information
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

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    City, State
                  </Typography>
                  <Typography variant="body1">
                    {parent.city && parent.state ? `${parent.city}, ${parent.state}` : 
                     parent.city || parent.state || 'Not specified'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Postal Code
                  </Typography>
                  <Typography variant="body1">
                    {parent.postalCode || 'Not specified'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Country
                  </Typography>
                  <Typography variant="body1">
                    {parent.country || 'Not specified'}
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
                    Occupation
                  </Typography>
                  <Typography variant="body1">
                    {parent.occupation || 'Not specified'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Employer
                  </Typography>
                  <Typography variant="body1">
                    {parent.employer || 'Not specified'}
                  </Typography>
                </Box>

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

        {/* Emergency Contact Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                Emergency Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Emergency Contact Name
                  </Typography>
                  <Typography variant="body1">
                    {parent.emergencyContactName || 'Not specified'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Emergency Contact Phone
                  </Typography>
                  <Typography variant="body1">
                    {parent.emergencyContactPhone || 'Not specified'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Relationship
                  </Typography>
                  <Typography variant="body1">
                    {parent.emergencyContactRelationship || 'Not specified'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Permissions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label="Emergency Contact"
                      color={parent.isEmergencyContact ? 'success' : 'default'}
                      size="small"
                      variant={parent.isEmergencyContact ? 'filled' : 'outlined'}
                    />
                    <Chip
                      label="Authorized to Pickup"
                      color={parent.isAuthorizedToPickup ? 'success' : 'default'}
                      size="small"
                      variant={parent.isAuthorizedToPickup ? 'filled' : 'outlined'}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Assigned Children/Students */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FamilyIcon />
                Assigned Children/Students ({assignedStudents.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {assignedStudents.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {assignedStudents.map((student) => (
                    <Chip
                      key={student.id}
                      label={`${student.fullName} (${student.rollNumber})`}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No students assigned to this parent.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const ParentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ParentFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  
  const { canManageUsers, hasAdminAccess } = useAdminPermissions();
  const { showSuccess, showError } = useToast();

  // Load data
  const loadParents = useCallback(async () => {
    if (!hasAdminAccess) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const searchFilters: ParentFilters = {
        ...filters,
        search: searchTerm || undefined,
      };
      
      console.log('Loading parents with filters:', searchFilters);
      const data = await apiService.getParents(searchFilters);
      console.log('Loaded parents:', data?.length || 0, 'parents');
      
      // Ensure we have valid data
      const validParents = Array.isArray(data) ? data.filter(parent => 
        parent && typeof parent === 'object' && parent.id
      ) : [];
      
      setParents(validParents);
    } catch (err: any) {
      console.error('Failed to load parents:', err);
      setError(err.message || 'Failed to load parents');
      showError('Failed to load parents', err.message);
      setParents([]); // Clear parents on error
    } finally {
      setLoading(false);
    }
  }, [hasAdminAccess, filters, searchTerm, showError]);

  const loadStudents = useCallback(async () => {
    if (!hasAdminAccess) return;
    
    try {
      const response = await apiService.getStudents();
      setStudents(response.data);
    } catch (err: any) {
      console.error('Failed to load students:', err);
    }
  }, [hasAdminAccess]);

  useEffect(() => {
    loadParents();
    loadStudents();
  }, [loadParents, loadStudents]);

  // Search handling
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Filter handling
  const handleFilterChange = useCallback((newFilters: Partial<ParentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  // CRUD operations
  const handleCreate = async (data: ParentFormData) => {
    try {
      // Convert date string to Date object for API
      const createData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth)
      };
      await apiService.createParent(createData);
      showSuccess('Parent created successfully', `${data.firstName} ${data.lastName} has been added.`);
      setShowCreateModal(false);
      loadParents();
    } catch (err: any) {
      console.error('Failed to create parent:', err);
      throw err; // Re-throw to let form handle the error
    }
  };

  const handleEdit = async (data: ParentFormData) => {
    if (!selectedParent) return;
    
    try {
      // Convert date string to Date object for API
      const updateData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth)
      };
      
      // Ensure isActive is explicitly included
      updateData.isActive = data.isActive;
      
      await apiService.updateParent(selectedParent.id, updateData);
      
      showSuccess('Parent updated successfully', `${data.firstName} ${data.lastName} has been updated.`);
      setShowEditModal(false);
      setSelectedParent(null);
      loadParents();
    } catch (err: any) {
      console.error('Failed to update parent:', err);
      throw err; // Re-throw to let form handle the error
    }
  };

  const handleDelete = async () => {
    if (!selectedParent) return;
    
    const parentToDelete = selectedParent; // Capture the parent to delete
    
    try {
      await apiService.deleteParent(parentToDelete.id);
      
      // Immediately update local state to remove the deleted parent
      setParents(prev => {
        const updated = prev.filter(p => p.id !== parentToDelete.id);
        console.log('Immediately removing parent from state. Before:', prev.length, 'After:', updated.length);
        return updated;
      });
      
      // Force re-render
      setRefreshKey(prev => prev + 1);
      
      showSuccess('Parent deleted successfully', `${parentToDelete.fullName} has been removed.`);
      setShowDeleteDialog(false);
      setSelectedParent(null);
      
      // Also refresh from server to ensure consistency
      setTimeout(() => {
        loadParents().catch(loadError => {
          console.error('Error reloading parents after delete:', loadError);
        });
      }, 100);
      
    } catch (err: any) {
      console.error('Failed to delete parent:', err);
      showError('Failed to delete parent', err.message);
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    if (!canManageUsers) return;
    setShowCreateModal(true);
  };

  const openEditModal = (parent: Parent) => {
    if (!canManageUsers) return;
    setSelectedParent(parent);
    setShowDetailModal(false); // Close detail modal first
    setShowEditModal(true);
  };

  const openDetailModal = (parent: Parent) => {
    setSelectedParent(parent);
    setShowDetailModal(true);
  };

  const openDeleteDialog = (parent: Parent) => {
    if (!canManageUsers) return;
    setSelectedParent(parent);
    setShowDetailModal(false); // Close detail modal first
    setShowDeleteDialog(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setShowDeleteDialog(false);
    setSelectedParent(null);
  };

  // Table configuration
  const columns: Column<Parent>[] = useMemo(() => [
    {
      key: 'fullName',
      title: 'Full Name',
      sortable: true,
      render: (_, parent) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight="medium">
            {parent.fullName}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      render: (_, parent) => (
        <Typography variant="body2">
          {parent.email}
        </Typography>
      ),
    },
    {
      key: 'phoneNumber',
      title: 'Phone',
      sortable: true,
      render: (_, parent) => (
        <Typography variant="body2">
          {parent.phoneNumber}
        </Typography>
      ),
    },
    {
      key: 'parentType',
      title: 'Type',
      sortable: true,
      render: (_, parent) => (
        <Chip
          label={getParentTypeDisplay(parent.parentType)}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      key: 'childrenCount',
      title: 'Children',
      sortable: false,
      render: (_, parent) => {
        const childrenCount = students.filter(s => s.parentId === parent.id).length;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FamilyIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {childrenCount}
            </Typography>
          </Box>
        );
      },
    },
    {
      key: 'isActive',
      title: 'Status',
      sortable: true,
      render: (_, parent) => (
        <Chip
          label={parent.isActive ? 'Active' : 'Inactive'}
          size="small"
          color={parent.isActive ? 'success' : 'default'}
        />
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      sortable: false,
      render: (_, parent) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              openDetailModal(parent);
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
                  openEditModal(parent);
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
                  openDeleteDialog(parent);
                }}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      ),
    },
  ], [canManageUsers, students]);

  // Filtered and sorted data
  const filteredParents = useMemo(() => {
    console.log('Filtering parents. Total:', parents.length, 'Filters:', filters, 'Search:', searchTerm);
    let filtered = [...parents];

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(parent =>
        parent.fullName.toLowerCase().includes(search) ||
        parent.email.toLowerCase().includes(search) ||
        parent.phoneNumber.includes(search)
      );
      console.log('After search filter:', filtered.length);
    }

    // Apply parent type filter
    if (filters.parentType !== undefined) {
      console.log('Applying parent type filter:', filters.parentType);
      const beforeCount = filtered.length;
      filtered = filtered.filter(parent => parent.parentType === filters.parentType);
      console.log('After parent type filter:', filtered.length, 'from', beforeCount);
    }

    // Apply active status filter
    if (filters.isActive !== undefined) {
      console.log('Applying active status filter:', filters.isActive);
      const beforeCount = filtered.length;
      filtered = filtered.filter(parent => parent.isActive === filters.isActive);
      console.log('After active status filter:', filtered.length, 'from', beforeCount);
    }

    console.log('Final filtered count:', filtered.length, 'Parent IDs:', filtered.map(p => p.id));
    return filtered;
  }, [parents, searchTerm, filters]);

  if (!hasAdminAccess) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            You don't have permission to view parent management.
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Parent Management
        </Typography>

        <Paper sx={{ mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Parent List" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Box sx={{ p: 3 }}>
              {/* Action Bar */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search parents..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={clearSearch}>
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
                    onClick={loadParents}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                </Box>

                {canManageUsers && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openCreateModal}
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
                            value={filters.parentType !== undefined ? filters.parentType.toString() : ''}
                            onChange={(e) => handleFilterChange({ 
                              parentType: e.target.value === '' ? undefined : Number(e.target.value) as ParentType 
                            })}
                            label="Parent Type"
                          >
                            <MenuItem value="">All Types</MenuItem>
                            <MenuItem value={ParentType.PRIMARY}>Primary</MenuItem>
                            <MenuItem value={ParentType.SECONDARY}>Secondary</MenuItem>
                            <MenuItem value={ParentType.GUARDIAN}>Guardian</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={filters.isActive !== undefined ? filters.isActive.toString() : ''}
                            onChange={(e) => handleFilterChange({ 
                              isActive: e.target.value === '' ? undefined : e.target.value === 'true' 
                            })}
                            label="Status"
                          >
                            <MenuItem value="">All Status</MenuItem>
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

              {/* Error Display */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Data Table */}
              <DataTable
                key={`parents-table-${refreshKey}-${parents.length}-${filteredParents.length}`}
                data={filteredParents}
                columns={columns}
                loading={loading}
                rowKey="id"
                onRowClick={openDetailModal}
              />
            </Box>
          </TabPanel>
        </Paper>

        {/* Create Modal */}
        <Modal
          open={showCreateModal}
          onClose={closeModals}
          title="Create New Parent"
          width="md"
        >
          <ParentForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={closeModals}
            showHeader={false}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          open={showEditModal}
          onClose={closeModals}
          title="Edit Parent"
          width="md"
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
                dateOfBirth: selectedParent.dateOfBirth.split('T')[0], // Convert to date string
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
                isActive: selectedParent.isActive,
              }}
              onSubmit={handleEdit}
              onCancel={closeModals}
              showHeader={false}
            />
          )}
        </Modal>

        {/* Detail Modal */}
        <Modal
          open={showDetailModal}
          onClose={closeModals}
          title=""
          width="lg"
        >
          {selectedParent && (
            <ParentDetailView
              parent={selectedParent}
              onClose={closeModals}
              onEdit={openEditModal}
              onDelete={openDeleteDialog}
              students={students}
            />
          )}
        </Modal>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onClose={closeModals}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete parent "{selectedParent?.fullName}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModals}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default ParentManagement;