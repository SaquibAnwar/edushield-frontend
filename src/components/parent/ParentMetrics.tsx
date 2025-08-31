import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  ChildCare as ChildIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import type { ParentMetrics } from '../../types/api';
import type { StudentPerformance } from '../../types/user';
import { getEnumDisplayName } from '../../utils/enumUtils';
import { dateConverter } from '../../utils/dateUtils';

interface ParentMetricsProps {
  metrics: ParentMetrics;
}

export const ParentMetricsComponent: React.FC<ParentMetricsProps> = ({ metrics }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPerformanceColor = (percentage?: number) => {
    if (!percentage) return 'default';
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box>
      {/* Metrics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        {/* Total Children */}
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ChildIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="div" gutterBottom>
              {metrics.totalChildren}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Children
            </Typography>
          </CardContent>
        </Card>

        {/* Children with Overdue Fees */}
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" component="div" gutterBottom>
              {metrics.childrenWithOverdueFees}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Children with Overdue Fees
            </Typography>
          </CardContent>
        </Card>

        {/* Total Overdue Amount */}
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <PaymentIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h4" component="div" gutterBottom>
              {formatCurrency(metrics.totalOverdueAmount)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Overdue Amount
            </Typography>
          </CardContent>
        </Card>

        {/* Recent Performances Count */}
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" component="div" gutterBottom>
              {metrics.recentPerformances?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recent Performances
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Performances List */}
      {metrics.recentPerformances && metrics.recentPerformances.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 1 }} />
            Recent Academic Performances
          </Typography>
          <List>
            {metrics.recentPerformances.slice(0, 5).map((performance: StudentPerformance, index: number) => (
              <ListItem key={performance.id} divider={index < metrics.recentPerformances.length - 1}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getPerformanceColor(performance.percentage) + '.main' }}>
                    <SchoolIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {performance.studentFirstName} {performance.studentLastName}
                      </Typography>
                      <Chip
                        label={performance.subject}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={getEnumDisplayName('ExamType', performance.examType)}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Score: {performance.formattedScore} • Grade: {performance.grade}
                        {performance.percentage && ` • ${performance.percentage.toFixed(1)}%`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Exam Date: {dateConverter.formatForDisplay(performance.examDate)}
                        {performance.examTitle && ` • ${performance.examTitle}`}
                      </Typography>
                      {performance.comments && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          "{performance.comments}"
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
          {metrics.recentPerformances.length > 5 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Showing 5 of {metrics.recentPerformances.length} recent performances
            </Typography>
          )}
        </Paper>
      )}

      {/* No Recent Performances */}
      {(!metrics.recentPerformances || metrics.recentPerformances.length === 0) && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Recent Performances
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No recent academic performances found for your children.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};