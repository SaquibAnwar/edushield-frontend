// import { apiService } from './api'; // Will be used when backend is implemented
import type { SystemSettings, SystemSettingsUpdate } from '../types/settings';

/**
 * System Settings Service
 * Handles admin-controlled system-wide settings
 */
export class SystemSettingsService {
  private static instance: SystemSettingsService;
  private cachedSettings: SystemSettings | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): SystemSettingsService {
    if (!SystemSettingsService.instance) {
      SystemSettingsService.instance = new SystemSettingsService();
    }
    return SystemSettingsService.instance;
  }

  /**
   * Get current system settings
   */
  async getSettings(): Promise<SystemSettings> {
    // Check cache first
    if (this.cachedSettings && Date.now() < this.cacheExpiry) {
      return this.cachedSettings;
    }

    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate with localStorage and default values
      const stored = localStorage.getItem('systemSettings');
      
      if (stored) {
        const settings = JSON.parse(stored) as SystemSettings;
        this.cachedSettings = settings;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        return settings;
      }

      // Default settings if none exist
      const defaultSettings: SystemSettings = {
        id: 'system-settings-1',
        testComponentsEnabled: false, // Disabled by default
        debugModeEnabled: false,
        maintenanceMode: false,
        allowUserRegistration: true,
        maxFileUploadSize: 10, // MB
        sessionTimeoutMinutes: 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: 'system'
      };

      // Save default settings
      localStorage.setItem('systemSettings', JSON.stringify(defaultSettings));
      this.cachedSettings = defaultSettings;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      
      return defaultSettings;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw new Error('Failed to fetch system settings');
    }
  }

  /**
   * Update system settings (admin only)
   */
  async updateSettings(updates: SystemSettingsUpdate, adminUserId: string): Promise<SystemSettings> {
    try {
      const currentSettings = await this.getSettings();
      
      const updatedSettings: SystemSettings = {
        ...currentSettings,
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: adminUserId
      };

      // In a real implementation, this would call the backend API
      // For now, we'll use localStorage
      localStorage.setItem('systemSettings', JSON.stringify(updatedSettings));
      
      // Clear cache to force refresh
      this.cachedSettings = updatedSettings;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      
      return updatedSettings;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw new Error('Failed to update system settings');
    }
  }

  /**
   * Check if test components are enabled
   */
  async isTestComponentsEnabled(): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      return settings.testComponentsEnabled;
    } catch (error) {
      console.error('Error checking test components status:', error);
      return false; // Default to disabled on error
    }
  }

  /**
   * Clear settings cache
   */
  clearCache(): void {
    this.cachedSettings = null;
    this.cacheExpiry = 0;
  }

  /**
   * Reset settings to defaults (admin only)
   */
  async resetToDefaults(adminUserId: string): Promise<SystemSettings> {
    const defaultSettings: SystemSettings = {
      id: 'system-settings-1',
      testComponentsEnabled: false,
      debugModeEnabled: false,
      maintenanceMode: false,
      allowUserRegistration: true,
      maxFileUploadSize: 10,
      sessionTimeoutMinutes: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: adminUserId
    };

    localStorage.setItem('systemSettings', JSON.stringify(defaultSettings));
    this.cachedSettings = defaultSettings;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;
    
    return defaultSettings;
  }
}

export const systemSettingsService = SystemSettingsService.getInstance();