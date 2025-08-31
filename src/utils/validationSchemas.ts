import * as yup from 'yup';

// Common validation patterns
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Student form validation schema - matches CreateStudentRequest
export const studentFormSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .max(100, 'Email must not exceed 100 characters')
    .matches(emailRegex, 'Please enter a valid email address'),
  
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .max(20, 'Phone number must not exceed 20 characters')
    .matches(phoneRegex, 'Please enter a valid phone number'),
  
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('age', 'Student must be at least 5 years old', function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 5;
    }),
  
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters'),
  
  gender: yup
    .number()
    .required('Gender is required')
    .oneOf([0, 1, 2], 'Please select a valid gender'),
  
  enrollmentDate: yup
    .string()
    .required('Enrollment date is required'),
  
  grade: yup
    .string()
    .optional()
    .max(20, 'Grade must not exceed 20 characters'),
  
  section: yup
    .string()
    .optional()
    .max(10, 'Section must not exceed 10 characters'),
  
  parentId: yup
    .string()
    .optional(),
  
  facultyIds: yup
    .array()
    .of(yup.string().required('Faculty ID is required'))
    .default([])
    .optional(),
  
  status: yup
    .number()
    .optional()
    .oneOf([0, 1, 2, 3, 4, 5], 'Please select a valid status'),
});

// Faculty form validation schema - matches CreateFacultyRequest
export const facultyFormSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .max(100, 'Email must not exceed 100 characters')
    .matches(emailRegex, 'Please enter a valid email address'),
  
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .max(20, 'Phone number must not exceed 20 characters')
    .matches(phoneRegex, 'Please enter a valid phone number'),
  
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('age', 'Faculty must be at least 18 years old', function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }),
  
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters'),
  
  gender: yup
    .number()
    .required('Gender is required')
    .oneOf([0, 1, 2], 'Please select a valid gender'),
  
  department: yup
    .string()
    .required('Department is required')
    .min(2, 'Department must be at least 2 characters')
    .max(100, 'Department must not exceed 100 characters'),
  
  subject: yup
    .string()
    .required('Subject is required')
    .min(2, 'Subject must be at least 2 characters')
    .max(100, 'Subject must not exceed 100 characters'),
  
  hireDate: yup
    .string()
    .required('Hire date is required'),
  
  userId: yup
    .string()
    .optional(),
  
  isActive: yup
    .boolean()
    .optional()
    .default(true),
});

// Parent form validation schema - matches CreateParentRequest
export const parentFormSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .max(100, 'Email must not exceed 100 characters')
    .matches(emailRegex, 'Please enter a valid email address'),
  
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .max(20, 'Phone number must not exceed 20 characters')
    .matches(phoneRegex, 'Please enter a valid phone number'),
  
  alternatePhoneNumber: yup
    .string()
    .optional()
    .max(20, 'Alternate phone number must not exceed 20 characters')
    .test('phone', 'Please enter a valid alternate phone number', function(value) {
      if (!value) return true; // Optional field
      return phoneRegex.test(value);
    }),
  
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('age', 'Parent must be at least 18 years old', function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }),
  
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters'),
  
  city: yup
    .string()
    .optional()
    .max(50, 'City must not exceed 50 characters'),
  
  state: yup
    .string()
    .optional()
    .max(50, 'State must not exceed 50 characters'),
  
  postalCode: yup
    .string()
    .optional()
    .max(10, 'Postal code must not exceed 10 characters'),
  
  country: yup
    .string()
    .optional()
    .max(50, 'Country must not exceed 50 characters'),
  
  gender: yup
    .number()
    .required('Gender is required')
    .oneOf([0, 1, 2], 'Please select a valid gender'),
  
  occupation: yup
    .string()
    .optional()
    .max(100, 'Occupation must not exceed 100 characters'),
  
  employer: yup
    .string()
    .optional()
    .max(100, 'Employer must not exceed 100 characters'),
  
  workPhone: yup
    .string()
    .optional()
    .max(20, 'Work phone must not exceed 20 characters')
    .test('phone', 'Please enter a valid work phone number', function(value) {
      if (!value) return true; // Optional field
      return phoneRegex.test(value);
    }),
  
  emergencyContactName: yup
    .string()
    .optional()
    .max(100, 'Emergency contact name must not exceed 100 characters'),
  
  emergencyContactPhone: yup
    .string()
    .optional()
    .max(20, 'Emergency contact phone must not exceed 20 characters')
    .test('phone', 'Please enter a valid emergency contact phone number', function(value) {
      if (!value) return true; // Optional field
      return phoneRegex.test(value);
    }),
  
  emergencyContactRelationship: yup
    .string()
    .optional()
    .max(50, 'Emergency contact relationship must not exceed 50 characters'),
  
  parentType: yup
    .number()
    .required('Parent type is required')
    .oneOf([0, 1, 2], 'Please select a valid parent type'),
  
  isEmergencyContact: yup
    .boolean()
    .required('Emergency contact status is required'),
  
  isAuthorizedToPickup: yup
    .boolean()
    .required('Pickup authorization status is required'),
});

