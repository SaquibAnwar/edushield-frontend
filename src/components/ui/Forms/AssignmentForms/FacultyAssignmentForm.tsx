import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LoadingSpinner } from '../../LoadingSpinner';
import type { Student, Faculty } from '../../../../types/user';

// Form data interface
interface FacultyAssignmentFormData {
  studentId: string;
  facultyId: string;
  subject?: string;
  notes?: string;
  isActive: boolean;
}

interface FacultyAssignmentFormProps {
  students: Student[];
  faculties: Faculty[];
  onSubmit: (data: FacultyAssignmentFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  preSelectedStudentId?: string;
}

export const FacultyAssignmentForm: React.FC<FacultyAssignmentFormProps> = ({
  students,
  faculties,
  onSubmit,
  onCancel,
  isSubmitting = false,
  preSelectedStudentId,
}) => {
  const [formData, setFormData] = useState({
    studentId: preSelectedStudentId || '',
    facultyId: '',
    subject: '',
    notes: '',
    isActive: true,
  });
  
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitError(null);
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to assign faculty');
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedStudent = students.find(s => s.id === formData.studentId);
  const selectedFaculty = faculties.find(f => f.id === formData.facultyId);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Assign Faculty to Student
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Student Selection */}
        <Autocomplete
          options={students}
          getOptionLabel={(option) => option.fullName}
          value={students.find(s => s.id === formData.studentId) || null}
          onChange={(_, value) => handleChange('studentId', value?.id || '')}
          disabled={!!preSelectedStudentId}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Student *"
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              <Box>
                <Typography variant="body2">
                  {option.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Roll: {option.rollNumber} | Grade: {option.grade || 'N/A'}
                </Typography>
              </Box>
            </li>
          )}
        />

        {/* Show current faculty assignments if student is selected */}
        {selectedStudent && selectedStudent.assignedFaculties?.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Currently Assigned Faculty:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedStudent.assignedFaculties.map((assignment) => {
                const faculty = assignment.faculty || faculties.find(f => f.id === assignment.facultyId);
                const facultyName = faculty 
                  ? `${faculty.fullName} - ${faculty.subject}`
                  : 'Unknown Faculty';
                
                return (
                  <Chip
                    key={assignment.id}
                    label={facultyName}
                    variant="outlined"
                    size="small"
                    color={assignment.isActive ? 'primary' : 'default'}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {/* Faculty Selection */}
        <Autocomplete
          options={faculties.filter(f => f.isActive)}
          getOptionLabel={(option) => `${option.fullName} - ${option.subject}`}
          value={faculties.find(f => f.id === formData.facultyId) || null}
          onChange={(_, value) => handleChange('facultyId', value?.id || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Faculty *"
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              <Box>
                <Typography variant="body2">
                  {option.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.department} | {option.subject} | {option.employeeId}
                </Typography>
              </Box>
            </li>
          )}
          groupBy={(option) => option.department || 'Other'}
        />

        {/* Subject Override */}
        <TextField
          fullWidth
          label="Subject (Optional)"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          helperText={`Default: ${selectedFaculty?.subject || 'N/A'}`}
          placeholder="Override faculty's default subject"
        />

        {/* Assignment Status */}
        <FormControl fullWidth>
          <InputLabel>Assignment Status</InputLabel>
          <Select
            value={formData.isActive}
            label="Assignment Status"
            onChange={(e) => handleChange('isActive', e.target.value === 'true')}
          >
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Notes */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes about this assignment..."
        />

        {/* Assignment Summary */}
        {selectedStudent && selectedFaculty && (
          <Alert severity="info">
            <Typography variant="subtitle2" gutterBottom>
              Assignment Summary:
            </Typography>
            <Typography variant="body2">
              <strong>Student:</strong> {selectedStudent.fullName} (Roll: {selectedStudent.rollNumber})
            </Typography>
            <Typography variant="body2">
              <strong>Faculty:</strong> {selectedFaculty.fullName} ({selectedFaculty.employeeId})
            </Typography>
            <Typography variant="body2">
              <strong>Department:</strong> {selectedFaculty.department}
            </Typography>
            <Typography variant="body2">
              <strong>Subject:</strong> {formData.subject || selectedFaculty.subject}
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <LoadingSpinner size="small" /> : undefined}
        >
          {isSubmitting ? 'Assigning...' : 'Assign Faculty'}
        </Button>
      </Box>
    </Box>
  );
};