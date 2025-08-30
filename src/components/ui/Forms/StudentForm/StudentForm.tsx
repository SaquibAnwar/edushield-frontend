import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Typography,
  Divider,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { Grid } from '../../Grid';
import { LoadingSpinner } from '../../LoadingSpinner';
import { FormErrorHandler } from '../../FormErrorHandler';
import { SuccessFeedback } from '../../SuccessFeedback';
import { studentFormSchema } from '../../../../utils/validationSchemas';
import { Gender, StudentStatus } from '../../../../types/user';
import type { StudentFormData } from '../../../../types/forms';
import type { FormProps } from '../../../../types/components';
import { convertFormDatesToDateTime } from '../../../../utils/dateUtils';
import { useErrorHandler } from '../../../../utils/errorHandler';
import { useToast } from '../../../../contexts/ToastContext';
import { getStudentStatusOptions, getGenderOptions } from '../../../../utils/enumUtils';

interface StudentFormProps extends FormProps<StudentFormData> {
  parents?: Array<{ id: string; fullName: string }>;
  faculties?: Array<{ id: string; fullName: string }>;
}

const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  disabled = false,
  mode = 'create',
  showReset = true,
  showCancel = true,
  submitText,
  cancelText = 'Cancel',
  resetText = 'Reset',
  parents = [],
  faculties = [],
  className,
  testId,
}) => {
  const [submitError, setSubmitError] = React.useState<any>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isRetrying, setIsRetrying] = React.useState(false);
  
  const { handleError, isRetryable, formatForDisplay } = useErrorHandler();
  const { showSuccess: showSuccessToast, showError: showErrorToast } = useToast();

  // Helper function to format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateValue: string | Date | undefined): string => {
    if (!dateValue) return '';
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      
      // Format as YYYY-MM-DD for HTML date input
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Error formatting date:', dateValue, error);
      return '';
    }
  };

  // Ensure proper default values for form fields
  const getDefaultValues = (): StudentFormData => {
    const defaults: StudentFormData = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      address: '',
      gender: Gender.MALE,
      enrollmentDate: new Date().toISOString().split('T')[0],
      grade: '',
      section: '',
      parentId: '',
      facultyIds: [],
      status: StudentStatus.ACTIVE,
    };

    if (initialData) {
      return {
        ...defaults,
        ...initialData,
        // Ensure these fields are never null/undefined
        grade: initialData.grade || '',
        section: initialData.section || '',
        parentId: initialData.parentId || '',
        facultyIds: Array.isArray(initialData.facultyIds) ? initialData.facultyIds : [],
        status: initialData.status !== undefined ? initialData.status : StudentStatus.ACTIVE,
        // Format dates properly for HTML date inputs
        dateOfBirth: formatDateForInput(initialData.dateOfBirth),
        enrollmentDate: formatDateForInput(initialData.enrollmentDate),
      };
    }

    return defaults;
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<StudentFormData>({
    resolver: yupResolver(studentFormSchema) as any,
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset(getDefaultValues());
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: StudentFormData) => {
    try {
      setSubmitError(null);
      setShowSuccess(false);
      
      // Convert date strings to DateTime objects for backend
      const formattedData = convertFormDatesToDateTime(data, ['dateOfBirth', 'enrollmentDate']);
      await onSubmit(formattedData);
      
      // Show success feedback
      setShowSuccess(true);
      
      // Reset form if creating new student
      if (mode === 'create') {
        reset();
      }
    } catch (error) {
      handleError(error, 'StudentForm submission');
      setSubmitError(error);
      
      // Show error toast for better visibility
      const { title, message } = formatForDisplay(error);
      showErrorToast(title, message);
    }
  };

  const handleRetry = async () => {
    if (!isRetrying) {
      setIsRetrying(true);
      try {
        // Get current form values and retry submission
        const currentValues = control._formValues as StudentFormData;
        await handleFormSubmit(currentValues);
      } catch (error) {
        // Error is already handled in handleFormSubmit
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const handleReset = () => {
    reset();
    setSubmitError(null);
    setShowSuccess(false);
  };

  const getSubmitText = () => {
    if (submitText) return submitText;
    if (mode === 'edit') return 'Update Student';
    return 'Create Student';
  };

  const isReadOnly = mode === 'view';
  const isFormDisabled = disabled || loading || isSubmitting || isRetrying || isReadOnly;

  return (
    <Box className={className} data-testid={testId}>
      {loading && <LoadingSpinner tip="Loading form..." />}
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Typography variant="h6" gutterBottom>
          {mode === 'create' ? 'Create New Student' : 
           mode === 'edit' ? 'Edit Student' : 'Student Details'}
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        {/* Success Feedback */}
        <SuccessFeedback
          show={showSuccess}
          title={`Student ${mode === 'edit' ? 'Updated' : 'Created'} Successfully`}
          message={`The student information has been ${mode === 'edit' ? 'updated' : 'saved'} successfully.`}
          onClose={() => setShowSuccess(false)}
        />

        {/* Error Handling */}
        <FormErrorHandler
          error={submitError}
          showRetry={isRetryable(submitError)}
          onRetry={handleRetry}
        />
        
        {/* Personal Information Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 2 }}>
          Personal Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isFormDisabled}
                  required
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isFormDisabled}
                  required
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isFormDisabled}
                  required
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  fullWidth
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  disabled={isFormDisabled}
                  required
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ''}
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message}
                  disabled={isFormDisabled}
                  required
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.gender} disabled={isFormDisabled}>
                  <InputLabel>Gender *</InputLabel>
                  <Select {...field} label="Gender *">
                    {getGenderOptions().map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.gender && (
                    <FormHelperText>{errors.gender.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={isFormDisabled}
                  required
                />
              )}
            />
          </Grid>
        </Grid>
        
        {/* Academic Information Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Academic Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="enrollmentDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ''}
                  label="Enrollment Date"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errors.enrollmentDate}
                  helperText={errors.enrollmentDate?.message}
                  disabled={isFormDisabled}
                  required
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ''}
                  label="Grade"
                  fullWidth
                  error={!!errors.grade}
                  helperText={errors.grade?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ''}
                  label="Section"
                  fullWidth
                  error={!!errors.section}
                  helperText={errors.section?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status} disabled={isFormDisabled}>
                  <InputLabel>Status *</InputLabel>
                  <Select 
                    {...field} 
                    value={field.value !== undefined ? field.value : StudentStatus.ACTIVE}
                    label="Status *"
                  >
                    {getStudentStatusOptions().map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.parentId} disabled={isFormDisabled}>
                  <InputLabel>Parent</InputLabel>
                  <Select 
                    {...field} 
                    value={field.value || ''}
                    label="Parent"
                  >
                    <MenuItem value="">
                      <em>Select a parent</em>
                    </MenuItem>
                    {parents.map((parent) => (
                      <MenuItem key={parent.id} value={parent.id}>
                        {parent.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.parentId && (
                    <FormHelperText>{errors.parentId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="facultyIds"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.facultyIds} disabled={isFormDisabled}>
                  <InputLabel>Assigned Faculty</InputLabel>
                  <Select
                    {...field}
                    value={Array.isArray(field.value) ? field.value : []}
                    multiple
                    label="Assigned Faculty"
                    input={<OutlinedInput label="Assigned Faculty" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(Array.isArray(selected) ? selected : []).map((value) => {
                          const faculty = faculties.find(f => f.id === value);
                          return (
                            <Chip key={value} label={faculty?.fullName || value} size="small" />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {faculties.map((faculty) => (
                      <MenuItem key={faculty.id} value={faculty.id}>
                        {faculty.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.facultyIds && (
                    <FormHelperText>{errors.facultyIds.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
        
        {/* Form Actions */}
        {!isReadOnly && (
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {showReset && (
              <Button
                type="button"
                variant="outlined"
                onClick={handleReset}
                disabled={isFormDisabled || !isDirty}
              >
                {resetText}
              </Button>
            )}
            
            {showCancel && onCancel && (
              <Button
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {cancelText}
              </Button>
            )}
            
            <Button
              type="submit"
              variant="contained"
              disabled={isFormDisabled}
            >
              {isSubmitting ? 'Submitting...' : 
               isRetrying ? 'Retrying...' : 
               getSubmitText()}
            </Button>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default StudentForm;