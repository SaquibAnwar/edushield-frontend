import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { storage } from '../utils/storage';
import { AuthService } from './auth';
import type {
  Student,
  Faculty,
  Parent,
  StudentPerformance,
  StudentFee,
  FacultyAssignment,
  ParentStudent,
} from '../types/user';
import type {
  PaginatedResponse,
  StudentFilters,
  ParentFilters,
  PerformanceFilters,
  FeeFilters,
  CreateStudentRequest,
  CreateFacultyRequest,
  CreateParentRequest,
  CreatePerformanceRequest,
  CreateFeeRequest,
  UpdateStudentRequest,
  UpdateFacultyRequest,
  UpdateParentRequest,
  UpdatePerformanceRequest,
  UpdateFeeRequest,
  AssignFacultyToStudentRequest,
  AssignParentToStudentRequest,
  AdminMetrics,
  StudentMetrics,
  ParentMetrics,
  FacultyMetrics,
} from '../types/api';
import { dateConverter } from '../utils/dateUtils';
import type { AuthResult } from '../types/auth';

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
    
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
      timeout: 30000, // Increased timeout for better reliability
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor to add JWT token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = storage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request in development
        if (import.meta.env.DEV) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
            params: config.params,
          });
        }
        
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh and errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development
        if (import.meta.env.DEV) {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }
        
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Log error in development
        if (import.meta.env.DEV) {
          console.error(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
          });
        }

        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            await this.authService.refreshToken();
            
            // Retry original request with new token
            const newToken = storage.getToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            console.error('Token refresh failed:', refreshError);
            storage.clearAll();
            
            // Show user-friendly message about session expiration
            if (window.location.pathname !== '/') {
              // Create a temporary toast to show session expired message
              const event = new CustomEvent('sessionExpired', {
                detail: {
                  title: 'Session Expired',
                  message: 'Your session has expired. Please log in again to continue.',
                }
              });
              window.dispatchEvent(event);
              
              // Redirect to login page after a short delay
              setTimeout(() => {
                window.location.href = '/';
              }, 2000);
            }
            
            return Promise.reject(new Error('Your session has expired. Please log in again.'));
          }
        }

        // Handle other errors
        const errorMessage = this.getErrorMessage(error);
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  private getErrorMessage(error: any): string {
    // Check for network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'Request timeout. Please try again.';
      }
      if (error.message === 'Network Error') {
        return 'Network error. Please check your connection.';
      }
      return error.message || 'Network error occurred.';
    }

    // Extract error message from response
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors.join(', ');
    }
    
    // Default error messages based on status codes
    switch (error.response?.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Forbidden. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict. The resource already exists or there is a data conflict.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Internal server error. Please try again later.';
      case 502:
        return 'Bad gateway. The server is temporarily unavailable.';
      case 503:
        return 'Service unavailable. Please try again later.';
      case 504:
        return 'Gateway timeout. Please try again later.';
      default:
        return `An unexpected error occurred (${error.response?.status}). Please try again.`;
    }
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Get axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// API Service class with all backend endpoints
export class ApiService {
  private static instance: ApiService;
  private client: ApiClient;

