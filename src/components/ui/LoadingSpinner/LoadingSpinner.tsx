import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import type { LoadingSpinnerProps } from '../../../types/components';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  tip,
  spinning = true,
  delay = 0,
  children,
  className,
  testId,
}) => {
  const [showSpinner, setShowSpinner] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShowSpinner(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  const getSizeValue = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 60;
      default:
        return 40;
    }
  };

  if (!spinning || !showSpinner) {
    return <>{children}</>;
  }

  const spinner = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      className={className}
      data-testid={testId}
    >
      <CircularProgress size={getSizeValue()} />
      {tip && (
        <Typography variant="body2" color="text.secondary">
          {tip}
        </Typography>
      )}
    </Box>
  );

  if (children) {
    return (
      <Box position="relative">
        {children}
        {spinning && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(255, 255, 255, 0.8)"
            zIndex={1000}
          >
            {spinner}
          </Box>
        )}
      </Box>
    );
  }

  return spinner;
};

export default LoadingSpinner;