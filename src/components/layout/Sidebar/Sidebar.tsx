import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExitToApp as LogoutIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as ReportsIcon,
  DataUsage as DataIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Grade as GradeIcon,
  FamilyRestroom as FamilyIcon,
  AccountCircle as ProfileIcon,
  BugReport as TestIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { useSystemSettings } from '../../../contexts/SystemSettingsContext';
import { UserRole } from '../../../types/auth';

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: UserRole;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  onClick?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  userRole
}) => {
  const { logout, getDisplayName } = useAuth();
  const { settings } = useSystemSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await logout();
      // Explicitly navigate to home page after logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, navigate to home
      navigate('/', { replace: true });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle(); // Close sidebar on mobile after navigation
    }
  };

  const getMenuItems = (): MenuItem[] => {
    const getRolePath = (role: UserRole): string => {
      switch (role) {
        case UserRole.Admin:
          return '/admin';
        case UserRole.Faculty:
          return '/faculty';
        case UserRole.Parent:
          return '/parent';
        case UserRole.Student:
          return '/student';
        default:
          return '/';
      }
    };

    const commonItems: MenuItem[] = [
      {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        path: getRolePath(userRole),
        onClick: () => handleNavigation(getRolePath(userRole))
      }
    ];

    // Test components item - only show if enabled by admin
    const shouldShowTestComponents = settings?.testComponentsEnabled;
    
    const testItem: MenuItem | null = shouldShowTestComponents ? {
      label: 'Test Components',
      icon: <TestIcon />,
      path: '/test-components',
      onClick: () => handleNavigation('/test-components')
    } : null;

    switch (userRole) {
      case UserRole.Admin:
        const adminItems = [
          ...commonItems,
          { label: '', icon: null, divider: true },
          {
            label: 'Manage Users',
            icon: <PeopleIcon />,
            path: '/admin/users',
            onClick: () => handleNavigation('/admin/users')
          },
          {
            label: 'User Role Management',
            icon: <SettingsIcon />,
            path: '/admin/user-roles',
            onClick: () => handleNavigation('/admin/user-roles')
          },
          {
            label: 'Student Management',
            icon: <SchoolIcon />,
            path: '/admin/students',
            onClick: () => handleNavigation('/admin/students')
          },
          {
            label: 'Student Data Management',
            icon: <DataIcon />,
            path: '/admin/student-data',
            onClick: () => handleNavigation('/admin/student-data')
          },
          {
            label: 'Faculty Management',
            icon: <WorkIcon />,
            path: '/admin/faculty',
            onClick: () => handleNavigation('/admin/faculty')
          },
          {
            label: 'Parent Management',
            icon: <FamilyIcon />,
            path: '/admin/parents',
            onClick: () => handleNavigation('/admin/parents')
          },
          {
            label: 'Academic Management',
            icon: <SchoolIcon />,
            path: '/admin/academic',
            onClick: () => handleNavigation('/admin/academic'),
            disabled: true // Will be enabled in future tasks
          },
          {
            label: 'Reports & Analytics',
            icon: <ReportsIcon />,
            path: '/admin/reports',
            onClick: () => handleNavigation('/admin/reports'),
            disabled: true // Will be enabled in future tasks
          },
          {
            label: 'System Settings',
            icon: <SettingsIcon />,
            path: '/admin/settings',
            onClick: () => handleNavigation('/admin/settings')
          }
        ];
        
        if (testItem) {
          adminItems.push({ label: '', icon: null, divider: true }, testItem);
        }
        
        return adminItems;

      case UserRole.Faculty:
        const facultyItems = [
          ...commonItems,
          { label: '', icon: null, divider: true },
          {
            label: 'My Students',
            icon: <PeopleIcon />,
            path: '/faculty/students',
            onClick: () => handleNavigation('/faculty/students')
          },
          {
            label: 'Performance Management',
            icon: <GradeIcon />,
            path: '/faculty/performance',
            onClick: () => handleNavigation('/faculty/performance')
          },
          {
            label: 'Assignments',
            icon: <AssignmentIcon />,
            path: '/faculty/assignments',
            onClick: () => handleNavigation('/faculty/assignments'),
            disabled: true // Will be enabled in future tasks
          },
          {
            label: 'Profile',
            icon: <ProfileIcon />,
            path: '/faculty/profile',
            onClick: () => handleNavigation('/faculty/profile'),
            disabled: true // Will be enabled in future tasks
          }
        ];
        
        if (testItem) {
          facultyItems.push({ label: '', icon: null, divider: true }, testItem);
        }
        
        return facultyItems;

      case UserRole.Parent:
        const parentItems = [
          ...commonItems,
          { label: '', icon: null, divider: true },
          {
            label: 'My Children',
            icon: <FamilyIcon />,
            path: '/parent/children',
            onClick: () => handleNavigation('/parent/children'),
            disabled: true // Will be enabled in future tasks
          },
          {
            label: 'Performance',
            icon: <GradeIcon />,
            path: '/parent/performance',
            onClick: () => handleNavigation('/parent/performance'),
            disabled: true // Will be enabled in future tasks
          },
          {
            label: 'Fees & Payments',
            icon: <PaymentIcon />,
            path: '/parent/fees',
            onClick: () => handleNavigation('/parent/fees'),
            disabled: true // Will be enabled in future tasks
          },
          {
            label: 'Profile',
            icon: <ProfileIcon />,
            path: '/parent/profile',
            onClick: () => handleNavigation('/parent/profile'),
            disabled: true // Will be enabled in future tasks
          }
        ];
        
        if (testItem) {
          parentItems.push({ label: '', icon: null, divider: true }, testItem);
        }
        
        return parentItems;

      case UserRole.Student:
        const studentItems = [
          ...commonItems,
          { label: '', icon: null, divider: true },
          {
            label: 'Performance',
            icon: <GradeIcon />,
            path: '/student/performance',
            onClick: () => handleNavigation('/student/performance')
          },
          {
            label: 'Assignments',
            icon: <AssignmentIcon />,
            path: '/student/assignments',
            onClick: () => handleNavigation('/student/assignments'),
            disabled: true // Will be enabled in future tasks
          },
          {
            label: 'Fees',
            icon: <PaymentIcon />,
            path: '/student/fees',
            onClick: () => handleNavigation('/student/fees')
          },
          {
            label: 'Profile',
            icon: <ProfileIcon />,
            path: '/student/profile',
            onClick: () => handleNavigation('/student/profile'),
            disabled: true // Will be enabled in future tasks
          }
        ];
        
        if (testItem) {
          studentItems.push({ label: '', icon: null, divider: true }, testItem);
        }
        
        return studentItems;

      default:
        const defaultItems = [...commonItems];
        if (testItem) {
          defaultItems.push({ label: '', icon: null, divider: true }, testItem);
        }
        return defaultItems;
    }
  };

  const menuItems = getMenuItems();

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: isOpen || isMobile ? 3 : 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen || isMobile ? 'space-between' : 'center',
          minHeight: 64
        }}
      >
        {(isOpen || isMobile) && (
          <Typography 
            variant="h5" 
            fontWeight="bold"
            sx={{ 
              transition: 'opacity 0.3s ease'
            }}
          >
            {userRole === UserRole.Admin && 'Admin Panel'}
            {userRole === UserRole.Faculty && 'Faculty Portal'}
            {userRole === UserRole.Parent && 'Parent Portal'}
            {userRole === UserRole.Student && 'Student Portal'}
          </Typography>
        )}
        
        {!isMobile && (
          <IconButton
            onClick={onToggle}
            sx={{ 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      {(isOpen || isMobile) && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              p: 2,
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Welcome back,
            </Typography>
            <Typography variant="subtitle1" fontWeight="medium">
              {getDisplayName()}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item, index) => {
          if (item.divider) {
            return (
              <Divider 
                key={index} 
                sx={{ 
                  my: 2, 
                  borderColor: 'rgba(255, 255, 255, 0.2)' 
                }} 
              />
            );
          }

          const isActive = currentPath === item.path;

          if (isOpen || isMobile) {
            // Expanded state - show full button with text
            return (
              <Button
                key={index}
                variant="text"
                startIcon={item.icon}
                onClick={item.onClick}
                disabled={item.disabled}
                sx={{
                  color: item.disabled ? 'rgba(255, 255, 255, 0.5)' : 'white',
                  justifyContent: 'flex-start',
                  py: 1.5,
                  px: 2,
                  mb: 1,
                  width: '100%',
                  borderRadius: 2,
                  bgcolor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': { 
                    bgcolor: item.disabled ? 'transparent' : 'rgba(255, 255, 255, 0.1)' 
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                {item.label}
              </Button>
            );
          } else {
            // Collapsed state - show only icon button
            return (
              <Box key={index} sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  onClick={item.onClick}
                  disabled={item.disabled}
                  sx={{
                    color: item.disabled ? 'rgba(255, 255, 255, 0.5)' : 'white',
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    '&:hover': { 
                      bgcolor: item.disabled ? 'transparent' : 'rgba(255, 255, 255, 0.1)' 
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(255, 255, 255, 0.5)'
                    }
                  }}
                >
                  {item.icon}
                </IconButton>
              </Box>
            );
          }
        })}
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        {isOpen || isMobile ? (
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              justifyContent: 'flex-start',
              width: '100%',
              py: 1.5,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'white'
              }
            }}
          >
            Logout
          </Button>
        ) : (
          <IconButton
            onClick={handleLogout}
            sx={{
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              width: '100%',
              py: 1.5,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'white'
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box'
          }
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? 280 : 72,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: isOpen ? 280 : 72,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden'
        }
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;