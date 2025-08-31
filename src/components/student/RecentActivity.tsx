import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Grade as GradeIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import type { StudentPerformance, StudentFee } from '../../types/user';
import { enumUtils } from '../../utils/enumUtils';
import { dateConverter } from '../../utils/dateUtils';

interface RecentActivityProps {
  recentPerformances: StudentPerformance[];
  recentFees: StudentFee[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  recentPerformances,
  recentFees
}) => {
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

  const getPaymentStatusColor = (status: number) => {
    switch (status) {
      case 2: return 'success'; // Paid
      case 1: return 'warning'; // Partial
      case 3: return 'error'; // Overdue
      case 0: return 'info'; // Pending
      default: return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {/* Recent Performances */}
      <Box sx={{ flex: '1 1 400px', minWidth: '300px' }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1 }} />
            Recent Performance
          </Typography>

          {recentPerformances.length > 0 ? (
            <List>
              {recentPerformances.slice(0, 5).map((performance, index) => (
                <React.Fragment key={performance.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <GradeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            {performance.subject}
                          </Typography>
                          <Chip
                            label={performance.grade}
                            color={getGradeColor(performance.grade) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {enumUtils.getExamTypeLabel(performance.examType)} • {performance.formattedScore}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dateConverter.formatDisplayDate(performance.examDate)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentPerformances.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <GradeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No recent performance data available
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Recent Fees */}
      <Box sx={{ flex: '1 1 400px', minWidth: '300px' }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ mr: 1 }} />
            Recent Fee Status
          </Typography>

          {recentFees.length > 0 ? (
            <List>
              {recentFees.slice(0, 5).map((fee, index) => (
                <React.Fragment key={fee.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {fee.isOverdue ? (
                        <WarningIcon color="error" />
                      ) : (
                        <PaymentIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            {enumUtils.getFeeTypeLabel(fee.feeType)} - {fee.term}
                          </Typography>
                          <Chip
                            label={enumUtils.getPaymentStatusLabel(fee.paymentStatus)}
                            color={getPaymentStatusColor(fee.paymentStatus) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Amount Due: ${fee.amountDue.toFixed(2)}
                            {fee.isOverdue && (
                              <Typography component="span" color="error" sx={{ ml: 1 }}>
                                ({fee.daysOverdue} days overdue)
                              </Typography>
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Due: {dateConverter.formatDisplayDate(fee.dueDate)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentFees.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <PaymentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No recent fee information available
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default RecentActivity;