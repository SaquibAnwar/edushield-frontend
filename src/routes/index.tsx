import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { NotFound, Unauthorized } from '../components/common/ErrorPages';
import { UserRole } from '../types/auth';
import { ROUTE_PERMISSIONS } from '../utils/routeGuards';

// Page imports
import { Home } from '../pages/Home';
import { AdminDashboard } from '../pages/Admin';
import { StudentDashboard } from '../pages/Student';
import { ParentDashboard } from '../pages/Parent';
import { FacultyDashboard } from '../pages/Faculty';

// Route configuration interface
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  requiredRoles?: readonly UserRole[];
  exact?: boolean;
  description?: string;
}

// Define all application routes with comprehensive configuration
export const routeConfigs: RouteConfig[] = [
  // Public routes
  {
    path: '/',
    element: <Home />,
    requiredRoles: ROUTE_PERMISSIONS.PUBLIC,
    exact: true,
    description: 'Home page with login functionality'
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
    requiredRoles: ROUTE_PERMISSIONS.PUBLIC,
    exact: true,
    description: 'Unauthorized access page'
  },

  // Admin routes
  {
    path: '/admin',
    element: <AdminDashboard />,
    requiredRoles: ROUTE_PERMISSIONS.ADMIN_ONLY,
    exact: true,
    description: 'Admin dashboard with system overview'
  },
  {
    path: '/admin/dashboard',
    element: <Navigate to="/admin" replace />,
    requiredRoles: ROUTE_PERMISSIONS.ADMIN_ONLY,
    exact: true,
    description: 'Redirect to admin dashboard'
  },

  // Student routes
  {
    path: '/student',
    element: <StudentDashboard />,
    requiredRoles: ROUTE_PERMISSIONS.STUDENT_ONLY,
    exact: true,
    description: 'Student dashboard with academic overview'
  },
  {
    path: '/student/dashboard',
    element: <Navigate to="/student" replace />,
    requiredRoles: ROUTE_PERMISSIONS.STUDENT_ONLY,
    exact: true,
    description: 'Redirect to student dashboard'
  },

  // Parent routes
  {
    path: '/parent',
    element: <ParentDashboard />,
    requiredRoles: ROUTE_PERMISSIONS.PARENT_ONLY,
    exact: true,
    description: 'Parent dashboard with children overview'
  },
  {
    path: '/parent/dashboard',
    element: <Navigate to="/parent" replace />,
    requiredRoles: ROUTE_PERMISSIONS.PARENT_ONLY,
    exact: true,
    description: 'Redirect to parent dashboard'
  },

  // Faculty routes
  {
    path: '/faculty',
    element: <FacultyDashboard />,
    requiredRoles: ROUTE_PERMISSIONS.FACULTY_ONLY,
    exact: true,
    description: 'Faculty dashboard with assigned students overview'
  },
  {
    path: '/faculty/dashboard',
    element: <Navigate to="/faculty" replace />,
    requiredRoles: ROUTE_PERMISSIONS.FACULTY_ONLY,
    exact: true,
    description: 'Redirect to faculty dashboard'
  }
];

// Helper function to get role-based redirect path
export const getRoleBasedRedirect = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return '/admin';
    case UserRole.Student:
      return '/student';
    case UserRole.Parent:
      return '/parent';
    case UserRole.Faculty:
      return '/faculty';
    default:
      return '/';
  }
};

// Helper function to check if user has access to a route
export const hasRouteAccess = (route: RouteConfig, userRole?: UserRole): boolean => {
  if (!route.requiredRoles || route.requiredRoles.length === 0) {
    return true; // Public route
  }
  
  if (!userRole) {
    return false; // No user role, can't access protected routes
  }
  
  return (route.requiredRoles as UserRole[]).includes(userRole);
};

// Get all routes accessible to a specific role
export const getAccessibleRoutesForRole = (userRole: UserRole): RouteConfig[] => {
  return routeConfigs.filter(route => hasRouteAccess(route, userRole));
};

// Main AppRoutes component with comprehensive error handling
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {routeConfigs.map((route, index) => {
        // Wrap protected routes with ProtectedRoute component
        const routeElement = route.requiredRoles && route.requiredRoles.length > 0 ? (
          <ProtectedRoute 
            requiredRoles={route.requiredRoles}
            fallbackPath="/unauthorized"
          >
            {route.element}
          </ProtectedRoute>
        ) : (
          route.element
        );

        return (
          <Route
            key={`route-${index}-${route.path}`}
            path={route.path}
            element={routeElement}
          />
        );
      })}
      
      {/* Catch-all route for 404 - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;