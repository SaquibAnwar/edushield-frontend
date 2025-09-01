import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import type { FacultyMetrics } from '../../types/api';
import { formatDate } from '../../utils/dateUtils';
import { getExamTypeLabel } from '../../utils/enumUtils';

interface FacultyMetricsProps {
  metrics: FacultyMetrics;
}

export const FacultyMetricsComponent: React.FC<FacultyMetricsProps> = ({ metrics }) => {
  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A':
      case 'A+':
        return 'success';
      case 'B':
      case 'B+':
        return 'info';
      case 'C':
      case 'C+':
        return 'warning';
      case 'D':
      case 'F':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatPerformanceDate = (dateString: string) => {
    try {
      return formatDate(dateString);
    } catch {
      return dateString;
    }
  };

  return (
    <Box>
      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: 140 }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {metrics.assignedStudents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assigned Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: 140 }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <SchoolIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {metrics.totalSubjects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subjects Teaching
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: 140 }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <GradeIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {metrics.averageClassGrade || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Class Grade
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: 140 }}>
            <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {metrics.recentPerformances?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent Assessments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Performances */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GradeIcon color="primary" />
          Recent Student Performances
        </Typography>
        
        {metrics.recentPerformances && metrics.recentPerformances.length > 0 ? (
          <List>
            {metrics.recentPerformances.map((performance: any, index: number) => (
              <React.Fragment key={performance.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" component="span">
                          {performance.studentFirstName} {performance.studentLastName}
                        </Typography>
                        <Chip
                          label={performance.grade}
                          color={getGradeColor(performance.grade) as any}
                          size="small"
                        />
                        <Chip
                          label={`${performance.percentage?.toFixed(1)}%`}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>{performance.subject}</strong> • {getExamTypeLabel(performance.examType)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Score: {performance.formattedScore} • {formatPerformanceDate(performance.examDate)}
                        </Typography>
                        {performance.examTitle && (
                          <Typography variant="body2" color="text.secondary">
                            {performance.examTitle}
                          </Typography>
                        )}
                        {performance.comments && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            "{performance.comments}"
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < metrics.recentPerformances.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <GradeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No recent student performances found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Student assessment data will appear here once available
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FacultyMetricsComponent;