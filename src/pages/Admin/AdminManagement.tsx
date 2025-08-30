import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  People as StudentsIcon,
  School as FacultyIcon,
  FamilyRestroom as ParentsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { Layout } from '../../components/layout';
import {
  StudentForm,
  FacultyForm,
  ParentForm,
  DataTable,
  Modal,
  LoadingSpinner,
  ErrorMessage
} from '../../components/ui';
import { apiService } from '../../services/api';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import type { Student, Faculty, Parent } from '../../types/user';
import type { StudentFormData, FacultyFormData, ParentFormData } from '../../types/forms';
import type { Column } from '../../types/components';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdminManagement: React.FC = () => {
  const {
    hasAdminAccess,
    canAccessCRUDForms,
    canManageUsers,
    isLoading: permissionsLoading,
    validationResult,
    getUserRoleDisplayName
  } = useAdminPermissions();

  const [currentTab, setCurrentTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<'student' | 'faculty' | 'parent' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);

  // Loading states
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [facultiesLoading, setFacultiesLoading] = useState(false);
  const [parentsLoading, setParentsLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load data on component mount and tab change
  useEffect(() => {
    loadData();
  }, [currentTab]);

  const loadData = async () => {
    try {
      setError(null);

      switch (currentTab) {
        case 0: // Students
          setStudentsLoading(true);
          const studentsResponse = await apiService.getStudents();
          setStudents(studentsResponse); // Direct array response
          break;
        case 1: // Faculty
          setFacultiesLoading(true);
          const facultiesResponse = await apiService.getFaculties();
          setFaculties(facultiesResponse); // Direct array response
          break;
        case 2: // Parents
          setParentsLoading(true);
          const parentsResponse = await apiService.getParents();
          setParents(parentsResponse); // Direct array response
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setStudentsLoading(false);
      setFacultiesLoading(false);
      setParentsLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const openCreateModal = (formType: 'student' | 'faculty' | 'parent') => {
    // Additional permission check before opening create modal
    if (!canManageUsers) {
      setError('You do not have permission to create users');
      return;
    }
    setCurrentForm(formType);
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (formType: 'student' | 'faculty' | 'parent', item: any) => {
    // Additional permission check before opening edit modal
    if (!canManageUsers) {
      setError('You do not have permission to edit users');
      return;
    }
    setCurrentForm(formType);
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentForm(null);
    setEditingItem(null);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setFormSubmitting(true);
      setError(null);

      let successMsg;

      if (editingItem) {
        // Update existing item
        switch (currentForm) {
          case 'student':
            await apiService.updateStudent(editingItem.id, data);
            successMsg = 'Student updated successfully';
            break;
          case 'faculty':
            await apiService.updateFaculty(editingItem.id, data);
            successMsg = 'Faculty updated successfully';
            break;
          case 'parent':
            await apiService.updateParent(editingItem.id, data);
            successMsg = 'Parent updated successfully';
            break;
        }
      } else {
        // Create new item
        switch (currentForm) {
          case 'student':
            await apiService.createStudent(data);
            successMsg = 'Student created successfully';
            break;
          case 'faculty':
            await apiService.createFaculty(data);
            successMsg = 'Faculty created successfully';
            break;
          case 'parent':
            await apiService.createParent(data);
            successMsg = 'Parent created successfully';
            break;
        }
      }

      setSuccessMessage(successMsg || 'Operation completed successfully');
      closeModal();
      await loadData(); // Reload data
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save data');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (type: 'student' | 'faculty' | 'parent', id: string) => {
    // Additional permission check before deleting
    if (!canManageUsers) {
      setError('You do not have permission to delete users');
      return;
    }

    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      setError(null);

      switch (type) {
        case 'student':
          await apiService.deleteStudent(id);
          setSuccessMessage('Student deleted successfully');
          break;
        case 'faculty':
          await apiService.deleteFaculty(id);
          setSuccessMessage('Faculty deleted successfully');
          break;
        case 'parent':
          await apiService.deleteParent(id);
          setSuccessMessage('Parent deleted successfully');
          break;
      }

      await loadData(); // Reload data
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete item');
    }
  };

  // Table columns
  const studentColumns: Column<Student>[] = [
    { key: 'rollNumber', title: 'Roll Number', sortable: true },
    { key: 'fullName', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'grade', title: 'Grade', sortable: true },
    { key: 'section', title: 'Section', sortable: true },
    { key: 'status', title: 'Status', sortable: true },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => openEditModal('student', record)}
            disabled={!canManageUsers}
            title={!canManageUsers ? 'You do not have permission to edit users' : 'Edit student'}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete('student', record.id)}
            disabled={!canManageUsers}
            title={!canManageUsers ? 'You do not have permission to delete users' : 'Delete student'}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const facultyColumns: Column<Faculty>[] = [
    { key: 'employeeId', title: 'Employee ID', sortable: true },
    { key: 'fullName', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'department', title: 'Department', sortable: true },
    { key: 'subject', title: 'Subject', sortable: true },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => value ? 'Active' : 'Inactive',
      sortable: true
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => openEditModal('faculty', record)}
            disabled={!canManageUsers}
            title={!canManageUsers ? 'You do not have permission to edit users' : 'Edit faculty'}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete('faculty', record.id)}
            disabled={!canManageUsers}
            title={!canManageUsers ? 'You do not have permission to delete users' : 'Delete faculty'}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const parentColumns: Column<Parent>[] = [
    { key: 'fullName', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'phoneNumber', title: 'Phone', sortable: true },
    { key: 'parentType', title: 'Type', sortable: true },
    { key: 'childrenCount', title: 'Children', sortable: true },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => value ? 'Active' : 'Inactive',
      sortable: true
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => openEditModal('parent', record)}
            disabled={!canManageUsers}
            title={!canManageUsers ? 'You do not have permission to edit users' : 'Edit parent'}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete('parent', record.id)}
            disabled={!canManageUsers}
            title={!canManageUsers ? 'You do not have permission to delete users' : 'Delete parent'}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const renderCurrentForm = () => {
    switch (currentForm) {
      case 'student':
        return (
          <StudentForm
            initialData={editingItem}
            onSubmit={(data: StudentFormData) => handleFormSubmit(data)}
            onCancel={closeModal}
            loading={formSubmitting}
            mode={editingItem ? 'edit' : 'create'}
            parents={parents.map(p => ({ id: p.id, fullName: p.fullName }))}
            faculties={faculties.map(f => ({ id: f.id, fullName: f.fullName }))}
          />
        );
      case 'faculty':
        return (
          <FacultyForm
            initialData={editingItem}
            onSubmit={(data: FacultyFormData) => handleFormSubmit(data)}
            onCancel={closeModal}
            loading={formSubmitting}
            mode={editingItem ? 'edit' : 'create'}
          />
        );
      case 'parent':
        return (
          <ParentForm
            initialData={editingItem}
            onSubmit={(data: ParentFormData) => handleFormSubmit(data)}
            onCancel={closeModal}
            loading={formSubmitting}
            mode={editingItem ? 'edit' : 'create'}
          />
        );
      default:
        return null;
    }
  };

  // Show loading while checking permissions
  if (permissionsLoading) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <LoadingSpinner tip="Verifying admin permissions..." />
        </Box>
      </Layout>
    );
  }

  // Additional security check - should not happen due to AdminRouteGuard, but good practice
  if (!hasAdminAccess || !canAccessCRUDForms) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SecurityIcon />
              <Typography variant="h6">Access Denied</Typography>
            </Box>
            <Typography variant="body2">
              {validationResult.reason || 'You do not have permission to access this page.'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Current role: <strong>{getUserRoleDisplayName()}</strong>
            </Typography>
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SecurityIcon color="primary" />
          <Typography variant="h4" component="h1">
            User Management
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Manage students, faculty, and parents in the system
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Admin Access:</strong> You have full administrative privileges to create, edit, and delete user records.
          </Typography>
        </Alert>

        {error && (
          <Box sx={{ mb: 3 }}>
            <ErrorMessage
              error={error}
              showRetry
              onRetry={() => {
                setError(null);
                loadData();
              }}
            />
          </Box>
        )}

        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab
                icon={<StudentsIcon />}
                label="Students"
                iconPosition="start"
              />
              <Tab
                icon={<FacultyIcon />}
                label="Faculty"
                iconPosition="start"
              />
              <Tab
                icon={<ParentsIcon />}
                label="Parents"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Students</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openCreateModal('student')}
                disabled={!canManageUsers}
                title={!canManageUsers ? 'You do not have permission to create users' : 'Add new student'}
              >
                Add Student
              </Button>
            </Box>

            {studentsLoading ? (
              <LoadingSpinner tip="Loading students..." />
            ) : (
              <DataTable
                data={students}
                columns={studentColumns}
                loading={studentsLoading}
                onRowClick={(record) => openEditModal('student', record)}
              />
            )}
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Faculty</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openCreateModal('faculty')}
                disabled={!canManageUsers}
                title={!canManageUsers ? 'You do not have permission to create users' : 'Add new faculty'}
              >
                Add Faculty
              </Button>
            </Box>

            {facultiesLoading ? (
              <LoadingSpinner tip="Loading faculty..." />
            ) : (
              <DataTable
                data={faculties}
                columns={facultyColumns}
                loading={facultiesLoading}
                onRowClick={(record) => openEditModal('faculty', record)}
              />
            )}
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Parents</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openCreateModal('parent')}
                disabled={!canManageUsers}
                title={!canManageUsers ? 'You do not have permission to create users' : 'Add new parent'}
              >
                Add Parent
              </Button>
            </Box>

            {parentsLoading ? (
              <LoadingSpinner tip="Loading parents..." />
            ) : (
              <DataTable
                data={parents}
                columns={parentColumns}
                loading={parentsLoading}
                onRowClick={(record) => openEditModal('parent', record)}
              />
            )}
          </TabPanel>
        </Paper>

        {/* Form Modal */}
        <Modal
          open={modalOpen}
          onClose={closeModal}
          title={`${editingItem ? 'Edit' : 'Create'} ${currentForm ? currentForm.charAt(0).toUpperCase() + currentForm.slice(1) : ''}`}
          width="md"
          loading={formSubmitting}
        >
          {renderCurrentForm()}
        </Modal>

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage(null)}
        >
          <Alert
            onClose={() => setSuccessMessage(null)}
            severity="success"
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default AdminManagement;