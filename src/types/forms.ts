// Form-related types and interfaces
import type { Gender, StudentStatus, ExamType, FeeType, PaymentStatus, ParentType } from './user';

// Base form state interface
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  touched: Partial<Record<keyof T, boolean>>;
}

// Student form data - aligned with backend CreateStudentRequest
export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  gender: Gender;
  enrollmentDate: string;
  grade?: string;
  section?: string;
  parentId?: string;
  facultyIds: string[];
}

// Faculty form data - aligned with backend CreateFacultyRequest
export interface FacultyFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  gender: Gender;
  department: string;
  subject: string;
  hireDate: string;
  userId?: string;
}

// Parent form data - aligned with backend CreateParentRequest
export interface ParentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  dateOfBirth: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  gender: Gender;
  occupation?: string;
  employer?: string;
  workPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  parentType: ParentType;
  isEmergencyContact: boolean;
  isAuthorizedToPickup: boolean;
}

// Performance form data
export interface PerformanceFormData {
  studentId: string;
  subject: string;
  examType: ExamType;
  examDate: string;
  score: number;
  maxScore: number;
  examTitle: string;
  comments: string;
}

// Fee form data
export interface FeeFormData {
  studentId: string;
  feeType: FeeType;
  term: string;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  lastPaymentDate: string;
  fineAmount: number;
  notes: string;
}

// Login form data
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Search form data
export interface SearchFormData {
  query: string;
  filters: {
    status?: StudentStatus;
    grade?: string;
    section?: string;
    department?: string;
    subject?: string;
    feeType?: FeeType;
    paymentStatus?: PaymentStatus;
    dateFrom?: string;
    dateTo?: string;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Assignment form data
export interface FacultyAssignmentFormData {
  studentId: string;
  facultyId: string;
  notes: string;
}

export interface ParentAssignmentFormData {
  parentId: string;
  studentId: string;
  relationship: string;
  isPrimaryContact: boolean;
  isAuthorizedToPickup: boolean;
  isEmergencyContact: boolean;
  notes: string;
}

// Bulk operation form data
export interface BulkOperationFormData {
  selectedIds: string[];
  operation: 'delete' | 'update' | 'activate' | 'deactivate';
  updateData?: Record<string, any>;
  confirmationText: string;
}

// Filter form data
export interface FilterFormData {
  search: string;
  status: string[];
  dateRange: {
    start: string;
    end: string;
  };
  categories: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  pageSize: number;
}

// Form validation error types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Form field configuration
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
  disabled?: boolean;
  hidden?: boolean;
  dependsOn?: string;
  showWhen?: (formData: any) => boolean;
}

// Form section configuration
export interface FormSection {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Complete form configuration
export interface FormConfig {
  title: string;
  description?: string;
  sections: FormSection[];
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  showReset?: boolean;
  showCancel?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

// Form submission result
export interface FormSubmissionResult<T = any> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  message?: string;
}

// Form hook return type
export interface UseFormReturn<T> {
  formState: FormState<T>;
  handleChange: (field: keyof T, value: any) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (onSubmit: (data: T) => Promise<void>) => Promise<void>;
  handleReset: () => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearFieldError: (field: keyof T) => void;
  setFormData: (data: Partial<T>) => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
}