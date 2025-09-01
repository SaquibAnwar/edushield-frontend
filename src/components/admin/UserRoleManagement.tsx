import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  School as StudentIcon,
  MenuBook as FacultyIcon,
  FamilyRestroom as ParentIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import {
  DataTable,
  ErrorMessage,
} from '../ui';
import { Layout } from '../layout';
import { apiService } from '../../services/api';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';
import type { Column } from '../../types/components';
import { getRoleBasedRedirect } from '../../routes';

interface User {
  id: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

interface RoleChangeDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (userId: string, newRole: UserRole) => void;
  loading: boolean;
}

const RoleChangeDialog: React.FC<RoleChangeDialogProps> = ({
  user,
  open,
  onClose,
  onConfirm,
  loading,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Student);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  const handleConfirm = () => {
    if (user && selectedRole !== user.role) {
      onConfirm(user.id, selectedRole);
    }
  };



  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return 'Administrator';
      case UserRole.Student:
        return 'Student';
      case UserRole.Faculty:
        return 'Faculty';
      case UserRole.Parent:
        return 'Parent';
      default:
        return 'Unknown';
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return 'Full system access, can manage all users and data';
      case UserRole.Student:
        return 'Access to student dashboard, performance, and fees';
      case UserRole.Faculty:
        return 'Access to faculty dashboard and assigned students';
      case UserRole.Parent:
        return 'Access to parent dashboard and children information';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon />
          Change User Role
        </Box>
      </DialogTitle>
      <DialogContent>
        {user && (
          <Box sx={{ mt: 2 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Name: {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email: {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Role: {getRoleLabel(user.role)}
                </Typography>
              </CardContent>
            </Card>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>New Role</InputLabel>
              <Select
                value={selectedRole}
                label="New Role"
                onChange={(e) => setSelectedRole(Number(e.target.value) as UserRole)}
              >
                <MenuItem value={UserRole.Admin}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminIcon />
                    Administrator
                  </Box>
                </MenuItem>
                <MenuItem value={UserRole.Student}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StudentIcon />
                    Student
                  </Box>
                </MenuItem>
                <MenuItem value={UserRole.Faculty}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FacultyIcon />
                    Faculty
                  </Box>
                </MenuItem>
                <MenuItem value={UserRole.Parent}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ParentIcon />
                    Parent
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {getRoleDescription(selectedRole)}
              </Typography>
            </Alert>

            {selectedRole !== user.role && (
              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Warning:</strong> Changing the user's role will immediately affect their access permissions. 
                  The user will need to log out and log back in to see the changes reflected in their dashboard.
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading || !user || selectedRole === user.role}
        >
          {loading ? 'Updating...' : 'Update Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const UserRoleManagement: React.FC = () => {
  const { canManageUsers } = useAdminPermissions();
  const { showSuccess, showError } = useToast();
  const { isAuthenticated, user, refreshUserData, logout } = useAuth();

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Modal states
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<boolean | ''>('');

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Load users
  const loadUsers = useCallback(async () => {
    if (!isAuthenticated || !canManageUsers) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getUsers();
      setUsers(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, canManageUsers]);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (roleFilter !== '') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== '') {
      filtered = filtered.filter(user => user.isActive === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Effects
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRefresh = () => {
    loadUsers();
  };

  const handleChangeRole = (user: User) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to change user roles');
      return;
    }
    setSelectedUser(user);
    setRoleChangeDialogOpen(true);
  };

  const handleRoleChangeConfirm = async (userId: string, newRole: UserRole) => {
    try {
      setUpdating(true);

      await apiService.updateUserRole(userId, newRole);
      
      // Check if the current user's role was changed
      const currentUser = selectedUser;
      const isCurrentUserChanged = currentUser && currentUser.email === user?.email;
      
      if (isCurrentUserChanged) {
        showSuccess(
          'Your Role Updated',
          `Your role has been updated to ${getRoleLabel(newRole)}. You will be redirected to the appropriate dashboard.`
        );
        
        // Refresh user data and redirect after a short delay
        setTimeout(async () => {
          try {
            await refreshUserData();
            // Redirect based on new role
            const redirectPath = getRoleBasedRedirect(newRole);
            window.location.href = redirectPath;
          } catch (error) {
            console.error('Failed to refresh user data:', error);
            // Force logout and redirect to login
            await logout();
            window.location.href = '/';
          }
        }, 2000);
      } else {
        showSuccess(
          'Role Updated',
          `User role has been updated successfully. The user will need to log out and log back in to see the changes.`
        );
      }

      setRoleChangeDialogOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
      showError(
        'Update Failed',
        err instanceof Error ? err.message : 'Failed to update user role'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (!canManageUsers) {
      showError('Access Denied', 'You do not have permission to change user status');
      return;
    }

    try {
      setUpdating(true);

      await apiService.updateUserStatus(user.id, !user.isActive);
      
      showSuccess(
        'Status Updated',
        `User has been ${!user.isActive ? 'activated' : 'deactivated'} successfully`
      );

      await loadUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
      showError(
        'Update Failed',
        err instanceof Error ? err.message : 'Failed to update user status'
      );
    } finally {
      setUpdating(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return <AdminIcon color="error" />;
      case UserRole.Student:
        return <StudentIcon color="primary" />;
      case UserRole.Faculty:
        return <FacultyIcon color="secondary" />;
      case UserRole.Parent:
        return <ParentIcon color="info" />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return 'Administrator';
      case UserRole.Student:
        return 'Student';
      case UserRole.Faculty:
        return 'Faculty';
      case UserRole.Parent:
        return 'Parent';
      default:
        return 'Unknown';
    }
  };

  const getRoleColor = (role: UserRole): 'error' | 'primary' | 'secondary' | 'info' | 'default' => {
    switch (role) {
      case UserRole.Admin:
        return 'error';
      case UserRole.Student:
        return 'primary';
      case UserRole.Faculty:
        return 'secondary';
      case UserRole.Parent:
        return 'info';
      default:
        return 'default';
    }
  };

  // Table columns
  const userColumns: Column<User>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (_, record) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {record.profilePictureUrl && (
            <img
              src={record.profilePictureUrl}
              alt={record.name}
              style={{ width: 32, height: 32, borderRadius: '50%' }}
            />
          )}
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {record.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {record.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (_, record) => (
        <Chip
          icon={getRoleIcon(record.role)}
          label={getRoleLabel(record.role)}
          color={getRoleColor(record.role)}
          size="small"
        />
      )
    },
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
      key: 'lastLoginAt',
      title: 'Last Login',
      sortable: true,
      render: (_, record) => (
        <Typography variant="body2" color="text.secondary">
          {record.lastLoginAt
            ? new Date(record.lastLoginAt).toLocaleDateString()
            : 'Never'
          }
        </Typography>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Change Role">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleChangeRole(record);
              }}
              disabled={updating}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Button
            size="small"
            variant="outlined"
            color={record.isActive ? 'error' : 'success'}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(record);
            }}
            disabled={updating}
          >
            {record.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </Box>
      ),
    },
  ];

  if (!canManageUsers) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <Alert severity="error">
            <Typography variant="h6">Access Denied</Typography>
            <Typography>
              You do not have permission to access user role management.
            </Typography>
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <PersonIcon color="primary" />
          <Typography variant="h4" component="h1">
            User Role Management
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage user roles and permissions. Changes take effect immediately but users need to log out and back in to see dashboard changes.
        </Typography>

        {/* Error Display */}
        {error && (
          <Box sx={{ mb: 3 }}>
            <ErrorMessage
              error={error}
              showRetry
              onRetry={() => {
                setError(null);
                loadUsers();
              }}
            />
          </Box>
        )}

        {/* Main Content */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ p: 3 }}>
            {/* Action Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search users..."
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
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={roleFilter}
                    label="Role"
                    onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value={UserRole.Admin}>Administrator</MenuItem>
                    <MenuItem value={UserRole.Student}>Student</MenuItem>
                    <MenuItem value={UserRole.Faculty}>Faculty</MenuItem>
                    <MenuItem value={UserRole.Parent}>Parent</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter === '' ? '' : String(statusFilter)}
                    label="Status"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setStatusFilter('');
                      } else {
                        setStatusFilter(value === 'true');
                      }
                    }}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              </Box>

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>

            {/* Users Table */}
            <DataTable
              data={filteredUsers}
              columns={userColumns}
              loading={loading}
            />
          </Box>
        </Paper>

        {/* Role Change Dialog */}
        <RoleChangeDialog
          user={selectedUser}
          open={roleChangeDialogOpen}
          onClose={() => {
            setRoleChangeDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleRoleChangeConfirm}
          loading={updating}
        />
      </Box>
    </Layout>
  );
};