  constructor() {
    this.client = ApiClient.getInstance();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Authentication endpoints
  async authenticateWithGoogle(idToken: string): Promise<AuthResult> {
    return this.client.post<AuthResult>('/auth/google', { idToken });
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    return this.client.post<AuthResult>('/auth/refresh', { refreshToken });
  }

  async revokeToken(refreshToken: string): Promise<void> {
    return this.client.post<void>('/auth/revoke', { refreshToken });
  }

  async getCurrentUser(): Promise<any> {
    return this.client.get('/auth/me');
  }

  // Student endpoints
  async getStudents(filters?: StudentFilters): Promise<PaginatedResponse<Student>> {
    const params = this.buildQueryParams(filters);
    return this.client.get<PaginatedResponse<Student>>('/students', { params });
  }

  async getStudent(id: string): Promise<Student> {
    return this.client.get<Student>(`/students/${id}`);
  }

  async createStudent(data: CreateStudentRequest): Promise<Student> {
    // Convert Date objects to ISO strings for backend
    const requestData = {
      ...data,
      dateOfBirth: dateConverter.formatForBackend(data.dateOfBirth),
      enrollmentDate: dateConverter.formatForBackend(data.enrollmentDate),
    };
    return this.client.post<Student>('/students', requestData);
  }

  async updateStudent(id: string, data: UpdateStudentRequest): Promise<Student> {
    // Convert Date objects to ISO strings for backend if they exist
    const requestData = { ...data };
    if (requestData.dateOfBirth instanceof Date) {
      requestData.dateOfBirth = dateConverter.formatForBackend(requestData.dateOfBirth) as any;
    }
    if (requestData.enrollmentDate instanceof Date) {
      requestData.enrollmentDate = dateConverter.formatForBackend(requestData.enrollmentDate) as any;
    }
    return this.client.put<Student>(`/students/${id}`, requestData);
  }

  async deleteStudent(id: string): Promise<void> {
    return this.client.delete<void>(`/students/${id}`);
  }

  async bulkDeleteStudents(ids: string[]): Promise<void> {
    return this.client.post<void>('/students/bulk-delete', { ids });
  }

  async getStudentByEmail(email: string): Promise<Student> {
    return this.client.get<Student>(`/students/by-email/${encodeURIComponent(email)}`);
  }

  // Faculty endpoints
  async getFaculties(): Promise<Faculty[]> {
    return this.client.get<Faculty[]>('/faculty');
  }

  async getFaculty(id: string): Promise<Faculty> {
    return this.client.get<Faculty>(`/faculty/${id}`);
  }

  async createFaculty(data: CreateFacultyRequest): Promise<Faculty> {
    // Convert Date objects to ISO strings for backend
    const requestData = {
      ...data,
      dateOfBirth: dateConverter.formatForBackend(data.dateOfBirth),
      hireDate: dateConverter.formatForBackend(data.hireDate),
    };
    return this.client.post<Faculty>('/faculty', requestData);
  }

  async updateFaculty(id: string, data: UpdateFacultyRequest): Promise<Faculty> {
    // Convert Date objects to ISO strings for backend if they exist
    const requestData = { ...data };
    if (requestData.dateOfBirth instanceof Date) {
      requestData.dateOfBirth = dateConverter.formatForBackend(requestData.dateOfBirth) as any;
    }
    if (requestData.hireDate instanceof Date) {
      requestData.hireDate = dateConverter.formatForBackend(requestData.hireDate) as any;
    }
    return this.client.put<Faculty>(`/faculty/${id}`, requestData);
  }

  async deleteFaculty(id: string): Promise<void> {
    return this.client.delete<void>(`/faculty/${id}`);
  }

  async bulkDeleteFaculties(ids: string[]): Promise<void> {
    return this.client.post<void>('/faculty/bulk-delete', { ids });
  }

  // Parent endpoints
  async getParents(filters?: ParentFilters): Promise<Parent[]> {
    const params = this.buildQueryParams(filters);
    return this.client.get<Parent[]>('/parents', { params });
  }

  async getParent(id: string): Promise<Parent> {
    return this.client.get<Parent>(`/parents/${id}`);
  }

  async createParent(data: CreateParentRequest): Promise<Parent> {
    // Convert Date objects to ISO strings for backend
    const requestData = {
      ...data,
      dateOfBirth: dateConverter.formatForBackend(data.dateOfBirth),
    };
    return this.client.post<Parent>('/parents', requestData);
  }

  async updateParent(id: string, data: UpdateParentRequest): Promise<Parent> {
    // Convert Date objects to ISO strings for backend if they exist
    const requestData = { ...data };
    if (requestData.dateOfBirth instanceof Date) {
      requestData.dateOfBirth = dateConverter.formatForBackend(requestData.dateOfBirth) as any;
    }
    return this.client.put<Parent>(`/parents/${id}`, requestData);
  }

  async deleteParent(id: string): Promise<void> {
    return this.client.delete<void>(`/parents/${id}`);
  }

  async bulkDeleteParents(ids: string[]): Promise<void> {
    return this.client.post<void>('/parents/bulk-delete', { ids });
  }

  // Student Performance endpoints
  async getStudentPerformances(filters?: PerformanceFilters): Promise<PaginatedResponse<StudentPerformance>> {
    const params = this.buildQueryParams(filters);
    return this.client.get<PaginatedResponse<StudentPerformance>>('/student-performance', { params });
  }

  async getStudentPerformance(id: string): Promise<StudentPerformance> {
    return this.client.get<StudentPerformance>(`/student-performance/${id}`);
  }

  async createPerformance(data: CreatePerformanceRequest): Promise<StudentPerformance> {
    // Convert Date objects to ISO strings for backend
    const requestData = { ...data };
    // Always convert examDate to proper ISO format
    requestData.examDate = dateConverter.formatForBackend(new Date(requestData.examDate));
    return this.client.post<StudentPerformance>('/student-performance', requestData);
  }

  async updatePerformance(id: string, data: UpdatePerformanceRequest): Promise<StudentPerformance> {
    // Convert date strings to proper ISO format for backend
    const requestData = { ...data };
    if (requestData.examDate) {
      // Convert form date string (YYYY-MM-DD) to proper ISO format
      requestData.examDate = dateConverter.formatForBackend(dateConverter.formDateToDateTime(requestData.examDate));
    }
    return this.client.put<StudentPerformance>(`/student-performance/${id}`, requestData);
  }

  async deletePerformance(id: string): Promise<void> {
    return this.client.delete<void>(`/student-performance/${id}`);
  }

  async bulkDeletePerformances(ids: string[]): Promise<void> {
    return this.client.post<void>('/student-performance/bulk-delete', { ids });
  }

  async createSamplePerformanceData(): Promise<{ message: string; count: number }> {
    return this.client.post<{ message: string; count: number }>('/student-performance/create-sample-data');
  }

  // Student Fee endpoints
  async getStudentFees(filters?: FeeFilters): Promise<PaginatedResponse<StudentFee>> {
    const params = this.buildQueryParams(filters);
    return this.client.get<PaginatedResponse<StudentFee>>('/student-fees', { params });
  }
  async getStudentFee(id: string): Promise<StudentFee> {
    return this.client.get<StudentFee>(`/student-fees/${id}`);
  }

  async createFee(data: CreateFeeRequest): Promise<StudentFee> {
    // Convert Date objects to ISO strings for backend
    const requestData = { ...data };
    // Always convert dueDate to proper ISO format
    requestData.dueDate = dateConverter.formatForBackend(new Date(requestData.dueDate));
    return this.client.post<StudentFee>('/student-fees', requestData);
  }

  async updateFee(id: string, data: UpdateFeeRequest): Promise<StudentFee> {
    // Convert date strings to proper ISO format for backend
    const requestData = { ...data };
    if (requestData.dueDate) {
      // Convert form date string (YYYY-MM-DD) to proper ISO format
      requestData.dueDate = dateConverter.formatForBackend(dateConverter.formDateToDateTime(requestData.dueDate));
    }
    return this.client.put<StudentFee>(`/student-fees/${id}`, requestData);
  }

  async deleteFee(id: string): Promise<void> {
    return this.client.delete<void>(`/student-fees/${id}`);
  }

  async bulkDeleteFees(ids: string[]): Promise<void> {
    return this.client.post<void>('/student-fees/bulk-delete', { ids });
  }

  // Faculty Assignment endpoints
  async assignFacultyToStudent(data: AssignFacultyToStudentRequest): Promise<FacultyAssignment> {
    return this.client.post<FacultyAssignment>('/faculty-student-assignments', data);
  }

  async getFacultyAssignments(studentId?: string, facultyId?: string): Promise<FacultyAssignment[]> {
    const params: any = {};
    if (studentId) params.studentId = studentId;
    if (facultyId) params.facultyId = facultyId;
    return this.client.get<FacultyAssignment[]>('/faculty-student-assignments', { params });
  }

  async deleteFacultyAssignment(id: string): Promise<void> {
    return this.client.delete<void>(`/faculty-student-assignments/${id}`);
  }

  // Parent Student relationship endpoints
  async assignParentToStudent(data: AssignParentToStudentRequest): Promise<ParentStudent> {
    return this.client.post<ParentStudent>('/parent-student-assignments', data);
  }

  async getParentStudents(parentId?: string, studentId?: string): Promise<ParentStudent[]> {
    const params: any = {};
    if (parentId) params.parentId = parentId;
    if (studentId) params.studentId = studentId;
    return this.client.get<ParentStudent[]>('/parent-student-assignments', { params });
  }

  async deleteParentStudent(id: string): Promise<void> {
    return this.client.delete<void>(`/parent-student-assignments/${id}`);
  }

  // Dashboard metrics endpoints
  async getAdminMetrics(): Promise<AdminMetrics> {
    return this.client.get<AdminMetrics>('/metrics/admin');
  }

  async getStudentMetrics(studentId: string): Promise<StudentMetrics> {
    return this.client.get<StudentMetrics>(`/metrics/student/${studentId}`);
  }

  async getParentMetrics(parentId: string): Promise<ParentMetrics> {
    return this.client.get<ParentMetrics>(`/metrics/parent/${parentId}`);
  }

  async getFacultyMetrics(facultyId: string): Promise<FacultyMetrics> {
    return this.client.get<FacultyMetrics>(`/metrics/faculty/${facultyId}`);
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.client.get('/health');
  }

  // Utility method to build query parameters
  private buildQueryParams(filters?: Record<string, any>): Record<string, any> {
    if (!filters) return {};
    
    const params: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });
    
    return params;
  }
}

// Export instances
export const apiClient = ApiClient.getInstance();
export const apiService = ApiService.getInstance();