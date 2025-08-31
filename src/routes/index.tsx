import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AdminRouteGuard } from '../components/auth/AdminRouteGuard';
import { NotFound, Unauthorized } from '../components/common/ErrorPages';
import { UserRole } from '../types/auth';
import { ROUTE_PERMISSIONS } from '../utils/routeGuards';

// Page imports
import { Home } from '../pages/Home';
import { AdminDashboard } from '../pages/Admin';
import { AdminManagement } from '../pages/Admin/AdminManagement';
import { AdminSettings } from '../pages/Admin/AdminSettings';
import { StudentManagement, StudentDataManagement, FacultyManagement, ParentManagement } from '../components/admin';
import { StudentDashboard, StudentPerformance } from '../pages/Student';
import { ParentDashboard } from '../pages/Parent';
import { FacultyDashboard } from '../pages/Faculty';
import { TestComponentsGuard } from '../components/ui/TestComponents/TestComponentsGuard';
import TestForms from '../pages/TestForms';

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
  {
    path: '/test-components',
    element: <TestComponentsGuard />,
    requiredRoles: ROUTE_PERMISSIONS.PUBLIC,
    exact: true,
    description: 'Test page for UI components and forms (admin-controlled)'
  },
  {
    path: '/test-forms',
    element: <TestForms />,
    requiredRoles: ROUTE_PERMISSIONS.PUBLIC,
    exact: true,
    description: 'Test page for form implementations and backend integration'
  },

  // Admin routes (using AdminRouteGuard for enhanced security)
  {
    path: '/admin',
    element: (
      <AdminRouteGuard>
        <AdminDashboard />
      </AdminRouteGuard>
    ),
    requiredRoles: ROUTE_PERMISSIONS.ADMIN_ONLY,
    exact: true,
    description: 'Admin dashboard with system overview'
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminRouteGuard>
        <Navigate to="/admin" replace />
      </AdminRouteGuard>
    ),
    requiredRoles: ROUTE_PERMISSIONS.ADMIN_ONLY,
    exact: true,
    description: 'Redirect to admin dashboard'
  },
  {
    path: '/admin/users',
    element: (
      <AdminRouteGuard>
        <AdminManagement />
      </AdminRouteGuard>
    ),
    requiredRoles: ROUTE_PERMISSIONS.ADMIN_ONLY,
    exact: true,
    description: 'Admin user management page with CRUD forms'
  },
  {
    path: '/admin/settings',
    element: (
      <AdminRouteGuard>
        <AdminSettings />
      </AdminRouteGuard>
    ),
    requiredRoles: ROUTE_PERMISSIONS.ADMIN_ONLY,
    exact: true,
    description: 'Admin system settings page'
  },
  {
    path: '/admin/students',
    element: (
      <AdminRouteGuard>
        <StudentManagement />
      </AdminRouteGuard>
    ),
    requiredRoles: ROUTE_PERMISSIONS.ADMIN_ONLY,
    exact: true,
    description: 'Admin student management with comprehensive CRUD operations'
  },
  {
    path: '/admin/student-data',
    element: (
      <AdminRouteGuard>
        <StudentDataManagement />
      </AdminRouteGuard>
    ),
    requiredRoles: ROUTE_PERMISSIONS.ADMIN_ONLY,
    exact: true,
    description: 'Admin student data management - performance, fees, and assignments'
  },
  {
    path: '/admin/faculty',
    element: (
      <AdminRouteGuard>
        <FacultyManagement />
      </AdminRouteGuard>
    ),
    requiredRoles: ROUTE_PERMISSIONS.ADMIN_ONLY,
    exact: true,
    description: 'Admin faculty management with comprehensive CRUD operations'
  },
  {
    path: '/admin/parents',
    element: (
      <AdminRouteGuard>
        <ParentManagement />
      </AdminRouteGuard>
    ),
    requiredRoles: ROUTE_PERMISSIONS.ADMIN_ONLY,
    exact: true,
    description: 'Admin parent management with comprehensive CRUD operations'
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
  {
    path: '/student/performance',
    element: <StudentPerformance />,
    requiredRoles: ROUTE_PERMISSIONS.STUDENT_ONLY,
    exact: true,
    description: 'Student academic performance view with subject-wise breakdown'
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
        // Check if route already has AdminRouteGuard or other guards embedded
        const hasEmbeddedGuard = React.isValidElement(route.element) &&
          (route.element.type === AdminRouteGuard ||
            route.path.startsWith('/admin'));

        // Wrap protected routes with ProtectedRoute component if no embedded guard
        const routeElement = !hasEmbeddedGuard && route.requiredRoles && route.requiredRoles.length > 0 ? (
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