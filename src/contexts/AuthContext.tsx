import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, AuthAction } from '../types/auth';
import { AuthService } from '../services/auth';
import { storage } from '../utils/storage';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case 'REFRESH_TOKEN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        error: null
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

// Context type
interface AuthContextType {
  state: AuthState;
  login: (idToken: string) => Promise<void>;
  loginWithDevAuth: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  clearError: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const authService = AuthService.getInstance();

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = storage.getUser();
        const storedToken = storage.getToken();
        const storedRefreshToken = storage.getRefreshToken();

        if (storedUser && storedToken && storedRefreshToken) {
          // Check if token is still valid
          if (storage.isTokenValid()) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: storedUser,
                token: storedToken,
                refreshToken: storedRefreshToken
              }
            });
          } else {
            // Try to refresh token
            try {
              const authResult = await authService.refreshToken();
              dispatch({
                type: 'REFRESH_TOKEN',
                payload: authResult
              });
            } catch (error) {
              // Refresh failed, clear storage and logout
              storage.clearAll();
              dispatch({ type: 'LOGOUT' });
            }
          }
        } else {
          // No stored auth data
          console.log('AuthContext: No stored auth data, setting to logged out state');
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        storage.clearAll();
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const checkTokenExpiry = () => {
      if (authService.shouldRefreshToken()) {
        refreshToken();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  // Login function
  const login = async (idToken: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const authResult = await authService.authenticateWithGoogle(idToken);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: authResult.user,
          token: authResult.token,
          refreshToken: authResult.refreshToken
        }
      });
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Login failed'
      });
      throw error;
    }
  };

  // Dev login function for testing
  const loginWithDevAuth = async (email: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const authResult = await authService.authenticateWithDevAuth(email);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: authResult.user,
          token: authResult.token,
          refreshToken: authResult.refreshToken
        }
      });
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Login failed'
      });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<void> => {
    try {
      const authResult = await authService.refreshToken();
      dispatch({
        type: 'REFRESH_TOKEN',
        payload: authResult
      });
    } catch (error: any) {
      console.error('Token refresh error:', error);
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };

  // Refresh user data function
  const refreshUserData = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: currentUser,
            token: state.token,
            refreshToken: state.refreshToken
          }
        });
      }
    } catch (error: any) {
      console.error('Failed to refresh user data:', error);
      // Don't logout on user data refresh failure, just log the error
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    loginWithDevAuth,
    logout,
    refreshToken,
    refreshUserData,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};