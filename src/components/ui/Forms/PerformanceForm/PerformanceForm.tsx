import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Autocomplete,
} from '@mui/material';
import { LoadingSpinner } from '../../LoadingSpinner';
import { ExamType } from '../../../../types/user';
import type { Student } from '../../../../types/user';

// Form data interface - matches backend CreateStudentPerformanceRequest
interface PerformanceFormData {
  studentId: string;
  subject: string;
  examType: ExamType;
  examDate: string;
  score: number;
  maxScore: number;
  examTitle?: string;
  comments?: string;
}

// Internal form state interface with string values for text inputs
interface PerformanceFormState {
  studentId: string;
  subject: string;
  examType: ExamType;
  examDate: string;
  score: string;
  maxScore: string;
  examTitle: string;
  comments: string;
}

interface PerformanceFormProps {
  students: Student[];
  initialData?: any | null;
  onSubmit: (data: PerformanceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const PerformanceForm: React.FC<PerformanceFormProps> = ({
  students,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<PerformanceFormState>({
    studentId: initialData?.studentId || '',
    subject: initialData?.subject || '',
    examType: initialData?.examType || ExamType.UnitTest,
    examDate: initialData?.examDate ? initialData.examDate.split('T')[0] : '',
    score: initialData?.score?.toString() || '',
    maxScore: initialData?.maxScore?.toString() || '100',
    examTitle: initialData?.examTitle || '',
    comments: initialData?.comments || '',
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId || '',
        subject: initialData.subject || '',
        examType: initialData.examType || ExamType.UnitTest,
        examDate: initialData.examDate ? initialData.examDate.split('T')[0] : '',
        score: initialData.score?.toString() || '',
        maxScore: initialData.maxScore?.toString() || '100',
        examTitle: initialData.examTitle || '',
        comments: initialData.comments || '',
      });
    } else {
      // Reset form for new records
      setFormData({
        studentId: '',
        subject: '',
        examType: ExamType.UnitTest,
        examDate: '',
        score: '',
        maxScore: '100',
        examTitle: '',
        comments: '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitError(null);
      // Convert string values to numbers for submission
      const submitData = {
        ...formData,
        score: parseFloat(formData.score) || 0,
        maxScore: parseFloat(formData.maxScore) || 100,
      };
      await onSubmit(submitData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save performance record');
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const examTypeOptions = [
    { value: ExamType.UnitTest, label: 'Unit Test' },
    { value: ExamType.MidTerm, label: 'Mid-Term' },
    { value: ExamType.Final, label: 'Final' },
    { value: ExamType.Assignment, label: 'Assignment' },
    { value: ExamType.Laboratory, label: 'Laboratory' },
    { value: ExamType.Presentation, label: 'Presentation' },
    { value: ExamType.ContinuousAssessment, label: 'Continuous Assessment' },
    { value: ExamType.Other, label: 'Other' },
  ];

  const score = parseFloat(formData.score) || 0;
  const maxScore = parseFloat(formData.maxScore) || 100;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Performance Record' : 'Add Performance Record'}
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
          renderInput={(params) => (
            <TextField
              {...params}
              label="Student *"
              disabled={!!initialData}
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

        {/* Subject and Exam Type */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Subject *"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="e.g., Mathematics, Science, English"
          />

          <FormControl fullWidth>
            <InputLabel>Exam Type *</InputLabel>
            <Select
              value={formData.examType}
              label="Exam Type *"
              onChange={(e) => handleChange('examType', e.target.value)}
            >
              {examTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Exam Date and Title */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            type="date"
            label="Exam Date *"
            slotProps={{ inputLabel: { shrink: true } }}
            value={formData.examDate}
            onChange={(e) => handleChange('examDate', e.target.value)}
          />

          <TextField
            fullWidth
            label="Exam Title"
            value={formData.examTitle}
            onChange={(e) => handleChange('examTitle', e.target.value)}
            placeholder="e.g., Chapter 5 Test, Mid-term Exam"
          />
        </Box>

        {/* Score and Max Score */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Score *"
            value={formData.score}
            onChange={(e) => handleChange('score', e.target.value)}
            placeholder="Enter score (e.g., 85, 92.5)"
          />

          <TextField
            fullWidth
            label="Max Score *"
            value={formData.maxScore}
            onChange={(e) => handleChange('maxScore', e.target.value)}
            placeholder="Enter max score (e.g., 100)"
          />

          <TextField
            fullWidth
            label="Percentage"
            value={`${percentage}%`}
            slotProps={{ input: { readOnly: true } }}
            variant="filled"
          />
        </Box>

        {/* Comments */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Comments"
          value={formData.comments}
          onChange={(e) => handleChange('comments', e.target.value)}
          placeholder="Additional notes about the performance..."
        />
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
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
};