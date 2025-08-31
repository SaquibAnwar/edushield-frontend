import React from 'react';
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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Grid } from '../../Grid';
import { LoadingSpinner } from '../../LoadingSpinner';
import { FormErrorHandler } from '../../FormErrorHandler';
import { SuccessFeedback } from '../../SuccessFeedback';
import { parentFormSchema } from '../../../../utils/validationSchemas';
import { useErrorHandler } from '../../../../utils/errorHandler';
import { useToast } from '../../../../contexts/ToastContext';
import { convertFormDatesToDateTime } from '../../../../utils/dateUtils';
import { Gender, ParentType } from '../../../../types/user';
import type { ParentFormData } from '../../../../types/forms';
import type { FormProps } from '../../../../types/components';

const ParentForm: React.FC<FormProps<ParentFormData> & { showHeader?: boolean }> = ({
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
  className,
  testId,
  showHeader = true,
}) => {
  const [submitError, setSubmitError] = React.useState<any>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isRetrying, setIsRetrying] = React.useState(false);
  
  const { handleError, isRetryable, formatForDisplay } = useErrorHandler();
  const { showSuccess: showSuccessToast, showError: showErrorToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(parentFormSchema) as any,
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      alternatePhoneNumber: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA', // Default to USA as per backend
      gender: Gender.MALE,
      occupation: '',
      employer: '',
      workPhone: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      parentType: ParentType.PRIMARY, // Default to Primary
      isEmergencyContact: false, // Default to false
      isAuthorizedToPickup: true, // Default to true
      isActive: true, // Default to true for new parents
    },
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: any) => {
    try {
      setSubmitError(null);
      setShowSuccess(false);
      
      // Debug logging
      console.log('Form submission data:', data);
      console.log('isActive in form data:', data.isActive);
      
      // Convert date strings to DateTime objects for backend
      const convertedData = convertFormDatesToDateTime(data, ['dateOfBirth']);
      console.log('Converted data:', convertedData);
      
      await onSubmit(convertedData);
      
      // Show success feedback
      setShowSuccess(true);
      const actionText = mode === 'edit' ? 'updated' : 'created';
      showSuccessToast(
        `Parent ${actionText} successfully`,
        `${data.firstName} ${data.lastName} has been ${actionText}.`
      );
      
      // Reset form if creating new parent
      if (mode === 'create') {
        reset();
      }
    } catch (error) {
      handleError(error, 'ParentForm submission');
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
        const currentValues = control._formValues;
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
    if (mode === 'edit') return 'Update Parent';
    return 'Create Parent';
  };

  const isReadOnly = mode === 'view';
  const isFormDisabled = disabled || loading || isSubmitting || isRetrying || isReadOnly;

  return (
    <Box className={className} data-testid={testId}>
      {loading && <LoadingSpinner tip="Loading form..." />}
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {showHeader && (
          <Typography variant="h6" gutterBottom>
            {mode === 'create' ? 'Create New Parent' : 
             mode === 'edit' ? 'Edit Parent' : 'Parent Details'}
          </Typography>
        )}
        
        <Divider sx={{ mb: 3 }} />

        {/* Success Feedback */}
        <SuccessFeedback
          show={showSuccess}
          title={`Parent ${mode === 'edit' ? 'Updated' : 'Created'} Successfully`}
          message={`The parent information has been ${mode === 'edit' ? 'updated' : 'saved'} successfully.`}
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
              name="alternatePhoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Alternate Phone Number"
                  fullWidth
                  error={!!errors.alternatePhoneNumber}
                  helperText={errors.alternatePhoneNumber?.message}
                  disabled={isFormDisabled}
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
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
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
                    <MenuItem value={Gender.MALE}>Male</MenuItem>
                    <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                    <MenuItem value={Gender.OTHER}>Other</MenuItem>
                  </Select>
                  {errors.gender && (
                    <FormHelperText>{errors.gender.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="parentType"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.parentType} disabled={isFormDisabled}>
                  <InputLabel>Parent Type *</InputLabel>
                  <Select {...field} label="Parent Type *">
                    <MenuItem value={ParentType.PRIMARY}>Primary</MenuItem>
                    <MenuItem value={ParentType.SECONDARY}>Secondary</MenuItem>
                    <MenuItem value={ParentType.GUARDIAN}>Guardian</MenuItem>
                  </Select>
                  {errors.parentType && (
                    <FormHelperText>{errors.parentType.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
        
        {/* Address Information Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Address Information
        </Typography>
        
        <Grid container spacing={3}>
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
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City"
                  fullWidth
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="State"
                  fullWidth
                  error={!!errors.state}
                  helperText={errors.state?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="postalCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Postal Code"
                  fullWidth
                  error={!!errors.postalCode}
                  helperText={errors.postalCode?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Country"
                  fullWidth
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
        </Grid>
        
        {/* Professional Information Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Professional Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="occupation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Occupation"
                  fullWidth
                  error={!!errors.occupation}
                  helperText={errors.occupation?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="employer"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Employer"
                  fullWidth
                  error={!!errors.employer}
                  helperText={errors.employer?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="workPhone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Work Phone"
                  fullWidth
                  error={!!errors.workPhone}
                  helperText={errors.workPhone?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
        </Grid>
        
        {/* Emergency Contact Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Emergency Contact Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="emergencyContactName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Emergency Contact Name"
                  fullWidth
                  error={!!errors.emergencyContactName}
                  helperText={errors.emergencyContactName?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="emergencyContactPhone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Emergency Contact Phone"
                  fullWidth
                  error={!!errors.emergencyContactPhone}
                  helperText={errors.emergencyContactPhone?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="emergencyContactRelationship"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Emergency Contact Relationship"
                  fullWidth
                  error={!!errors.emergencyContactRelationship}
                  helperText={errors.emergencyContactRelationship?.message}
                  disabled={isFormDisabled}
                />
              )}
            />
          </Grid>
        </Grid>
        
        {/* Permissions Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Permissions
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="isEmergencyContact"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      disabled={isFormDisabled}
                    />
                  }
                  label="Emergency Contact"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="isAuthorizedToPickup"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      disabled={isFormDisabled}
                    />
                  }
                  label="Authorized to Pickup"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      disabled={isFormDisabled}
                    />
                  }
                  label="Active Status"
                />
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

export default ParentForm;