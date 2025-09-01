import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import type { Faculty } from '../../types/user';
import { formatDate } from '../../utils/dateUtils';
import { getGenderLabel } from '../../utils/enumUtils';

interface FacultyProfileProps {
  faculty: Faculty;
}

export const FacultyProfile: React.FC<FacultyProfileProps> = ({ faculty }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            fontSize: '2rem',
            mr: 3,
          }}
        >
          {getInitials(faculty.firstName, faculty.lastName)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {faculty.fullName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Chip
              label={getStatusLabel(faculty.isActive)}
              color={getStatusColor(faculty.isActive)}
              size="small"
            />
            <Chip
              label={`${faculty.yearsOfService} years of service`}
              variant="outlined"
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {faculty.department} • {faculty.subject}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            Personal Information
          </Typography>
          <Box sx={{ pl: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1">
                {faculty.fullName}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1">
                {formatDate(faculty.dateOfBirth)} (Age: {faculty.age})
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body1">
                {getGenderLabel(faculty.gender)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="primary" />
            Contact Information
          </Typography>
          <Box sx={{ pl: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Email Address
              </Typography>
              <Typography variant="body1">
                {faculty.email}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="body1">
                {faculty.phoneNumber}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">
                {faculty.address}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Professional Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon color="primary" />
            Professional Information
          </Typography>
          <Box sx={{ pl: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Employee ID
              </Typography>
              <Typography variant="body1">
                {faculty.employeeId || 'Not assigned'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Department
              </Typography>
              <Typography variant="body1">
                {faculty.department}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Subject
              </Typography>
              <Typography variant="body1">
                {faculty.subject}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Hire Date
              </Typography>
              <Typography variant="body1">
                {formatDate(faculty.hireDate)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon color="primary" />
            System Information
          </Typography>
          <Box sx={{ pl: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={getStatusLabel(faculty.isActive)}
                color={getStatusColor(faculty.isActive)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Years of Service
              </Typography>
              <Typography variant="body1">
                {faculty.yearsOfService} years
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {formatDate(faculty.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body1">
                {formatDate(faculty.updatedAt)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FacultyProfile;