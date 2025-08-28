import { UserRole } from '../types/auth';

/**
 * Route guard utilities for role-based access control
 */

// Define route permissions
export const ROUTE_PERMISSIONS = {
  // Public routes (no authentication required)
  PUBLIC: [],
  
  // Admin routes
  ADMIN_ONLY: [UserRole.Admin],
  
  // Student routes
  STUDENT_ONLY: [UserRole.Student],
  
  // Parent routes
  PARENT_ONLY: [UserRole.Parent],
  
  // Faculty routes
  FACULTY_ONLY: [UserRole.Faculty],
  
  // Multi-role routes (if needed in future)
  ADMIN_FACULTY: [UserRole.Admin, UserRole.Faculty],
  STUDENT_PARENT: [UserRole.Student, UserRole.Parent],
} as const;

/**
 * Check if user has permission to access a route
 */
export const hasRoutePermission = (
  userRole: UserRole | undefined,
  requiredRoles: UserRole[]
): boolean => {
  // Public routes are accessible to everyone
  if (requiredRoles.length === 0) {
    return true;
  }
  
  // Must be authenticated to access protected routes
  if (!userRole) {
    return false;
  }
  
  // Check if user role is in the required roles
  return requiredRoles.includes(userRole);
};

/**
 * Get the default dashboard path for a user role
 */
export const getDefaultDashboardPath = (role: UserRole): string => {
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

/**
 * Get all accessible routes for a user role
 */
export const getAccessibleRoutes = (userRole: UserRole): string[] => {
  const routes: string[] = ['/'];  // Everyone can access home
  
  switch (userRole) {
    case UserRole.Admin:
      routes.push('/admin', '/admin/dashboard');
      // Add more admin routes as they're implemented
      break;
      
    case UserRole.Student:
      routes.push('/student', '/student/dashboard');
      // Add more student routes as they're implemented
      break;
      
    case UserRole.Parent:
      routes.push('/parent', '/parent/dashboard');
      // Add more parent routes as they're implemented
      break;
      
    case UserRole.Faculty:
      routes.push('/faculty', '/faculty/dashboard');
      // Add more faculty routes as they're implemented
      break;
  }
  
  return routes;
};

/**
 * Check if a route path is accessible to a user role
 */
export const isRouteAccessible = (path: string, userRole: UserRole): boolean => {
  const accessibleRoutes = getAccessibleRoutes(userRole);
  return accessibleRoutes.includes(path);
};

/**
 * Validate route access and return appropriate redirect
 */
export const validateRouteAccess = (
  path: string,
  userRole: UserRole | undefined,
  isAuthenticated: boolean
): { allowed: boolean; redirectTo?: string } => {
  // Public routes
  if (path === '/' || path === '/unauthorized') {
    return { allowed: true };
  }
  
  // Must be authenticated for protected routes
  if (!isAuthenticated || !userRole) {
    return { allowed: false, redirectTo: '/' };
  }
  
  // Check role-based access
  if (isRouteAccessible(path, userRole)) {
    return { allowed: true };
  }
  
  // Redirect to appropriate dashboard if no access
  return { 
    allowed: false, 
    redirectTo: getDefaultDashboardPath(userRole) 
  };
};