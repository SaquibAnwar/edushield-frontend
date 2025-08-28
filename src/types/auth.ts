// Authentication related types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResult {
  user: User;
  token: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export enum UserRole {
  ADMIN = 'Admin',
  STUDENT = 'Student',
  PARENT = 'Parent',
  FACULTY = 'Faculty',
}
