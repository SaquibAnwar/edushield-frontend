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
} from '@mui/material';
import { Grid } from '../../Grid';
import { LoadingSpinner } from '../../LoadingSpinner';
import { FormErrorHandler } from '../../FormErrorHandler';
import { SuccessFeedback } from '../../SuccessFeedback';
import { facultyFormSchema } from '../../../../utils/validationSchemas';
import { convertFormDatesToDateTime } from '../../../../utils/dateUtils';
import { useErrorHandler } from '../../../../utils/errorHandler';
import { useToast } from '../../../../contexts/ToastContext';
import { Gender } from '../../../../types/user';
import type { FacultyFormData } from '../../../../types/forms';
import type { FormProps } from '../../../../types/components';

const FacultyForm: React.FC<FormProps<FacultyFormData>> = ({
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
    } = useForm<FacultyFormData>({
        resolver: yupResolver(facultyFormSchema) as any,
        defaultValues: initialData || {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            address: '',
            gender: Gender.MALE,
            department: '',
            subject: '',
            hireDate: new Date().toISOString().split('T')[0],
            userId: '',
            isActive: true,
        },
        mode: 'onChange',
    });

    const handleFormSubmit = async (data: FacultyFormData) => {
        try {
            setSubmitError(null);
            setShowSuccess(false);
            
            // Convert date strings to DateTime objects for backend
            const formattedData = convertFormDatesToDateTime(data, ['dateOfBirth', 'hireDate']);
            await onSubmit(formattedData);
            
            // Show success feedback (local to form only)
            setShowSuccess(true);
            
            // Reset form if creating new faculty
            if (mode === 'create') {
                reset();
            }
        } catch (error) {
            handleError(error, 'FacultyForm submission');
            setSubmitError(error);
            
            // Let the parent component handle toast notifications
            // Re-throw the error so parent can handle it
            throw error;
        }
    };

    const handleRetry = async () => {
        if (!isRetrying) {
            setIsRetrying(true);
            try {
                // Get current form values and retry submission
                const currentValues = control._formValues as FacultyFormData;
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
        if (mode === 'edit') return 'Update Faculty';
        return 'Create Faculty';
    };

    const isReadOnly = mode === 'view';
    const isFormDisabled = disabled || loading || isSubmitting || isRetrying || isReadOnly;

    return (
        <Box className={className} data-testid={testId}>
            {loading && <LoadingSpinner tip="Loading form..." />}

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Typography variant="h6" gutterBottom>
                    {mode === 'create' ? 'Create New Faculty' :
                        mode === 'edit' ? 'Edit Faculty' : 'Faculty Details'}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {/* Success Feedback */}
                <SuccessFeedback
                    show={showSuccess}
                    title={`Faculty ${mode === 'edit' ? 'Updated' : 'Created'} Successfully`}
                    message={`The faculty information has been ${mode === 'edit' ? 'updated' : 'saved'} successfully.`}
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

                {/* Professional Information Section */}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 4, mb: 2 }}>
                    Professional Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="hireDate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Hire Date"
                                    type="date"
                                    fullWidth
                                    slotProps={{
                                        inputLabel: { shrink: true }
                                    }}
                                    error={!!errors.hireDate}
                                    helperText={errors.hireDate?.message}
                                    disabled={isFormDisabled}
                                    required
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="userId"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="User ID (Optional)"
                                    fullWidth
                                    error={!!errors.userId}
                                    helperText={errors.userId?.message || "Link to existing user account"}
                                    disabled={isFormDisabled}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="department"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Department"
                                    fullWidth
                                    error={!!errors.department}
                                    helperText={errors.department?.message}
                                    disabled={isFormDisabled}
                                    required
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="subject"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Subject"
                                    fullWidth
                                    error={!!errors.subject}
                                    helperText={errors.subject?.message}
                                    disabled={isFormDisabled}
                                    required
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.isActive} disabled={isFormDisabled}>
                                    <InputLabel>Status</InputLabel>
                                    <Select 
                                        {...field} 
                                        label="Status"
                                        value={field.value !== undefined ? String(field.value) : 'true'}
                                        onChange={(e) => field.onChange(e.target.value === 'true')}
                                    >
                                        <MenuItem value="true">Active</MenuItem>
                                        <MenuItem value="false">Inactive</MenuItem>
                                    </Select>
                                    {errors.isActive && (
                                        <FormHelperText>{errors.isActive.message}</FormHelperText>
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

export default FacultyForm;