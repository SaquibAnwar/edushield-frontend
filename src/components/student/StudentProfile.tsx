import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import type { Student } from '../../types/user';
import { enumUtils } from '../../utils/enumUtils';
import { dateConverter } from '../../utils/dateUtils';

interface StudentProfileProps {
  student: Student;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ student }) => {
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'success'; // Active
      case 1: return 'default'; // Inactive
      case 2: return 'warning'; // Suspended
      case 3: return 'info'; // Graduated
      case 4: return 'secondary'; // Transferred
      case 5: return 'error'; // Withdrawn
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{ 
            width: 80, 
            height: 80, 
            mr: 3,
            bgcolor: 'primary.main',
            fontSize: '2rem'
          }}
        >
          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {student.fullName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={enumUtils.getStudentStatusLabel(student.status)}
              color={getStatusColor(student.status) as any}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              Roll Number: {student.rollNumber}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} />
            Personal Information
          </Typography>
          
          <Box sx={{ ml: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1">
                {student.fullName}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1">
                {dateConverter.formatDisplayDate(student.dateOfBirth)} (Age: {student.age})
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body1">
                {enumUtils.getGenderLabel(student.gender)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ mr: 1 }} />
            Contact Information
          </Typography>
          
          <Box sx={{ ml: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Email Address
              </Typography>
              <Typography variant="body1">
                {student.email}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="body1">
                {student.phoneNumber}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">
                {student.address}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 1 }} />
            Academic Information
          </Typography>
          
          <Box sx={{ ml: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Roll Number
              </Typography>
              <Typography variant="body1">
                {student.rollNumber}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Enrollment Date
              </Typography>
              <Typography variant="body1">
                {dateConverter.formatDisplayDate(student.enrollmentDate)}
              </Typography>
            </Box>

            {student.grade && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Grade
                </Typography>
                <Typography variant="body1">
                  {student.grade}
                </Typography>
              </Box>
            )}

            {student.section && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Section
                </Typography>
                <Typography variant="body1">
                  {student.section}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={enumUtils.getStudentStatusLabel(student.status)}
                color={getStatusColor(student.status) as any}
                size="small"
              />
            </Box>
          </Box>
        </Box>

        {student.assignedFaculties && student.assignedFaculties.length > 0 && (
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <Typography variant="h6" gutterBottom>
              Assigned Faculty
            </Typography>
            
            <Box sx={{ ml: 4 }}>
              {student.assignedFaculties.map((assignment, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {assignment.subject}
                  </Typography>
                  <Typography variant="body1">
                    {assignment.firstName} {assignment.lastName}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StudentProfile;