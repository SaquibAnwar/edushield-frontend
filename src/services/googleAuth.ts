import type { GoogleAuthResponse } from '../types/auth';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
          revoke: (email: string, callback: () => void) => void;
        };
      };
    };
  }
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private isInitialized = false;
  private clientId: string;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    
    if (!this.clientId) {
      console.warn('Google Client ID not found in environment variables');
    }
  }

  static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  /**
   * Load Google Identity Services script
   */
  async loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.google?.accounts?.id) {
        console.log('Google script already loaded');
        resolve();
        return;
      }

      // Check if script tag already exists
      const existingScript = document.querySelector('script[src*="accounts.google.com"]');
      if (existingScript) {
        console.log('Google script tag exists, waiting for load...');
        existingScript.addEventListener('load', () => {
          console.log('Existing Google script loaded');
          resolve();
        });
        existingScript.addEventListener('error', () => {
          console.error('Existing Google script failed to load');
          reject(new Error('Failed to load Google script'));
        });
        return;
      }

      console.log('Creating new Google script tag...');
      // Create and load script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('Google script loaded successfully');
        // Add a small delay to ensure the script is fully initialized
        setTimeout(() => {
          if (window.google?.accounts?.id) {
            resolve();
          } else {
            reject(new Error('Google Identity Services not available after script load'));
          }
        }, 100);
      };

      script.onerror = () => {
        console.error('Failed to load Google Identity Services script');
        reject(new Error('Failed to load Google Identity Services script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Initialize Google OAuth
   */
  async initialize(onSuccess: (response: GoogleAuthResponse) => void, onError?: (error: any) => void): Promise<void> {
    console.log('Initializing Google OAuth...');
    console.log('Client ID:', this.clientId);
    
    if (!this.clientId) {
      const error = new Error('Google Client ID is required. Please set VITE_GOOGLE_CLIENT_ID in your .env file.');
      console.error(error.message);
      onError?.(error);
      throw error;
    }

    try {
      console.log('Loading Google script...');
      await this.loadGoogleScript();

      if (!window.google?.accounts?.id) {
        const error = new Error('Google Identity Services not available after script load');
        console.error(error.message);
        onError?.(error);
        throw error;
      }

      console.log('Initializing Google Identity Services...');
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: GoogleAuthResponse) => {
          console.log('Google OAuth callback received:', response);
          try {
            onSuccess(response);
          } catch (error) {
            console.error('Google auth callback error:', error);
            onError?.(error);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true
      });

      this.isInitialized = true;
      console.log('Google OAuth initialized successfully');
    } catch (error) {
      console.error('Google OAuth initialization failed:', error);
      onError?.(error);
      throw error;
    }
  }

  /**
   * Render Google Sign-In button
   */
  renderButton(element: HTMLElement, options?: {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string;
  }): void {
    if (!this.isInitialized || !window.google?.accounts?.id) {
      throw new Error('Google OAuth not initialized');
    }

    const config = {
      theme: options?.theme || 'outline',
      size: options?.size || 'large',
      text: options?.text || 'signin_with',
      shape: options?.shape || 'rectangular',
      logo_alignment: options?.logo_alignment || 'left',
      width: options?.width || '100%'
    };

    window.google.accounts.id.renderButton(element, config);
  }

  /**
   * Show One Tap prompt
   */
  showOneTap(): void {
    if (!this.isInitialized || !window.google?.accounts?.id) {
      throw new Error('Google OAuth not initialized');
    }

    window.google.accounts.id.prompt();
  }

  /**
   * Disable auto-select
   */
  disableAutoSelect(): void {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  /**
   * Revoke Google account access
   */
  revoke(email: string): Promise<void> {
    return new Promise((resolve) => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.revoke(email, () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Check if Google OAuth is initialized
   */
  isGoogleInitialized(): boolean {
    return this.isInitialized && !!window.google?.accounts?.id;
  }
}