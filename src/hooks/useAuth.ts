import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { state, login, loginWithDevAuth, logout, refreshToken, clearError } = context;

  // Helper functions
  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  };

  const isAdmin = (): boolean => {
    return hasRole(UserRole.Admin);
  };

  const isStudent = (): boolean => {
    return hasRole(UserRole.Student);
  };

  const isParent = (): boolean => {
    return hasRole(UserRole.Parent);
  };

  const isFaculty = (): boolean => {
    return hasRole(UserRole.Faculty);
  };

  const getUserInitials = (): string => {
    if (!state.user?.name) return '';
    
    const names = state.user.name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getDisplayName = (): string => {
    return state.user?.name || '';
  };

  const getEmail = (): string => {
    return state.user?.email || '';
  };

  const getProfilePicture = (): string | undefined => {
    return state.user?.profilePictureUrl;
  };

  return {
    // State
    user: state.user,
    token: state.token,
    refreshToken: state.refreshToken,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    loginWithDevAuth,
    logout,
    refreshAuthToken: refreshToken,
    clearError,

    // Helper functions
    hasRole,
    hasAnyRole,
    isAdmin,
    isStudent,
    isParent,
    isFaculty,
    getUserInitials,
    getDisplayName,
    getEmail,
    getProfilePicture
  };
};