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
  InputAdornment,
} from '@mui/material';
import { LoadingSpinner } from '../../LoadingSpinner';
import { FeeType, PaymentStatus } from '../../../../types/user';
import type { Student } from '../../../../types/user';

// Form data interface
interface FeeFormData {
  studentId: string;
  feeType: FeeType;
  term: string;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  lastPaymentDate?: string;
  fineAmount?: number;
  notes?: string;
}

// Internal form state interface with string values for text inputs
interface FeeFormState {
  studentId: string;
  feeType: FeeType;
  term: string;
  totalAmount: string;
  amountPaid: string;
  paymentStatus: PaymentStatus;
  dueDate: string;
  lastPaymentDate: string;
  fineAmount: string;
  notes: string;
}

interface FeeFormProps {
  students: Student[];
  initialData?: any | null;
  onSubmit: (data: FeeFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const FeeForm: React.FC<FeeFormProps> = ({
  students,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<FeeFormState>({
    studentId: initialData?.studentId || '',
    feeType: initialData?.feeType || FeeType.Tuition,
    term: initialData?.term || '',
    totalAmount: initialData?.totalAmount?.toString() || '',
    amountPaid: initialData?.amountPaid?.toString() || '0',
    paymentStatus: initialData?.paymentStatus || PaymentStatus.Pending,
    dueDate: initialData?.dueDate ? initialData.dueDate.split('T')[0] : '',
    lastPaymentDate: initialData?.lastPaymentDate ? initialData.lastPaymentDate.split('T')[0] : '',
    fineAmount: initialData?.fineAmount?.toString() || '0',
    notes: initialData?.notes || '',
  });
  
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId || '',
        feeType: initialData.feeType || FeeType.Tuition,
        term: initialData.term || '',
        totalAmount: initialData.totalAmount?.toString() || '',
        amountPaid: initialData.amountPaid?.toString() || '0',
        paymentStatus: initialData.paymentStatus || PaymentStatus.Pending,
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
        lastPaymentDate: initialData.lastPaymentDate ? initialData.lastPaymentDate.split('T')[0] : '',
        fineAmount: initialData.fineAmount?.toString() || '0',
        notes: initialData.notes || '',
      });
    } else {
      // Reset form for new records
      setFormData({
        studentId: '',
        feeType: FeeType.Tuition,
        term: '',
        totalAmount: '',
        amountPaid: '0',
        paymentStatus: PaymentStatus.Pending,
        dueDate: '',
        lastPaymentDate: '',
        fineAmount: '0',
        notes: '',
      });
    }
  }, [initialData]);

  // Auto-update payment status based on amounts
  useEffect(() => {
    const totalAmount = parseFloat(formData.totalAmount) || 0;
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    const fineAmount = parseFloat(formData.fineAmount) || 0;
    
    if (totalAmount > 0) {
      const totalWithFine = totalAmount + fineAmount;
      if (amountPaid === 0) {
        setFormData(prev => ({ ...prev, paymentStatus: PaymentStatus.Pending }));
      } else if (amountPaid >= totalWithFine) {
        setFormData(prev => ({ ...prev, paymentStatus: PaymentStatus.Paid }));
      } else {
        setFormData(prev => ({ ...prev, paymentStatus: PaymentStatus.Partial }));
      }
    }
  }, [formData.totalAmount, formData.amountPaid, formData.fineAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitError(null);
      // Convert string values to numbers for submission
      const submitData: FeeFormData = {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount) || 0,
        amountPaid: parseFloat(formData.amountPaid) || 0,
        fineAmount: parseFloat(formData.fineAmount) || 0,
        lastPaymentDate: formData.lastPaymentDate || undefined,
      };
      await onSubmit(submitData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save fee record');
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const feeTypeOptions = [
    { value: FeeType.Tuition, label: 'Tuition' },
    { value: FeeType.Exam, label: 'Exam' },
    { value: FeeType.Transport, label: 'Transport' },
    { value: FeeType.Library, label: 'Library' },
    { value: FeeType.Misc, label: 'Miscellaneous' },
  ];

  const paymentStatusOptions = [
    { value: PaymentStatus.Pending, label: 'Pending' },
    { value: PaymentStatus.Partial, label: 'Partial' },
    { value: PaymentStatus.Paid, label: 'Paid' },
    { value: PaymentStatus.Overdue, label: 'Overdue' },
  ];

  const totalAmount = parseFloat(formData.totalAmount) || 0;
  const amountPaid = parseFloat(formData.amountPaid) || 0;
  const fineAmount = parseFloat(formData.fineAmount) || 0;
  const amountDue = totalAmount - amountPaid + fineAmount;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Fee Record' : 'Add Fee Record'}
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
          disabled={!!initialData}
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

        {/* Fee Type and Term */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Fee Type *</InputLabel>
            <Select
              value={formData.feeType}
              label="Fee Type *"
              onChange={(e) => handleChange('feeType', e.target.value)}
            >
              {feeTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Term *"
            value={formData.term}
            onChange={(e) => handleChange('term', e.target.value)}
            placeholder="e.g., Fall 2024, Spring 2025"
          />
        </Box>

        {/* Amount Fields */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Total Amount *"
            value={formData.totalAmount}
            onChange={(e) => handleChange('totalAmount', e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }
            }}
            placeholder="Enter total amount (e.g., 5000)"
          />

          <TextField
            fullWidth
            label="Amount Paid *"
            value={formData.amountPaid}
            onChange={(e) => handleChange('amountPaid', e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }
            }}
            placeholder="Enter amount paid (e.g., 2500)"
          />

          <TextField
            fullWidth
            label="Amount Due"
            value={`₹${amountDue.toFixed(2)}`}
            slotProps={{ input: { readOnly: true } }}
            variant="filled"
            color={amountDue > 0 ? 'warning' : 'success'}
          />
        </Box>

        {/* Payment Status and Fine */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Payment Status *</InputLabel>
            <Select
              value={formData.paymentStatus}
              label="Payment Status *"
              onChange={(e) => handleChange('paymentStatus', e.target.value)}
            >
              {paymentStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Fine Amount"
            value={formData.fineAmount}
            onChange={(e) => handleChange('fineAmount', e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }
            }}
            placeholder="Enter fine amount (e.g., 100)"
          />
        </Box>

        {/* Date Fields */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            type="date"
            label="Due Date *"
            slotProps={{ inputLabel: { shrink: true } }}
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />

          <TextField
            fullWidth
            type="date"
            label="Last Payment Date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={formData.lastPaymentDate}
            onChange={(e) => handleChange('lastPaymentDate', e.target.value)}
            disabled={parseFloat(formData.amountPaid) === 0}
          />
        </Box>

        {/* Notes */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes about the fee..."
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