import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  field?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Enhanced error handler for API and form errors
 */
export class ErrorHandler {
  /**
   * Parse API error response and extract meaningful error information
   */
  static parseApiError(error: any): ApiError {
    // Handle Axios errors
    if (error.isAxiosError || error.response) {
      const axiosError = error as AxiosError;
      const response = axiosError.response;
      
      if (!response) {
        // Network error
        if (axiosError.code === 'ECONNABORTED') {
          return {
            message: 'Request timeout. Please check your connection and try again.',
            code: 'TIMEOUT',
          };
        }
        if (axiosError.message === 'Network Error') {
          return {
            message: 'Unable to connect to the server. Please check your internet connection.',
            code: 'NETWORK_ERROR',
          };
        }
        return {
          message: axiosError.message || 'Network error occurred',
          code: 'NETWORK_ERROR',
        };
      }

      const status = response.status;
      const data = response.data as any;

      // Extract error message from response
      let message = 'An unexpected error occurred';
      let details = null;

      if (data) {
        if (typeof data === 'string') {
          message = data;
        } else if (data.message) {
          message = data.message;
        } else if (data.error) {
          message = data.error;
        } else if (data.errors) {
          if (Array.isArray(data.errors)) {
            message = data.errors.join(', ');
            details = data.errors;
          } else if (typeof data.errors === 'object') {
            // Handle validation errors object
            const errorMessages = Object.values(data.errors).flat();
            message = errorMessages.join(', ');
            details = data.errors;
          }
        } else if (data.title) {
          message = data.title;
        }
      }

      // Provide user-friendly messages for common HTTP status codes
      if (!data || (!data.message && !data.error && !data.errors)) {
        message = this.getStatusMessage(status);
      }

      return {
        message,
        status,
        code: data?.code || `HTTP_${status}`,
        details,
      };
    }

    // Handle regular Error objects
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'GENERIC_ERROR',
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        message: error,
        code: 'STRING_ERROR',
      };
    }

    // Fallback for unknown error types
    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }

  /**
   * Parse validation errors from backend response
   */
  static parseValidationErrors(error: any): ValidationError[] {
    const apiError = this.parseApiError(error);
    const validationErrors: ValidationError[] = [];

    if (apiError.details && typeof apiError.details === 'object') {
      // Handle ASP.NET Core ModelState errors
      if (Array.isArray(apiError.details)) {
        apiError.details.forEach((err: any) => {
          if (err.field && err.message) {
            validationErrors.push({
              field: err.field,
              message: err.message,
              code: err.code,
            });
          }
        });
      } else {
        // Handle object-based validation errors
        Object.entries(apiError.details).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message: string) => {
              validationErrors.push({
                field: field.toLowerCase(),
                message,
                code: 'VALIDATION_ERROR',
              });
            });
          } else if (typeof messages === 'string') {
            validationErrors.push({
              field: field.toLowerCase(),
              message: messages,
              code: 'VALIDATION_ERROR',
            });
          }
        });
      }
    }

    return validationErrors;
  }

  /**
   * Get user-friendly message for HTTP status codes
   */
  private static getStatusMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This operation conflicts with existing data. Please check for duplicates.';
      case 422:
        return 'The submitted data is invalid. Please correct the errors and try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'A server error occurred. Please try again later.';
      case 502:
        return 'The server is temporarily unavailable. Please try again later.';
      case 503:
        return 'The service is temporarily unavailable. Please try again later.';
      case 504:
        return 'The request timed out. Please try again.';
      default:
        return `An error occurred (${status}). Please try again.`;
    }
  }

  /**
   * Check if error is a network/connectivity issue
   */
  static isNetworkError(error: any): boolean {
    if (error.isAxiosError) {
      return !error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error';
    }
    return false;
  }

  /**
   * Check if error is an authentication error
   */
  static isAuthError(error: any): boolean {
    const apiError = this.parseApiError(error);
    return apiError.status === 401;
  }

  /**
   * Check if error is a permission error
   */
  static isPermissionError(error: any): boolean {
    const apiError = this.parseApiError(error);
    return apiError.status === 403;
  }

  /**
   * Check if error is a validation error
   */
  static isValidationError(error: any): boolean {
    const apiError = this.parseApiError(error);
    return apiError.status === 400 || apiError.status === 422;
  }

  /**
   * Get retry-able error types
   */
  static isRetryableError(error: any): boolean {
    const apiError = this.parseApiError(error);
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return this.isNetworkError(error) || (apiError.status ? retryableStatuses.includes(apiError.status) : false);
  }

  /**
   * Format error for display to users
   */
  static formatErrorForDisplay(error: any): { title: string; message: string } {
    const apiError = this.parseApiError(error);

    if (this.isAuthError(error)) {
      return {
        title: 'Authentication Required',
        message: 'Your session has expired. Please log in again to continue.',
      };
    }

    if (this.isPermissionError(error)) {
      return {
        title: 'Access Denied',
        message: 'You do not have permission to perform this action.',
      };
    }

    if (this.isNetworkError(error)) {
      return {
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
      };
    }

    if (this.isValidationError(error)) {
      return {
        title: 'Validation Error',
        message: apiError.message || 'Please correct the errors in the form and try again.',
      };
    }

    return {
      title: 'Error',
      message: apiError.message,
    };
  }
}

/**
 * Hook for handling errors in components
 */
export const useErrorHandler = () => {
  const handleError = (error: any, context?: string) => {
    const apiError = ErrorHandler.parseApiError(error);
    
    // Log error for debugging
    console.error(`Error in ${context || 'component'}:`, {
      message: apiError.message,
      status: apiError.status,
      code: apiError.code,
      details: apiError.details,
      originalError: error,
    });

    return apiError;
  };

  const handleValidationErrors = (error: any) => {
    return ErrorHandler.parseValidationErrors(error);
  };

  const isRetryable = (error: any) => {
    return ErrorHandler.isRetryableError(error);
  };

  const formatForDisplay = (error: any) => {
    return ErrorHandler.formatErrorForDisplay(error);
  };

  return {
    handleError,
    handleValidationErrors,
    isRetryable,
    formatForDisplay,
  };
};