import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Typography,
  Fade,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface SuccessFeedbackProps {
  show: boolean;
  title: string;
  message?: string;
  autoHide?: boolean;
  duration?: number;
  onClose?: () => void;
  actions?: React.ReactNode;
  className?: string;
  testId?: string;
}

const SuccessFeedback: React.FC<SuccessFeedbackProps> = ({
  show,
  title,
  message,
  autoHide = true,
  duration = 4000,
  onClose,
  actions,
  className,
  testId,
}) => {
  const [visible, setVisible] = React.useState(show);

  React.useEffect(() => {
    setVisible(show);
    
    if (show && autoHide && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, autoHide, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) {
    return null;
  }

  return (
    <Fade in={visible} timeout={300}>
      <Box className={className} data-testid={testId} sx={{ mb: 2 }}>
        <Alert
          severity="success"
          icon={<SuccessIcon />}
          action={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {actions}
              {onClose && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleClose}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <CloseIcon fontSize="small" />
                </Button>
              )}
            </Box>
          }
          sx={{
            '& .MuiAlert-icon': {
              color: 'success.main',
            },
          }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>
          {message && (
            <Typography variant="body2">
              {message}
            </Typography>
          )}
        </Alert>
      </Box>
    </Fade>
  );
};

export default SuccessFeedback;