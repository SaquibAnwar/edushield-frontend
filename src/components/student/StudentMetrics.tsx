import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import type { StudentMetrics } from '../../types/api';

interface StudentMetricsProps {
  metrics: StudentMetrics;
}

export const StudentMetricsComponent: React.FC<StudentMetricsProps> = ({ metrics }) => {
  const getGradeColor = (grade: string) => {
    const gradeUpper = grade.toUpperCase();
    switch (gradeUpper) {
      case 'A+':
      case 'A':
        return 'success';
      case 'B+':
      case 'B':
        return 'info';
      case 'C+':
      case 'C':
        return 'warning';
      case 'D':
      case 'F':
        return 'error';
      default:
        return 'default';
    }
  };

  const getGradePercentage = (grade: string) => {
    const gradeUpper = grade.toUpperCase();
    switch (gradeUpper) {
      case 'A+': return 95;
      case 'A': return 90;
      case 'B+': return 85;
      case 'B': return 80;
      case 'C+': return 75;
      case 'C': return 70;
      case 'D': return 60;
      case 'F': return 40;
      default: return 0;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <TrendingUpIcon sx={{ mr: 1 }} />
        Academic Overview
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
        {/* Average Grade */}
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <GradeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {metrics.averageGrade || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Grade
              </Typography>
              {metrics.averageGrade && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={getGradePercentage(metrics.averageGrade)}
                    color={getGradeColor(metrics.averageGrade) as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Total Subjects */}
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {metrics.totalSubjects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enrolled Subjects
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Total Exams */}
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <GradeIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {metrics.totalExams}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exams Taken
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Fee Status */}
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              {metrics.overdueAmount > 0 ? (
                <>
                  <WarningIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                  <Typography variant="h4" component="div" gutterBottom color="error">
                    ${metrics.overdueAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overdue Amount
                  </Typography>
                  <Chip
                    label="Payment Required"
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </>
              ) : metrics.pendingFees > 0 ? (
                <>
                  <PaymentIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" component="div" gutterBottom color="warning.main">
                    ${metrics.pendingFees.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Fees
                  </Typography>
                  <Chip
                    label="Payment Due"
                    color="warning"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </>
              ) : (
                <>
                  <PaymentIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" component="div" gutterBottom color="success.main">
                    $0.00
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Outstanding Fees
                  </Typography>
                  <Chip
                    label="All Paid"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Paper>
  );
};

export default StudentMetricsComponent;