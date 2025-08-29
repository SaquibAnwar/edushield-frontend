import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { systemSettingsService } from '../services/systemSettings';
import { useAuth } from '../hooks/useAuth';
import type { SystemSettings, SystemSettingsUpdate, SystemSettingsContextType } from '../types/settings';

// Settings state and actions
interface SettingsState {
  settings: SystemSettings | null;
  isLoading: boolean;
  error: string | null;
}

type SettingsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: SystemSettings }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_SUCCESS'; payload: SystemSettings }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: SettingsState = {
  settings: null,
  isLoading: true,
  error: null
};

// Reducer
function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        settings: action.payload,
        isLoading: false,
        error: null
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'UPDATE_SUCCESS':
      return {
        ...state,
        settings: action.payload,
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

// Create context
const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

// Provider props
interface SystemSettingsProviderProps {
  children: ReactNode;
}

// Provider component
export const SystemSettingsProvider: React.FC<SystemSettingsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Fetch settings on mount and when authentication changes
  useEffect(() => {
    fetchSettings();
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    dispatch({ type: 'FETCH_START' });
    
    try {
      const settings = await systemSettingsService.getSettings();
      dispatch({ type: 'FETCH_SUCCESS', payload: settings });
    } catch (error) {
      console.error('Error fetching system settings:', error);
      dispatch({ 
        type: 'FETCH_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch settings' 
      });
    }
  };

  const updateSettings = async (updates: SystemSettingsUpdate): Promise<void> => {
    if (!user || !isAuthenticated) {
      throw new Error('User must be authenticated to update settings');
    }

    // Only admins can update settings
    if (user.role !== 1) { // UserRole.Admin = 1
      throw new Error('Only administrators can update system settings');
    }

    try {
      const updatedSettings = await systemSettingsService.updateSettings(updates, user.id);
      dispatch({ type: 'UPDATE_SUCCESS', payload: updatedSettings });
    } catch (error) {
      console.error('Error updating system settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update settings';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const refreshSettings = async (): Promise<void> => {
    // Clear cache and fetch fresh settings
    systemSettingsService.clearCache();
    await fetchSettings();
  };

  const contextValue: SystemSettingsContextType = {
    settings: state.settings,
    isLoading: state.isLoading,
    error: state.error,
    updateSettings,
    refreshSettings
  };

  return (
    <SystemSettingsContext.Provider value={contextValue}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

// Hook to use system settings
export const useSystemSettings = (): SystemSettingsContextType => {
  const context = useContext(SystemSettingsContext);
  
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  
  return context;
};