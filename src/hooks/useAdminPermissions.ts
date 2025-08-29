import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { PermissionService } from '../services/permissions';

/**
 * Custom hook for admin permission checking
 * Provides reactive permission state for admin functionality
 */
export const useAdminPermissions = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const permissions = useMemo(() => {
    if (isLoading || !isAuthenticated) {
      return {
        hasAdminAccess: false,
        canAccessCRUDForms: false,
        canManageUsers: false,
        canAccessAdminDashboard: false,
        canAccessAdminManagement: false,
        isLoading: true,
        validationResult: {
          hasAccess: false,
          reason: 'Loading...',
          userRole: 'Unknown'
        }
      };
    }

    const validationResult = PermissionService.validateAdminPermissions(user);

    return {
      hasAdminAccess: PermissionService.hasAdminAccess(user),
      canAccessCRUDForms: PermissionService.canAccessCRUDForms(user),
      canManageUsers: PermissionService.canManageUsers(user),
      canAccessAdminDashboard: PermissionService.canAccessAdminDashboard(user),
      canAccessAdminManagement: PermissionService.canAccessAdminManagement(user),
      isLoading: false,
      validationResult
    };
  }, [user, isAuthenticated, isLoading]);

  return {
    ...permissions,
    user,
    isAuthenticated,
    getUserRoleDisplayName: () => 
      user ? PermissionService.getUserRoleDisplayName(user.role) : 'Unknown',
    getRoleBasedRedirect: () => 
      user ? PermissionService.getRoleBasedRedirect(user.role) : '/'
  };
};

export default useAdminPermissions;