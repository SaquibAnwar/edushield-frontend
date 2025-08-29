/**
 * System settings types for admin-controlled features
 */

export interface SystemSettings {
  id: string;
  testComponentsEnabled: boolean;
  debugModeEnabled: boolean;
  maintenanceMode: boolean;
  allowUserRegistration: boolean;
  maxFileUploadSize: number;
  sessionTimeoutMinutes: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string; // Admin user ID who last updated
}

export interface SystemSettingsUpdate {
  testComponentsEnabled?: boolean;
  debugModeEnabled?: boolean;
  maintenanceMode?: boolean;
  allowUserRegistration?: boolean;
  maxFileUploadSize?: number;
  sessionTimeoutMinutes?: number;
}

export interface SystemSettingsContextType {
  settings: SystemSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: SystemSettingsUpdate) => Promise<void>;
  refreshSettings: () => Promise<void>;
}