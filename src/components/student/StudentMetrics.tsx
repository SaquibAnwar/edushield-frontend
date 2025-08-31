import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import type { StudentMetrics } from '../../types/api';

interface StudentMetricsComponentProps {
  metrics: StudentMetrics;
}

const StudentMetricsComponent: React.FC<StudentMetricsComponentProps> = ({ metrics }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Academic Metrics
        </Typography>
        
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
          <Box>
            <Typography variant="body2" color="text.secondary">Average Grade</Typography>
            <Typography variant="h4" color="primary">
              {metrics.averageGrade || 'N/A'}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">Total Subjects</Typography>
            <Typography variant="h4">
              {metrics.totalSubjects || 0}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">Total Exams</Typography>
            <Typography variant="h4">
              {metrics.totalExams || 0}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">Pending Fees</Typography>
            <Typography variant="h4" color={metrics.pendingFees > 0 ? "warning.main" : "success.main"}>
              ${metrics.pendingFees?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">Overdue Amount</Typography>
            <Typography variant="h4" color={metrics.overdueAmount > 0 ? "error.main" : "success.main"}>
              ${metrics.overdueAmount?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">Recent Performances</Typography>
            <Typography variant="h4">
              {metrics.recentPerformances?.length || 0}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentMetricsComponent;