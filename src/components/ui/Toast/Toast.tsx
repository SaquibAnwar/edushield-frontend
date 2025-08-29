import React from 'react';
import {
  Alert,
  AlertTitle,
  Snackbar,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import type { ToastProps } from '../../../types/components';

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 6000,
  closable = true,
  onClose,
}) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    onClose?.();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ color: 'success.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'info':
        return <InfoIcon sx={{ color: 'info.main' }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main' }} />;
    }
  };

  const getSeverity = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }}
    >
      <Alert
        severity={getSeverity()}
        icon={getIcon()}
        action={
          closable ? (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : undefined
        }
        sx={{ minWidth: 300, maxWidth: 500 }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>
        {message && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {message}
          </Typography>
        )}
      </Alert>
    </Snackbar>
  );
};

export default Toast;