import React, { useState } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography
} from '@mui/material';
import {
  Menu as MenuIcon
} from '@mui/icons-material';
import { Sidebar } from '../Sidebar';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../../types/auth';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get current path for active menu highlighting
  const currentPath = window.location.pathname;

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#f5f5f5'
      }}
      className={className}
    >
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            zIndex: theme.zIndex.drawer + 1
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              EduShield
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        userRole={user?.role || UserRole.Student}
        currentPath={currentPath}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'white',
          minHeight: '100vh',
          overflow: 'auto',
          marginTop: isMobile ? '64px' : 0, // Account for mobile app bar
          transition: 'margin-left 0.3s ease'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;