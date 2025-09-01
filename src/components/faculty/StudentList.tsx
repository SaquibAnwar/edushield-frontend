import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import type { Student } from '../../types/user';
import { getStudentStatusLabel, getGenderLabel } from '../../utils/enumUtils';
import { formatDate } from '../../utils/dateUtils';

interface StudentListProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onManagePerformance: (student: Student) => void;
  loading?: boolean;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onViewStudent: _onViewStudent,
  onManagePerformance,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;

    const term = searchTerm.toLowerCase();
    return students.filter(student =>
      student.firstName.toLowerCase().includes(term) ||
      student.lastName.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      student.rollNumber.toLowerCase().includes(term) ||
      (student.grade && student.grade.toLowerCase().includes(term)) ||
      (student.section && student.section.toLowerCase().includes(term))
    );
  }, [students, searchTerm]);

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedStudent(null);
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case 0: // Active
        return 'success';
      case 1: // Inactive
        return 'default';
      case 2: // Suspended
        return 'error';
      case 3: // Graduated
        return 'info';
      case 4: // Transferred
        return 'warning';
      case 5: // Withdrawn
        return 'error';
      default:
        return 'default';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading students...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Header and Search */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Students ({students.length})
        </Typography>
        <TextField
          fullWidth
          placeholder="Search students by name, email, roll number, grade, or section..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600 }}
        />
      </Box>

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <Grid container spacing={3}>
          {filteredStudents.map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'primary.main',
                        mr: 2,
                      }}
                    >
                      {getInitials(student.firstName, student.lastName)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="div" noWrap>
                        {student.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {student.rollNumber}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getStudentStatusLabel(student.status)}
                      color={getStatusColor(student.status) as any}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {student.grade && (
                      <Chip
                        label={`Grade ${student.grade}`}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <EmailIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      {student.email}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <PhoneIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      {student.phoneNumber}
                    </Typography>
                  </Box>

                  {student.grade && student.section && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <SchoolIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        Grade {student.grade}, Section {student.section}
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="body2" color="text.secondary">
                    Enrolled: {formatDate(student.enrollmentDate)}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewDetails(student)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<GradeIcon />}
                    onClick={() => onManagePerformance(student)}
                  >
                    Manage Grades
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {searchTerm ? 'No students found' : 'No students assigned'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'Students will appear here once they are assigned to you'}
          </Typography>
        </Paper>
      )}

      {/* Student Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Student Details
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.fullName}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedStudent.dateOfBirth)} (Age: {selectedStudent.age})
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1">
                      {getGenderLabel(selectedStudent.gender)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.address}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    Academic Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Roll Number
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.rollNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Grade & Section
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.grade && selectedStudent.section
                        ? `Grade ${selectedStudent.grade}, Section ${selectedStudent.section}`
                        : 'Not assigned'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Enrollment Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedStudent.enrollmentDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={getStudentStatusLabel(selectedStudent.status)}
                      color={getStatusColor(selectedStudent.status) as any}
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.email}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.phoneNumber}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>
            Close
          </Button>
          {selectedStudent && (
            <Button
              variant="contained"
              startIcon={<GradeIcon />}
              onClick={() => {
                handleCloseDetails();
                onManagePerformance(selectedStudent);
              }}
            >
              Manage Performance
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentList;