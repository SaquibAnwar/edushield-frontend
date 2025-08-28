import axios from 'axios';
import type { AuthResult, TokenPayload } from '../types/auth';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Authenticate user with Google ID token
   */
  async authenticateWithGoogle(idToken: string): Promise<AuthResult> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        idToken
      });

      const authResult: AuthResult = response.data;
      
      if (!authResult.success) {
        throw new Error(authResult.errorMessage || 'Authentication failed');
      }

      // Store tokens and user data
      if (authResult.token) storage.setToken(authResult.token);
      if (authResult.refreshToken) storage.setRefreshToken(authResult.refreshToken);
      if (authResult.user) storage.setUser(authResult.user);

      return authResult;
    } catch (error: any) {
      console.error('Google authentication failed:', error);
      throw new Error(error.response?.data?.errorMessage || error.response?.data?.error || 'Authentication failed');
    }
  }

  /**
   * Authenticate user with dev auth (for testing)
   */
  async authenticateWithDevAuth(email: string): Promise<AuthResult> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/dev`, {
        email
      });

      const authResult: AuthResult = response.data;
      
      if (!authResult.success) {
        throw new Error(authResult.errorMessage || 'Authentication failed');
      }

      // Store tokens and user data
      if (authResult.token) storage.setToken(authResult.token);
      if (authResult.refreshToken) storage.setRefreshToken(authResult.refreshToken);
      if (authResult.user) storage.setUser(authResult.user);

      return authResult;
    } catch (error: any) {
      console.error('Dev authentication failed:', error);
      throw new Error(error.response?.data?.errorMessage || error.response?.data?.error || 'Authentication failed');
    }
  }

  /**
   * Refresh JWT token using refresh token
   */
  async refreshToken(): Promise<AuthResult> {
    const refreshToken = storage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken
      });

      const authResult: AuthResult = response.data;
      
      if (!authResult.success) {
        throw new Error(authResult.errorMessage || 'Token refresh failed');
      }

      // Update stored tokens and user data
      if (authResult.token) storage.setToken(authResult.token);
      if (authResult.refreshToken) storage.setRefreshToken(authResult.refreshToken);
      if (authResult.user) storage.setUser(authResult.user);

      return authResult;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      // Clear invalid tokens
      storage.clearAll();
      throw new Error(error.response?.data?.errorMessage || error.response?.data?.error || 'Token refresh failed');
    }
  }

  /**
   * Revoke refresh token and logout
   */
  async revokeToken(): Promise<void> {
    const refreshToken = storage.getRefreshToken();
    
    if (refreshToken) {
      try {
        await axios.post(`${API_BASE_URL}/auth/revoke`, {
          refreshToken
        });
      } catch (error) {
        console.error('Token revocation failed:', error);
        // Continue with logout even if revocation fails
      }
    }

    // Clear all stored auth data
    storage.clearAll();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.revokeToken();
      
      // Sign out from Google
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Ensure local storage is cleared even if API call fails
      storage.clearAll();
    }
  }

  /**
   * Get current authentication status
   */
  isAuthenticated(): boolean {
    return storage.isTokenValid() && !!storage.getUser();
  }

  /**
   * Get current user from storage
   */
  getCurrentUser() {
    return storage.getUser();
  }

  /**
   * Get current token from storage
   */
  getCurrentToken(): string | null {
    return storage.getToken();
  }

  /**
   * Decode JWT token payload
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }

  /**
   * Check if token needs refresh (expires in less than 5 minutes)
   */
  shouldRefreshToken(): boolean {
    const token = storage.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload) return false;

    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    
    // Refresh if token expires in less than 5 minutes
    return timeUntilExpiry < 300;
  }
}