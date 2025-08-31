// User related types and enums - aligned with backend enum values
export enum Gender {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
}

export enum StudentStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  SUSPENDED = 2,
  GRADUATED = 3,
  TRANSFERRED = 4,
  WITHDRAWN = 5,
}

export enum ExamType {
  UnitTest = 0,
  MidTerm = 1,
  Final = 2,
  Assignment = 3,
  Laboratory = 4,
  Presentation = 5,
  ContinuousAssessment = 6,
  Other = 7,
}

export enum FeeType {
  Tuition = 0,
  Exam = 1,
  Transport = 2,
  Library = 3,
  Misc = 4,
}

export enum PaymentStatus {
  Pending = 0,
  Partial = 1,
  Paid = 2,
  Overdue = 3,
}

export enum ParentType {
  PRIMARY = 0,
  SECONDARY = 1,
  GUARDIAN = 2,
}

export enum ParentStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  SUSPENDED = 2,
}

// Student entity interface
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  gender: Gender;
  rollNumber: string;
  enrollmentDate: string;
  status: StudentStatus;
  grade?: string;
  section?: string;
  userId?: string;
  parentId?: string;
  fullName: string;
  age: number;
  isEnrolled: boolean;
  assignedFaculties: FacultyAssignment[];
  createdAt: string;
  updatedAt: string;
}

// Faculty entity interface
export interface Faculty {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  gender: Gender;
  department: string;
  subject: string;
  employeeId?: string;
  hireDate: string;
  isActive: boolean;
  userId?: string;
  fullName: string;
  age: number;
  yearsOfService: number;
  createdAt: string;
  updatedAt: string;
}

// Parent entity interface
export interface Parent {
  id: string;
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
  userId?: string;
  parentType: ParentType;
  isEmergencyContact: boolean;
  isAuthorizedToPickup: boolean;
  status: ParentStatus;
  isActive: boolean; // Keep for backward compatibility
  fullName: string;
  age: number;
  fullAddress: string;
  childrenCount: number;
  createdAt: string;
  updatedAt: string;
}

// Student Performance entity interface
export interface StudentPerformance {
  id: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  subject: string;
  examType: ExamType;
  examDate: string;
  score: number;
  maxScore?: number;
  examTitle?: string;
  comments?: string;
  percentage?: number;
  grade: string;
  formattedScore: string;
  createdAt: string;
  updatedAt: string;
}

// Student Fee entity interface
export interface StudentFee {
  id: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentRollNumber: string;
  feeType: FeeType;
  term: string;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  lastPaymentDate?: string;
  fineAmount: number;
  notes?: string;
  isOverdue: boolean;
  daysOverdue: number;
  paymentStatusDescription: string;
  feeTypeDescription: string;
  createdAt: string;
  updatedAt: string;
}

// Faculty Assignment interface
export interface FacultyAssignment {
  id: string;
  studentId: string;
  facultyId: string;
  assignedDate: string;
  isActive: boolean;
  notes?: string;
  faculty?: Faculty;
}

// Parent Student relationship interface
export interface ParentStudent {
  id: string;
  parentId: string;
  studentId: string;
  relationship: string;
  isPrimaryContact: boolean;
  isAuthorizedToPickup: boolean;
  isEmergencyContact: boolean;
  isActive: boolean;
  notes?: string;
  parent?: Parent;
  student?: Student;
}