// Performance form validation schema
export const performanceFormSchema = yup.object({
  studentId: yup
    .string()
    .required('Student selection is required'),
  
  subject: yup
    .string()
    .required('Subject is required')
    .min(2, 'Subject must be at least 2 characters')
    .max(50, 'Subject must not exceed 50 characters'),
  
  examType: yup
    .number()
    .required('Exam type is required')
    .oneOf([0, 1, 2, 3, 4, 5, 6, 7], 'Please select a valid exam type'),
  
  examDate: yup
    .string()
    .required('Exam date is required'),
  
  score: yup
    .number()
    .required('Score is required')
    .min(0, 'Score cannot be negative')
    .test('max-score', 'Score cannot exceed maximum score', function(value) {
      const { maxScore } = this.parent;
      if (maxScore && value && value > maxScore) {
        return false;
      }
      return true;
    }),
  
  maxScore: yup
    .number()
    .required('Maximum score is required')
    .min(1, 'Maximum score must be at least 1')
    .max(1000, 'Maximum score cannot exceed 1000'),
  
  examTitle: yup
    .string()
    .optional()
    .max(100, 'Exam title must not exceed 100 characters'),
  
  comments: yup
    .string()
    .optional()
    .max(500, 'Comments must not exceed 500 characters'),
});

// Fee form validation schema
export const feeFormSchema = yup.object({
  studentId: yup
    .string()
    .required('Student selection is required'),
  
  feeType: yup
    .number()
    .required('Fee type is required')
    .oneOf([0, 1, 2, 3, 4], 'Please select a valid fee type'),
  
  term: yup
    .string()
    .required('Term is required')
    .min(2, 'Term must be at least 2 characters')
    .max(50, 'Term must not exceed 50 characters'),
  
  totalAmount: yup
    .number()
    .required('Total amount is required')
    .min(0, 'Total amount cannot be negative')
    .max(999999.99, 'Total amount cannot exceed 999,999.99'),
  
  amountPaid: yup
    .number()
    .required('Amount paid is required')
    .min(0, 'Amount paid cannot be negative')
    .test('max-total', 'Amount paid cannot exceed total amount', function(value) {
      const { totalAmount } = this.parent;
      if (totalAmount && value && value > totalAmount) {
        return false;
      }
      return true;
    }),
  
  paymentStatus: yup
    .number()
    .required('Payment status is required')
    .oneOf([0, 1, 2, 3], 'Please select a valid payment status'),
  
  dueDate: yup
    .string()
    .required('Due date is required'),
  
  lastPaymentDate: yup
    .string()
    .optional(),
  
  fineAmount: yup
    .number()
    .min(0, 'Fine amount cannot be negative')
    .max(99999.99, 'Fine amount cannot exceed 99,999.99')
    .default(0),
  
  notes: yup
    .string()
    .optional()
    .max(500, 'Notes must not exceed 500 characters'),
});

// Search form validation schema
export const searchFormSchema = yup.object({
  query: yup
    .string()
    .max(100, 'Search query must not exceed 100 characters'),
  
  filters: yup.object({
    status: yup
      .number()
      .optional()
      .oneOf([0, 1, 2, 3, 4, 5], 'Please select a valid status'),
    
    grade: yup
      .string()
      .optional()
      .max(20, 'Grade must not exceed 20 characters'),
    
    section: yup
      .string()
      .optional()
      .max(10, 'Section must not exceed 10 characters'),
    
    department: yup
      .string()
      .optional()
      .max(50, 'Department must not exceed 50 characters'),
    
    subject: yup
      .string()
      .optional()
      .max(50, 'Subject must not exceed 50 characters'),
    
    feeType: yup
      .number()
      .optional()
      .oneOf([0, 1, 2, 3, 4, undefined], 'Please select a valid fee type'),
    
    paymentStatus: yup
      .number()
      .optional()
      .oneOf([0, 1, 2, 3, undefined], 'Please select a valid payment status'),
    
    dateFrom: yup
      .string()
      .optional(),
    
    dateTo: yup
      .string()
      .optional()
      .test('date-range', 'End date must be after start date', function(value) {
        const { dateFrom } = this.parent;
        if (dateFrom && value && new Date(value) < new Date(dateFrom)) {
          return false;
        }
        return true;
      }),
  }),
  
  sortBy: yup
    .string()
    .required('Sort field is required'),
  
  sortOrder: yup
    .string()
    .required('Sort order is required')
    .oneOf(['asc', 'desc'], 'Sort order must be ascending or descending'),
});

export default {
  studentFormSchema,
  facultyFormSchema,
  parentFormSchema,
  performanceFormSchema,
  feeFormSchema,
  searchFormSchema,
};