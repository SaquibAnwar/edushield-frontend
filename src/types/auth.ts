export enum UserRole {
  Admin = 'Admin',
  Student = 'Student',
  Parent = 'Parent',
  Faculty = 'Faculty'
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

export interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  expiresAt: string;
  user?: User;
  errorMessage?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthAction {
  type: 'LOGIN_START' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'REFRESH_TOKEN' | 'CLEAR_ERROR';
  payload?: any;
}

export interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  exp: number;
  iat: number;
}