import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress, Paper } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { GoogleAuthService } from '../../services/googleAuth';
import type { GoogleAuthResponse } from '../../types/auth';

const AuthTest: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    loginWithDevAuth,
    logout, 
    clearError,
    getUserInitials,
    getDisplayName,
    getEmail
  } = useAuth();

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const googleAuthService = GoogleAuthService.getInstance();

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      if (isAuthenticated || isInitializing) return;
      
      setIsInitializing(true);
      setInitError(null);

      try {
        console.log('Initializing Google Auth...');
        
        await googleAuthService.initialize(
          async (response: GoogleAuthResponse) => {
            console.log('Google Auth response received:', response);
            try {
              await login(response.credential);
            } catch (error: any) {
              console.error('Login failed:', error);
              setInitError(`Login failed: ${error.message}`);
            }
          },
          (error: any) => {
            console.error('Google Auth error:', error);
            setInitError(`Google authentication initialization failed: ${error.message || error}`);
          }
        );

        // Small delay to ensure Google script is fully loaded
        setTimeout(() => {
          if (googleButtonRef.current && !isAuthenticated) {
            try {
              googleAuthService.renderButton(googleButtonRef.current, {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular'
              });
              console.log('Google button rendered successfully');
            } catch (error) {
              console.error('Failed to render Google button:', error);
              setInitError('Failed to render Google sign-in button.');
            }
          }
        }, 500);

      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
        setInitError('Failed to initialize Google authentication.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeGoogleAuth();
  }, [isAuthenticated, login, isInitializing]);

  const handleLogout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      
      // Log current tokens before logout
      const tokensBefore = {
        jwt: localStorage.getItem('edushield_token'),
        refresh: localStorage.getItem('edushield_refresh_token'),
        user: localStorage.getItem('edushield_user')
      };
      console.log('Tokens before logout:', tokensBefore);
      
      // Perform logout
      await logout();
      
      // Log tokens after logout
      const tokensAfter = {
        jwt: localStorage.getItem('edushield_token'),
        refresh: localStorage.getItem('edushield_refresh_token'),
        user: localStorage.getItem('edushield_user')
      };
      console.log('Tokens after logout:', tokensAfter);
      
      // Verify cleanup
      const allCleared = !tokensAfter.jwt && !tokensAfter.refresh && !tokensAfter.user;
      console.log(`✅ Logout completed. All tokens cleared: ${allCleared}`);
      
    } catch (error) {
      console.error('❌ Logout failed:', error);
      setInitError(`Logout failed: ${error}`);
    }
  };

  const handleDevLogin = async (email: string) => {
    try {
      setInitError(null);
      await loginWithDevAuth(email);
    } catch (error: any) {
      console.error('Dev login failed:', error);
      setInitError(error.message || 'Dev authentication failed');
    }
  };

  const devAccounts = [
    { email: 'iamsaquibanwar@gmail.com', role: 'Admin' },
    { email: 'saquibanwar01@gmail.com', role: 'Student' },
    { email: 'saquibedu@gmail.com', role: 'Faculty' },
    { email: 'kirakryto9ite@gmail.com', role: 'Parent' },
    { email: 'techtonicwave.business@gmail.com', role: 'DevAuth' }
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading authentication...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          EduShield Authentication Test
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          Testing Google OAuth integration and JWT token management
        </Typography>

        {(error || initError) && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => {
              clearError();
              setInitError(null);
            }}
          >
            {error || initError}
          </Alert>
        )}

        {!isAuthenticated ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Please sign in to continue
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Use your Google account to authenticate with the EduShield system.
            </Typography>
            
            {/* Dev authentication for testing - Show prominently */}
            <Box sx={{ mb: 3, p: 3, bgcolor: 'primary.50', borderRadius: 2, border: '1px solid', borderColor: 'primary.200' }}>
              <Typography variant="h6" gutterBottom color="primary">
                🚀 Quick Development Login
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Skip Google OAuth and login directly with test accounts:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 1 }}>
                {devAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="contained"
                    size="medium"
                    onClick={() => handleDevLogin(account.email)}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>
                        Login as {account.role}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {account.email}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Google OAuth Section */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Google OAuth Login
              </Typography>
              
              {isInitializing ? (
                <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Initializing Google Sign-In...
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <div ref={googleButtonRef} />
                </Box>
              )}
              
              <Typography variant="caption" color="text.secondary">
                Note: Google OAuth may not work in development without proper domain configuration.
              </Typography>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Environment Info:</strong><br />
                Google Client ID: {import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Configured ✓' : 'Missing ✗'}<br />
                API Base URL: {import.meta.env.VITE_API_BASE_URL}<br />
                Environment: {import.meta.env.VITE_NODE_ENV}
              </Typography>
              
              <Button
                variant="text"
                size="small"
                onClick={async () => {
                  try {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/health`);
                    const data = await response.json();
                    alert(`API Connection: ${response.ok ? 'Success ✓' : 'Failed ✗'}\n${JSON.stringify(data, null, 2)}`);
                  } catch (error: any) {
                    alert(`API Connection Failed: ${error.message}`);
                  }
                }}
                sx={{ mt: 1 }}
              >
                Test API Connection
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              🎉 Successfully authenticated!
            </Alert>

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                User Information
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Name:</strong> {getDisplayName() || 'N/A'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Email:</strong> {getEmail() || 'N/A'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Role:</strong> {user?.role || 'Not assigned'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Initials:</strong> {getUserInitials() || 'N/A'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Active:</strong> {user?.isActive ? 'Yes' : 'No'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>User ID:</strong> {user?.id || 'N/A'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Last Login:</strong> {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
                </Typography>
              </Box>
            </Paper>

            {/* Token Information for Testing */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                🔍 Token Debug Information
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  <strong>JWT Token:</strong> {localStorage.getItem('edushield_token') ? 
                    `${localStorage.getItem('edushield_token')?.substring(0, 50)}...` : 'None'}
                </Typography>
                
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  <strong>Refresh Token:</strong> {localStorage.getItem('edushield_refresh_token') ? 
                    `${localStorage.getItem('edushield_refresh_token')?.substring(0, 30)}...` : 'None'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Token Valid:</strong> {(() => {
                    const token = localStorage.getItem('edushield_token');
                    if (!token) return 'No token';
                    try {
                      const payload = JSON.parse(atob(token.split('.')[1]));
                      const isValid = payload.exp > Date.now() / 1000;
                      return isValid ? '✅ Valid' : '❌ Expired';
                    } catch {
                      return '❌ Invalid';
                    }
                  })()}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const tokens = {
                      jwt: localStorage.getItem('edushield_token'),
                      refresh: localStorage.getItem('edushield_refresh_token'),
                      user: localStorage.getItem('edushield_user')
                    };
                    console.log('Current tokens:', tokens);
                    alert(`Tokens logged to console. JWT: ${tokens.jwt ? 'Present' : 'Missing'}, Refresh: ${tokens.refresh ? 'Present' : 'Missing'}`);
                  }}
                >
                  Log Tokens to Console
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={async () => {
                    const refreshToken = localStorage.getItem('edushield_refresh_token');
                    if (!refreshToken) {
                      alert('No refresh token found');
                      return;
                    }
                    
                    try {
                      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/revoke`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken })
                      });
                      
                      const result = await response.text();
                      alert(`Token revocation test: ${response.ok ? 'Success' : 'Failed'}\nResponse: ${result}`);
                    } catch (error: any) {
                      alert(`Token revocation test failed: ${error.message}`);
                    }
                  }}
                >
                  Test Token Revocation
                </Button>
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleLogout}
                fullWidth
                size="large"
              >
                🚪 Sign Out (Full Logout)
              </Button>
              
              <Button 
                variant="outlined" 
                color="warning"
                onClick={async () => {
                  try {
                    console.log('🧪 Starting comprehensive logout test...');
                    
                    // Step 1: Get current tokens
                    const refreshToken = localStorage.getItem('edushield_refresh_token');
                    const jwt = localStorage.getItem('edushield_token');
                    
                    if (!refreshToken || !jwt) {
                      alert('❌ No tokens found to test logout');
                      return;
                    }
                    
                    console.log('Step 1: Current tokens found ✅');
                    
                    // Step 2: Test that tokens work before logout
                    try {
                      const testResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken })
                      });
                      
                      if (testResponse.ok) {
                        console.log('Step 2: Refresh token works before logout ✅');
                      } else {
                        console.log('Step 2: Refresh token already invalid ⚠️');
                      }
                    } catch (error) {
                      console.log('Step 2: Error testing refresh token:', error);
                    }
                    
                    // Step 3: Perform logout
                    console.log('Step 3: Performing logout...');
                    await logout();
                    
                    // Step 4: Verify tokens are cleared from localStorage
                    const tokensAfter = {
                      jwt: localStorage.getItem('edushield_token'),
                      refresh: localStorage.getItem('edushield_refresh_token'),
                      user: localStorage.getItem('edushield_user')
                    };
                    
                    const localStorageCleared = !tokensAfter.jwt && !tokensAfter.refresh && !tokensAfter.user;
                    console.log(`Step 4: LocalStorage cleared: ${localStorageCleared ? '✅' : '❌'}`);
                    
                    // Step 5: Test that refresh token is revoked on backend
                    try {
                      const revokeTestResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken })
                      });
                      
                      const revokeTestData = await revokeTestResponse.json();
                      const tokenRevoked = !revokeTestData.success && revokeTestData.errorMessage === 'Please re-authenticate';
                      console.log(`Step 5: Token revoked on backend: ${tokenRevoked ? '✅' : '❌'}`);
                      
                      // Final result
                      const allTestsPassed = localStorageCleared && tokenRevoked;
                      const message = `🧪 Logout Test Results:\n\n` +
                        `✅ LocalStorage cleared: ${localStorageCleared}\n` +
                        `✅ Backend token revoked: ${tokenRevoked}\n\n` +
                        `Overall: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`;
                      
                      alert(message);
                      console.log(message);
                      
                    } catch (error) {
                      console.error('Step 5: Error testing token revocation:', error);
                      alert(`❌ Error during logout test: ${error}`);
                    }
                    
                  } catch (error) {
                    console.error('❌ Logout test failed:', error);
                    alert(`❌ Logout test failed: ${error}`);
                  }
                }}
                size="medium"
              >
                🧪 Test Complete Logout Flow
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AuthTest;