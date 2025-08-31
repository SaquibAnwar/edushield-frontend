import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LoadingSpinner } from '../../LoadingSpinner';
import type { Student, Parent } from '../../../../types/user';

// Form data interface
interface ParentAssignmentFormData {
  parentId: string;
  studentId: string;
  relationship: string;
  isPrimaryContact: boolean;
  isAuthorizedToPickup: boolean;
  isEmergencyContact: boolean;
  isActive: boolean;
  notes?: string;
}

interface ParentAssignmentFormProps {
  students: Student[];
  parents: Parent[];
  onSubmit: (data: ParentAssignmentFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  preSelectedStudentId?: string;
}

export const ParentAssignmentForm: React.FC<ParentAssignmentFormProps> = ({
  students,
  parents,
  onSubmit,
  onCancel,
  isSubmitting = false,
  preSelectedStudentId,
}) => {
  const [formData, setFormData] = useState({
    parentId: '',
    studentId: preSelectedStudentId || '',
    relationship: '',
    isPrimaryContact: false,
    isAuthorizedToPickup: false,
    isEmergencyContact: false,
    isActive: true,
    notes: '',
  });
  
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitError(null);
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to assign parent');
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedStudent = students.find(s => s.id === formData.studentId);
  const selectedParent = parents.find(p => p.id === formData.parentId);

  const relationshipSuggestions = [
    'Father',
    'Mother',
    'Guardian',
    'Grandfather',
    'Grandmother',
    'Uncle',
    'Aunt',
    'Stepfather',
    'Stepmother',
    'Foster Parent',
    'Legal Guardian',
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Assign Parent to Student
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

        {/* Show current parent if student is selected */}
        {selectedStudent && selectedStudent.parentId && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Currently Assigned Parent:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(() => {
                const parent = parents.find(p => p.id === selectedStudent.parentId);
                const parentName = parent ? parent.fullName : `Parent ID: ${selectedStudent.parentId}`;
                
                return (
                  <Chip
                    label={parentName}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                );
              })()}
            </Box>
          </Box>
        )}

        {/* Parent Selection */}
        <Autocomplete
          options={parents.filter(p => p.isActive)}
          getOptionLabel={(option) => option.fullName}
          value={parents.find(p => p.id === formData.parentId) || null}
          onChange={(_, value) => handleChange('parentId', value?.id || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Parent *"
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              <Box>
                <Typography variant="body2">
                  {option.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.email} | {option.phoneNumber}
                </Typography>
              </Box>
            </li>
          )}
        />

        {/* Relationship */}
        <Autocomplete
          freeSolo
          options={relationshipSuggestions}
          value={formData.relationship}
          onChange={(_, value) => handleChange('relationship', value || '')}
          onInputChange={(_, value) => handleChange('relationship', value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Relationship *"
              placeholder="e.g., Father, Mother, Guardian"
            />
          )}
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

        {/* Permission Checkboxes */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Permissions and Contacts:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isPrimaryContact}
                  onChange={(e) => handleChange('isPrimaryContact', e.target.checked)}
                />
              }
              label="Primary Contact"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAuthorizedToPickup}
                  onChange={(e) => handleChange('isAuthorizedToPickup', e.target.checked)}
                />
              }
              label="Authorized to Pick Up Student"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isEmergencyContact}
                  onChange={(e) => handleChange('isEmergencyContact', e.target.checked)}
                />
              }
              label="Emergency Contact"
            />
          </Box>
        </Box>

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
        {selectedStudent && selectedParent && (
          <Alert severity="info">
            <Typography variant="subtitle2" gutterBottom>
              Assignment Summary:
            </Typography>
            <Typography variant="body2">
              <strong>Student:</strong> {selectedStudent.fullName} (Roll: {selectedStudent.rollNumber})
            </Typography>
            <Typography variant="body2">
              <strong>Parent:</strong> {selectedParent.fullName}
            </Typography>
            <Typography variant="body2">
              <strong>Contact:</strong> {selectedParent.email} | {selectedParent.phoneNumber}
            </Typography>
            <Typography variant="body2">
              <strong>Relationship:</strong> {formData.relationship}
            </Typography>
            <Typography variant="body2">
              <strong>Permissions:</strong> 
              {formData.isPrimaryContact && ' Primary Contact'}
              {formData.isAuthorizedToPickup && ' | Pickup Authorized'}
              {formData.isEmergencyContact && ' | Emergency Contact'}
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
          {isSubmitting ? 'Assigning...' : 'Assign Parent'}
        </Button>
      </Box>
    </Box>
  );
};