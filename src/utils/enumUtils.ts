import { Gender, StudentStatus, ExamType, FeeType, PaymentStatus, ParentType } from '../types/user';

// Gender display utilities
export const getGenderDisplay = (gender: Gender): string => {
  switch (gender) {
    case Gender.MALE:
      return 'Male';
    case Gender.FEMALE:
      return 'Female';
    case Gender.OTHER:
      return 'Other';
    default:
      return 'Unknown';
  }
};

// Student Status display utilities
export const getStudentStatusDisplay = (status: StudentStatus): string => {
  switch (status) {
    case StudentStatus.ACTIVE:
      return 'Active';
    case StudentStatus.INACTIVE:
      return 'Inactive';
    case StudentStatus.SUSPENDED:
      return 'Suspended';
    case StudentStatus.GRADUATED:
      return 'Graduated';
    case StudentStatus.TRANSFERRED:
      return 'Transferred';
    case StudentStatus.WITHDRAWN:
      return 'Withdrawn';
    default:
      return 'Unknown';
  }
};

export const getStudentStatusColor = (status: StudentStatus): 'success' | 'default' | 'error' | 'info' | 'warning' => {
  switch (status) {
    case StudentStatus.ACTIVE:
      return 'success';
    case StudentStatus.INACTIVE:
      return 'default';
    case StudentStatus.SUSPENDED:
      return 'error';
    case StudentStatus.GRADUATED:
      return 'info';
    case StudentStatus.TRANSFERRED:
      return 'warning';
    case StudentStatus.WITHDRAWN:
      return 'error';
    default:
      return 'default';
  }
};

// Parent Type display utilities
export const getParentTypeDisplay = (parentType: ParentType): string => {
  switch (parentType) {
    case ParentType.PRIMARY:
      return 'Primary';
    case ParentType.SECONDARY:
      return 'Secondary';
    case ParentType.GUARDIAN:
      return 'Guardian';
    default:
      return 'Unknown';
  }
};

// Exam Type display utilities
export const getExamTypeDisplay = (examType: ExamType): string => {
  return examType; // Already string values
};

// Fee Type display utilities
export const getFeeTypeDisplay = (feeType: FeeType): string => {
  return feeType; // Already string values
};

// Payment Status display utilities
export const getPaymentStatusDisplay = (paymentStatus: PaymentStatus): string => {
  return paymentStatus; // Already string values
};

export const getPaymentStatusColor = (paymentStatus: PaymentStatus): 'success' | 'default' | 'error' | 'warning' => {
  switch (paymentStatus) {
    case PaymentStatus.PAID:
      return 'success';
    case PaymentStatus.PENDING:
      return 'warning';
    case PaymentStatus.OVERDUE:
      return 'error';
    case PaymentStatus.PARTIAL:
      return 'warning';
    default:
      return 'default';
  }
};

// Get all enum options for dropdowns
export const getStudentStatusOptions = () => [
  { value: StudentStatus.ACTIVE, label: getStudentStatusDisplay(StudentStatus.ACTIVE) },
  { value: StudentStatus.INACTIVE, label: getStudentStatusDisplay(StudentStatus.INACTIVE) },
  { value: StudentStatus.SUSPENDED, label: getStudentStatusDisplay(StudentStatus.SUSPENDED) },
  { value: StudentStatus.GRADUATED, label: getStudentStatusDisplay(StudentStatus.GRADUATED) },
  { value: StudentStatus.TRANSFERRED, label: getStudentStatusDisplay(StudentStatus.TRANSFERRED) },
  { value: StudentStatus.WITHDRAWN, label: getStudentStatusDisplay(StudentStatus.WITHDRAWN) },
];

export const getGenderOptions = () => [
  { value: Gender.MALE, label: getGenderDisplay(Gender.MALE) },
  { value: Gender.FEMALE, label: getGenderDisplay(Gender.FEMALE) },
  { value: Gender.OTHER, label: getGenderDisplay(Gender.OTHER) },
];

export const getParentTypeOptions = () => [
  { value: ParentType.PRIMARY, label: getParentTypeDisplay(ParentType.PRIMARY) },
  { value: ParentType.SECONDARY, label: getParentTypeDisplay(ParentType.SECONDARY) },
  { value: ParentType.GUARDIAN, label: getParentTypeDisplay(ParentType.GUARDIAN) },
];