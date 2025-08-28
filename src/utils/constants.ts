// Application constants
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  STUDENT: '/student',
  PARENT: '/parent',
  FACULTY: '/faculty',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
} as const;
