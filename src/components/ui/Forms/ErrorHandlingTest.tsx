import React from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import { FormErrorHandler } from '../FormErrorHandler';
import { SuccessFeedback } from '../SuccessFeedback';
import { useToast } from '../../../contexts/ToastContext';
import { ErrorHandler } from '../../../utils/errorHandler';

/**
 * Test component to demonstrate error handling and user feedback features
 */
const ErrorHandlingTest: React.FC = () => {
  const [currentError, setCurrentError] = React.useState<any>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { showSuccess: showSuccessToast, showError: showErrorToast, showWarning, showInfo } = useToast();

  const simulateNetworkError = () => {
    const networkError = {
      isAxiosError: true,
      message: 'Network Error',
      code: 'NETWORK_ERROR',
    };
    setCurrentError(networkError);
  };

  const simulateValidationError = () => {
    const validationError = {
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          message: 'Validation failed',
          errors: {
            firstName: ['First name is required'],
            email: ['Invalid email format', 'Email already exists'],
            phoneNumber: ['Phone number must be 10 digits'],
          },
        },
      },
    };
    setCurrentError(validationError);
  };

  const simulateAuthError = () => {
    const authError = {
      isAxiosError: true,
      response: {
        status: 401,
        data: {
          message: 'Your session has expired. Please log in again.',
        },
      },
    };
    setCurrentError(authError);
  };

  const simulateServerError = () => {
    const serverError = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
          message: 'Internal server error occurred',
        },
      },
    };
    setCurrentError(serverError);
  };

  const simulateSuccess = () => {
    setShowSuccess(true);
    setCurrentError(null);
  };

  const handleRetry = () => {
    setCurrentError(null);
    showInfo('Retry Attempted', 'The operation is being retried...');
  };

  const clearError = () => {
    setCurrentError(null);
  };

  const testToasts = () => {
    showSuccessToast('Success!', 'This is a success message');
    setTimeout(() => showErrorToast('Error!', 'This is an error message'), 1000);
    setTimeout(() => showWarning('Warning!', 'This is a warning message'), 2000);
    setTimeout(() => showInfo('Info!', 'This is an info message'), 3000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Error Handling & User Feedback Test
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        This component demonstrates the comprehensive error handling and user feedback system.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Success Feedback Demo */}
      <SuccessFeedback
        show={showSuccess}
        title="Operation Successful"
        message="The test operation completed successfully!"
        onClose={() => setShowSuccess(false)}
      />

      {/* Error Handling Demo */}
      <FormErrorHandler
        error={currentError}
        showRetry={ErrorHandler.isRetryableError(currentError)}
        onRetry={handleRetry}
      />

      {/* Test Buttons */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Button variant="contained" color="success" onClick={simulateSuccess}>
          Show Success
        </Button>
        <Button variant="outlined" color="error" onClick={simulateNetworkError}>
          Network Error
        </Button>
        <Button variant="outlined" color="warning" onClick={simulateValidationError}>
          Validation Error
        </Button>
        <Button variant="outlined" color="info" onClick={simulateAuthError}>
          Auth Error
        </Button>
        <Button variant="outlined" color="secondary" onClick={simulateServerError}>
          Server Error
        </Button>
        <Button variant="outlined" onClick={clearError}>
          Clear Error
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Toast Notifications Test
      </Typography>
      <Button variant="contained" onClick={testToasts}>
        Test All Toast Types
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Error Analysis
      </Typography>
      {currentError && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(ErrorHandler.parseApiError(currentError), null, 2)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ErrorHandlingTest;