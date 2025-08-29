import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Collapse,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { ErrorHandler, type ApiError, type ValidationError } from '../../../utils/errorHandler';

interface FormErrorHandlerProps {
  error?: any;
  validationErrors?: ValidationError[];
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
  testId?: string;
}

const FormErrorHandler: React.FC<FormErrorHandlerProps> = ({
  error,
  validationErrors = [],
  showRetry = false,
  onRetry,
  className,
  testId,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  if (!error && validationErrors.length === 0) {
    return null;
  }

  const apiError: ApiError | null = error ? ErrorHandler.parseApiError(error) : null;
  const parsedValidationErrors = error ? ErrorHandler.parseValidationErrors(error) : validationErrors;
  const isRetryable = error ? ErrorHandler.isRetryableError(error) : false;
  const { title, message } = error ? ErrorHandler.formatErrorForDisplay(error) : { title: 'Validation Error', message: 'Please correct the errors below' };

  const hasValidationErrors = parsedValidationErrors.length > 0;
  const isNetworkError = error ? ErrorHandler.isNetworkError(error) : false;
  const isAuthError = error ? ErrorHandler.isAuthError(error) : false;

  const getSeverity = () => {
    if (isAuthError) return 'warning';
    if (hasValidationErrors) return 'warning';
    return 'error';
  };

  const getIcon = () => {
    if (hasValidationErrors) return <WarningIcon />;
    return <ErrorIcon />;
  };

  return (
    <Box className={className} data-testid={testId} sx={{ mb: 2 }}>
      <Alert
        severity={getSeverity()}
        icon={getIcon()}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(showRetry || isRetryable) && onRetry && (
              <Button
                color="inherit"
                size="small"
                onClick={onRetry}
                startIcon={<RefreshIcon />}
              >
                Retry
              </Button>
            )}
            {apiError?.details && (
              <Button
                color="inherit"
                size="small"
                onClick={() => setShowDetails(!showDetails)}
                endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                Details
              </Button>
            )}
          </Box>
        }
      >
        <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>
        
        {/* Main error message */}
        <Typography variant="body2" sx={{ mb: hasValidationErrors ? 1 : 0 }}>
          {message}
        </Typography>

        {/* Validation errors list */}
        {hasValidationErrors && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              Please correct the following errors:
            </Typography>
            <List dense sx={{ py: 0 }}>
              {parsedValidationErrors.map((validationError, index) => (
                <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        <strong>{validationError.field}:</strong> {validationError.message}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Network error specific guidance */}
        {isNetworkError && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              • Check your internet connection
              <br />
              • Verify the server is running
              <br />
              • Try refreshing the page
            </Typography>
          </Box>
        )}

        {/* Authentication error guidance */}
        {isAuthError && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Please log in again to continue. You will be redirected to the login page.
            </Typography>
          </Box>
        )}

        {/* Detailed error information (collapsible) */}
        <Collapse in={showDetails}>
          {apiError?.details && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 1 }}>
                Technical Details:
              </Typography>
              <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(apiError.details, null, 2)}
              </Typography>
            </Box>
          )}
        </Collapse>
      </Alert>
    </Box>
  );
};

export default FormErrorHandler;