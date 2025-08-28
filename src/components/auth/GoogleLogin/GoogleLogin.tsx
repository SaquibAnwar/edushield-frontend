import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Alert, CircularProgress, Typography } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { GoogleAuthService } from '../../../services/googleAuth';
import { useAuth } from '../../../hooks/useAuth';
import type { GoogleAuthResponse } from '../../../types/auth';

interface GoogleLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  buttonText?: string;
}

export const GoogleLogin: React.FC<GoogleLoginProps> = ({
  onSuccess,
  onError,
  disabled = false,
  buttonText = 'Sign in with Google'
}) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const googleAuthService = GoogleAuthService.getInstance();

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      if (disabled || isLoading) return;

      console.log('GoogleLogin: Starting initialization...');
      setIsInitializing(true);
      setInitError(null);
      clearError();

      try {
        await googleAuthService.initialize(
          handleGoogleSuccess,
          handleGoogleError
        );

        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (buttonRef.current) {
            try {
              googleAuthService.renderButton(buttonRef.current, {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
                width: '100%'
              });
              console.log('GoogleLogin: Button rendered successfully');
            } catch (renderError: any) {
              console.error('GoogleLogin: Button render failed:', renderError);
              setInitError('Failed to render Google sign-in button');
            }
          }
        }, 100);

      } catch (error: any) {
        console.error('GoogleLogin: Initialization failed:', error);
        setInitError(error.message || 'Failed to initialize Google authentication');
        onError?.(error.message || 'Failed to initialize Google authentication');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeGoogleAuth();
  }, [disabled, isLoading]);

  const handleGoogleSuccess = async (response: GoogleAuthResponse) => {
    console.log('GoogleLogin: Authentication successful:', response);
    
    if (!response.credential) {
      const errorMsg = 'No credential received from Google';
      console.error('GoogleLogin:', errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      await login(response.credential);
      onSuccess?.();
    } catch (error: any) {
      console.error('GoogleLogin: Login failed:', error);
      onError?.(error.message || 'Login failed');
    }
  };

  const handleGoogleError = (error: any) => {
    console.error('GoogleLogin: Google authentication error:', error);
    const errorMsg = error?.message || 'Google authentication failed';
    setInitError(errorMsg);
    onError?.(errorMsg);
  };

  const handleFallbackLogin = () => {
    console.log('GoogleLogin: Attempting fallback login...');
    if (googleAuthService.isGoogleInitialized()) {
      try {
        googleAuthService.showOneTap();
      } catch (error: any) {
        console.error('GoogleLogin: Failed to show Google One Tap:', error);
        onError?.(error.message || 'Failed to show Google login');
      }
    } else {
      console.error('GoogleLogin: Google not initialized for fallback');
      onError?.('Google authentication not available');
    }
  };

  // Show loading state
  if (isInitializing || isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        gap={2}
        sx={{ width: '100%', maxWidth: 400 }}
      >
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">
          {isInitializing ? 'Initializing Google authentication...' : 'Signing in...'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      {/* Error Display */}
      {(initError || error) && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => {
            setInitError(null);
            clearError();
          }}
        >
          {initError || error}
        </Alert>
      )}

      {/* Google button will be rendered here */}
      <div ref={buttonRef} style={{ width: '100%', minHeight: '44px' }} />
      
      {/* Fallback button - always visible for testing */}
      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={handleFallbackLogin}
        disabled={disabled}
        sx={{ 
          py: 1.5,
          textTransform: 'none',
          fontSize: '16px',
          mt: 1
        }}
      >
        {buttonText} (Fallback)
      </Button>
    </Box>
  );
};

export default GoogleLogin;