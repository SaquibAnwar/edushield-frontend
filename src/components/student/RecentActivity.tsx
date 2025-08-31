import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, Box } from '@mui/material';
import { Assignment, Payment, School, Grade } from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

interface ActivityItem {
  id: string;
  type: 'assignment' | 'payment' | 'exam' | 'grade';
  title: string;
  description: string;
  date: string;
  status?: 'completed' | 'pending' | 'overdue';
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [] }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <Assignment />;
      case 'payment':
        return <Payment />;
      case 'exam':
        return <School />;
      case 'grade':
        return <Grade />;
      default:
        return <Assignment />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  // Mock data if no activities provided
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'grade',
      title: 'Mathematics Quiz',
      description: 'Received grade: A-',
      date: new Date().toISOString(),
      status: 'completed'
    },
    {
      id: '2',
      type: 'assignment',
      title: 'Physics Lab Report',
      description: 'Due in 3 days',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Tuition Fee',
      description: 'Payment overdue',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'overdue'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        
        {displayActivities.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No recent activity
          </Typography>
        ) : (
          <List>
            {displayActivities.map((activity) => (
              <ListItem key={activity.id} divider>
                <ListItemIcon>
                  {getActivityIcon(activity.type)}
                </ListItemIcon>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(activity.date)}
                      </Typography>
                    </Box>
                  }
                />
                {activity.status && (
                  <Chip 
                    label={activity.status} 
                    color={getStatusColor(activity.status) as any}
                    size="small"
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;