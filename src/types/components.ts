// Component-related types and interfaces
import type { ReactNode } from 'react';
import type { UserRole } from './auth';
import type { Student, Faculty, Parent, StudentPerformance, StudentFee } from './user';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

// Layout component props
export interface LayoutProps extends BaseComponentProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export interface NavigationProps extends BaseComponentProps {
  user: {
    name: string;
    email: string;
    role: UserRole;
    profilePictureUrl?: string;
  };
  onLogout: () => void;
}

export interface SidebarProps extends BaseComponentProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: UserRole;
  currentPath: string;
}

// Table component props
export interface Column<T> {
  key: keyof T | string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface DataTableProps<T> extends BaseComponentProps {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T, index: number) => string);
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    onChange: (page: number, pageSize: number) => void;
  };
  selection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
  onRowClick?: (record: T, index: number) => void;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  expandable?: {
    expandedRowRender: (record: T, index: number) => ReactNode;
    expandedRowKeys?: string[];
    onExpand?: (expanded: boolean, record: T) => void;
  };
  scroll?: { x?: number | string; y?: number | string };
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  showHeader?: boolean;
  sticky?: boolean;
}

// Form component props
export interface FormProps<T> extends BaseComponentProps {
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  mode?: 'create' | 'edit' | 'view';
  validationSchema?: any;
  showReset?: boolean;
  showCancel?: boolean;
  submitText?: string;
  cancelText?: string;
  resetText?: string;
}

// Modal component props
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode;
  loading?: boolean;
  centered?: boolean;
  destroyOnClose?: boolean;
}

// Card component props
export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  loading?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  size?: 'small' | 'default' | 'large';
  cover?: ReactNode;
  extra?: ReactNode;
}

// Dashboard component props
export interface DashboardProps extends BaseComponentProps {
  userRole: UserRole;
  userId: string;
}

export interface MetricCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  onClick?: () => void;
}

// Search component props
export interface SearchProps extends BaseComponentProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  loading?: boolean;
  allowClear?: boolean;
  size?: 'small' | 'middle' | 'large';
  debounceMs?: number;
}

// Filter component props
export interface FilterProps extends BaseComponentProps {
  filters: FilterOption[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset?: () => void;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'text';
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  defaultValue?: any;
}

// Loading component props
export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  spinning?: boolean;
  delay?: number;
}

// Error component props
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

export interface ErrorMessageProps extends BaseComponentProps {
  error?: string | Error;
  showIcon?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
}

// Toast/Notification props
export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
}

// Protected Route props
export interface ProtectedRouteProps extends BaseComponentProps {
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
}

// Role-specific component props
export interface AdminDashboardProps extends BaseComponentProps {
  metrics: {
    totalStudents: number;
    totalFaculty: number;
    totalParents: number;
    activeStudents: number;
    overduePayments: number;
    totalOverdueAmount: number;
  };
}

export interface StudentDashboardProps extends BaseComponentProps {
  student: Student;
  recentPerformances: StudentPerformance[];
  pendingFees: StudentFee[];
}

export interface ParentDashboardProps extends BaseComponentProps {
  parent: Parent;
  studentChildren: Student[];
  selectedChildId?: string;
  onChildSelect: (childId: string) => void;
}

export interface FacultyDashboardProps extends BaseComponentProps {
  faculty: Faculty;
  assignedStudents: Student[];
  recentPerformances: StudentPerformance[];
}

// Management component props
export interface StudentManagementProps extends BaseComponentProps {
  students: Student[];
  loading?: boolean;
  onCreateStudent: (data: any) => Promise<void>;
  onUpdateStudent: (id: string, data: any) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

export interface FacultyManagementProps extends BaseComponentProps {
  faculties: Faculty[];
  loading?: boolean;
  onCreateFaculty: (data: any) => Promise<void>;
  onUpdateFaculty: (id: string, data: any) => Promise<void>;
  onDeleteFaculty: (id: string) => Promise<void>;
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

export interface ParentManagementProps extends BaseComponentProps {
  parents: Parent[];
  loading?: boolean;
  onCreateParent: (data: any) => Promise<void>;
  onUpdateParent: (id: string, data: any) => Promise<void>;
  onDeleteParent: (id: string) => Promise<void>;
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

// Performance and Fee component props
export interface PerformanceViewProps extends BaseComponentProps {
  performances: StudentPerformance[];
  studentId?: string;
  loading?: boolean;
  onCreatePerformance?: (data: any) => Promise<void>;
  onUpdatePerformance?: (id: string, data: any) => Promise<void>;
  onDeletePerformance?: (id: string) => Promise<void>;
  readonly?: boolean;
}

export interface FeeViewProps extends BaseComponentProps {
  fees: StudentFee[];
  studentId?: string;
  loading?: boolean;
  onCreateFee?: (data: any) => Promise<void>;
  onUpdateFee?: (id: string, data: any) => Promise<void>;
  onDeleteFee?: (id: string) => Promise<void>;
  onPayment?: (feeId: string, amount: number) => Promise<void>;
  readonly?: boolean;
}

// Hook return types
export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePaginationReturn {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, size: number) => void;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  debouncedQuery: string;
  isSearching: boolean;
}

export interface UseFiltersReturn<T> {
  filters: T;
  setFilters: (filters: Partial<T>) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

// State management types
export interface AppState {
  auth: {
    user: any;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    loading: boolean;
  };
  data: {
    students: Student[];
    faculties: Faculty[];
    parents: Parent[];
    performances: StudentPerformance[];
    fees: StudentFee[];
  };
}

export type AppAction = 
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_STUDENTS'; payload: Student[] }
  | { type: 'SET_FACULTIES'; payload: Faculty[] }
  | { type: 'SET_PARENTS'; payload: Parent[] }
  | { type: 'SET_PERFORMANCES'; payload: StudentPerformance[] }
  | { type: 'SET_FEES'; payload: StudentFee[] };