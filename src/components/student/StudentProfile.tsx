import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Chip } from '@mui/material';
import type { Student } from '../../types/user';
import { getGenderDisplay, getStudentStatusDisplay, getStudentStatusColor } from '../../utils/enumUtils';
import { formatDate } from '../../utils/dateUtils';

interface StudentProfileProps {
  student: Student;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ width: 64, height: 64 }}>
            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5">
              {student.firstName} {student.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {student.email}
            </Typography>
            <Chip 
              label={getStudentStatusDisplay(student.status)} 
              color={getStudentStatusColor(student.status)}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
        
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">Roll Number</Typography>
            <Typography variant="body1">{student.rollNumber}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Phone</Typography>
            <Typography variant="body1">{student.phoneNumber || 'N/A'}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Gender</Typography>
            <Typography variant="body1">{getGenderDisplay(student.gender)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
            <Typography variant="body1">
              {student.dateOfBirth ? formatDate(student.dateOfBirth) : 'N/A'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Address</Typography>
            <Typography variant="body1">{student.address || 'N/A'}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Enrollment Date</Typography>
            <Typography variant="body1">
              {student.enrollmentDate ? formatDate(student.enrollmentDate) : 'N/A'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentProfile;