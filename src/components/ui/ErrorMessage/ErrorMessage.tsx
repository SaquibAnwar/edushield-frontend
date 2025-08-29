import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import type { ErrorMessageProps } from '../../../types/components';

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  showIcon = true,
  showRetry = false,
  onRetry,
  type = 'error',
  className,
  testId,
  children,
}) => {
  const getErrorMessage = () => {
    if (!error) return 'An unknown error occurred';
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'An unknown error occurred';
  };

  const getIcon = () => {
    if (!showIcon) return undefined;
    
    switch (type) {
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <ErrorIcon />;
    }
  };

  const getSeverity = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'error';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Information';
      default:
        return 'Error';
    }
  };

  if (!error && !children) {
    return null;
  }

  return (
    <Box className={className} data-testid={testId}>
      <Alert
        severity={getSeverity()}
        icon={getIcon()}
        action={
          showRetry && onRetry ? (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>{getTitle()}</AlertTitle>
        {children || (
          <Typography variant="body2">
            {getErrorMessage()}
          </Typography>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;