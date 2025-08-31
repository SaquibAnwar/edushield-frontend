import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { PerformanceView } from '../../components/student';

const StudentPerformance: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={3}>
        <Typography variant="h4" gutterBottom>
          Academic Performance
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Track your academic progress, exam results, and performance metrics.
        </Typography>
        
        <PerformanceView />
      </Box>
    </Container>
  );
};

export default StudentPerformance;