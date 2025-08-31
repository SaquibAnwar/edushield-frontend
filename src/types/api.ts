import type { StudentPerformance } from './user';
import { Gender, StudentStatus, ExamType, FeeType, PaymentStatus, ParentType } from './user';

// API related types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Filter interfaces
export interface StudentFilters {
  search?: string;
  status?: StudentStatus;
  gender?: Gender;
  grade?: string;
  section?: string;
  parentId?: string;
  facultyId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FacultyFilters {
  search?: string;
  department?: string;
  subject?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ParentFilters {
  search?: string;
  parentType?: ParentType;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PerformanceFilters {
  studentId?: string;
  subject?: string;
  examType?: ExamType;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FeeFilters {
  studentId?: string;
  feeType?: FeeType;
  paymentStatus?: PaymentStatus;
  term?: string;
  isOverdue?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Create request interfaces
export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  address: string;
  gender: Gender;
  enrollmentDate: Date;
  grade?: string;
  section?: string;
  parentId?: string;
  facultyIds: string[];
}

export interface CreateFacultyRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  address: string;
  gender: Gender;
  department: string;
  subject: string;
  hireDate: Date;
  userId?: string;
  isActive?: boolean;
}

export interface CreateParentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  dateOfBirth: Date;
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

export interface CreatePerformanceRequest {
  studentId: string;
  subject: string;
  examType: ExamType;
  examDate: string;
  score: number;
  maxScore?: number;
  examTitle?: string;
  comments?: string;
}

export interface CreateFeeRequest {
  studentId: string;
  feeType: FeeType;
  term: string;
  totalAmount: number;
  dueDate: string;
  notes?: string;
}

// Update request interfaces (partial versions of create requests)
export type UpdateStudentRequest = Partial<CreateStudentRequest>;
export type UpdateFacultyRequest = Partial<CreateFacultyRequest>;
export type UpdateParentRequest = Partial<CreateParentRequest>;
export type UpdatePerformanceRequest = Partial<CreatePerformanceRequest>;
export type UpdateFeeRequest = Partial<CreateFeeRequest>;

// Bulk operation interfaces
export interface BulkDeleteRequest {
  ids: string[];
}

export interface BulkUpdateRequest<T> {
  ids: string[];
  data: T;
}

// Assignment interfaces
export interface AssignFacultyToStudentRequest {
  studentId: string;
  facultyId: string;
  subject?: string;
  notes?: string;
  isActive: boolean;
}

export interface AssignParentToStudentRequest {
  parentId: string;
  studentId: string;
  relationship: string;
  isPrimaryContact: boolean;
  isAuthorizedToPickup: boolean;
  isEmergencyContact: boolean;
  isActive: boolean;
  notes?: string;
}

// Dashboard metrics interfaces
export interface AdminMetrics {
  totalStudents: number;
  totalFaculty: number;
  totalParents: number;
  activeStudents: number;
  inactiveStudents: number;
  activeFaculty: number;
  inactiveFaculty: number;
  overduePayments: number;
  totalOverdueAmount: number;
  recentEnrollments: number;
}

export interface StudentMetrics {
  totalSubjects: number;
  averageGrade: string;
  totalExams: number;
  pendingFees: number;
  overdueAmount: number;
  recentPerformances: StudentPerformance[];
}

export interface ParentMetrics {
  totalChildren: number;
  childrenWithOverdueFees: number;
  totalOverdueAmount: number;
  recentPerformances: StudentPerformance[];
}

export interface FacultyMetrics {
  assignedStudents: number;
  totalSubjects: number;
  recentPerformances: StudentPerformance[];
  averageClassGrade: string;
}

// Re-export DateConverter interface for convenience
export type { DateConverter } from '../utils/dateUtils';
