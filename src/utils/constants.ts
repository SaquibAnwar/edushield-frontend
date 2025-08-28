// Application constants
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  STUDENT: '/student',
  PARENT: '/parent',
  FACULTY: '/faculty',
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    GOOGLE_LOGIN: '/auth/google',
    REFRESH_TOKEN: '/auth/refresh',
    REVOKE_TOKEN: '/auth/revoke',
    LOGOUT: '/auth/logout',
  },
  
  // Students
  STUDENTS: {
    BASE: '/students',
    BY_ID: (id: string) => `/students/${id}`,
    SEARCH: '/students/search',
    BULK_DELETE: '/students/bulk-delete',
    BULK_UPDATE: '/students/bulk-update',
    ASSIGN_FACULTY: (studentId: string) => `/students/${studentId}/faculty`,
    ASSIGN_PARENT: (studentId: string) => `/students/${studentId}/parent`,
    PERFORMANCE: (studentId: string) => `/students/${studentId}/performance`,
    FEES: (studentId: string) => `/students/${studentId}/fees`,
  },
  
  // Faculty
  FACULTY: {
    BASE: '/faculty',
    BY_ID: (id: string) => `/faculty/${id}`,
    SEARCH: '/faculty/search',
    BULK_DELETE: '/faculty/bulk-delete',
    BULK_UPDATE: '/faculty/bulk-update',
    ASSIGNED_STUDENTS: (facultyId: string) => `/faculty/${facultyId}/students`,
    ASSIGN_STUDENT: (facultyId: string) => `/faculty/${facultyId}/students`,
  },
  
  // Parents
  PARENTS: {
    BASE: '/parents',
    BY_ID: (id: string) => `/parents/${id}`,
    SEARCH: '/parents/search',
    BULK_DELETE: '/parents/bulk-delete',
    BULK_UPDATE: '/parents/bulk-update',
    CHILDREN: (parentId: string) => `/parents/${parentId}/children`,
    ASSIGN_CHILD: (parentId: string) => `/parents/${parentId}/children`,
  },
  
  // Performance
  PERFORMANCE: {
    BASE: '/performance',
    BY_ID: (id: string) => `/performance/${id}`,
    BY_STUDENT: (studentId: string) => `/performance/student/${studentId}`,
    BY_SUBJECT: (subject: string) => `/performance/subject/${subject}`,
    BULK_DELETE: '/performance/bulk-delete',
    BULK_UPDATE: '/performance/bulk-update',
  },
  
  // Fees
  FEES: {
    BASE: '/fees',
    BY_ID: (id: string) => `/fees/${id}`,
    BY_STUDENT: (studentId: string) => `/fees/student/${studentId}`,
    OVERDUE: '/fees/overdue',
    BY_TERM: (term: string) => `/fees/term/${term}`,
    BULK_DELETE: '/fees/bulk-delete',
    BULK_UPDATE: '/fees/bulk-update',
    PAYMENT: (feeId: string) => `/fees/${feeId}/payment`,
  },
  
  // Dashboard Metrics
  METRICS: {
    ADMIN: '/metrics/admin',
    STUDENT: (studentId: string) => `/metrics/student/${studentId}`,
    PARENT: (parentId: string) => `/metrics/parent/${parentId}`,
    FACULTY: (facultyId: string) => `/metrics/faculty/${facultyId}`,
  },
  
  // User Management
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
} as const;

// Form validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  ROLL_NUMBER_REGEX: /^student_\d+$/,
  EMPLOYEE_ID_REGEX: /^[A-Z]{2,4}\d{3,6}$/,
  
  MIN_AGE: 3,
  MAX_AGE: 100,
  MIN_SCORE: 0,
  MAX_SCORE: 100,
  MIN_PASSWORD_LENGTH: 8,
  
  MAX_LENGTH: {
    NAME: 50,
    EMAIL: 100,
    PHONE: 20,
    ADDRESS: 200,
    NOTES: 500,
    SUBJECT: 100,
    DEPARTMENT: 100,
    EXAM_TITLE: 100,
  },
} as const;

// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 64,
  HEADER_HEIGHT: 64,
  
  BREAKPOINTS: {
    XS: 480,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  },
  
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
    MAX_PAGE_SIZE: 100,
  },
  
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  
  COLORS: {
    PRIMARY: '#1976d2',
    SECONDARY: '#dc004e',
    SUCCESS: '#2e7d32',
    WARNING: '#ed6c02',
    ERROR: '#d32f2f',
    INFO: '#0288d1',
  },
} as const;

// Date and time formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
  FULL: 'EEEE, MMMM dd, yyyy',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created!',
  UPDATED: 'Successfully updated!',
  DELETED: 'Successfully deleted!',
  SAVED: 'Successfully saved!',
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out!',
} as const;
