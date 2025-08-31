/**
 * Date conversion utilities for handling DateTime objects between frontend and backend
 */

/**
 * Converts a date string to a Date object
 * @param dateString - Date string in ISO format or other valid date format
 * @returns Date object
 */
export function stringToDateTime(dateString: string): Date {
  if (!dateString) {
    throw new Error('Date string is required');
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  
  return date;
}

/**
 * Formats a Date object for backend consumption
 * @param date - Date object to format
 * @returns ISO string representation of the date
 */
export function formatForBackend(date: Date): string {
  if (!date || !(date instanceof Date)) {
    throw new Error('Valid Date object is required');
  }
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid Date object provided');
  }
  
  return date.toISOString();
}

/**
 * Validates if a date string is in a valid format
 * @param dateString - Date string to validate
 * @returns true if valid, false otherwise
 */
export function validateDateFormat(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Converts form date input (YYYY-MM-DD) to Date object
 * @param dateInput - Date input from HTML date input field
 * @returns Date object
 */
export function formDateToDateTime(dateInput: string): Date {
  if (!dateInput) {
    throw new Error('Date input is required');
  }
  
  // HTML date inputs return YYYY-MM-DD format
  // We need to create a Date object that represents the local date
  const [year, month, day] = dateInput.split('-').map(Number);
  
  if (!year || !month || !day) {
    throw new Error(`Invalid date input format: ${dateInput}`);
  }
  
  // Create date in local timezone (month is 0-indexed in Date constructor)
  const date = new Date(year, month - 1, day);
  
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date values: ${dateInput}`);
  }
  
  return date;
}

/**
 * Converts Date object to form date input format (YYYY-MM-DD)
 * @param date - Date object to convert
 * @returns Date string in YYYY-MM-DD format
 */
export function dateTimeToFormDate(date: Date): string {
  if (!date || !(date instanceof Date)) {
    throw new Error('Valid Date object is required');
  }
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid Date object provided');
  }
  
  // Get local date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Converts backend DateTime string to Date object
 * @param backendDateTime - DateTime string from backend (ISO format)
 * @returns Date object
 */
export function backendDateTimeToDate(backendDateTime: string): Date {
  if (!backendDateTime) {
    throw new Error('Backend DateTime string is required');
  }
  
  return stringToDateTime(backendDateTime);
}

/**
 * Converts Date object to backend DateTime format
 * @param date - Date object to convert
 * @returns ISO string for backend consumption
 */
export function dateToBackendDateTime(date: Date): string {
  return formatForBackend(date);
}

/**
 * Date conversion utilities interface for type safety
 */
export interface DateConverter {
  stringToDateTime(dateString: string): Date;
  formatForBackend(date: Date): string;
  validateDateFormat(dateString: string): boolean;
  formDateToDateTime(dateInput: string): Date;
  dateTimeToFormDate(date: Date): string;
  backendDateTimeToDate(backendDateTime: string): Date;
  dateToBackendDateTime(date: Date): string;
}

/**
 * Formats a date for display in the UI
 * @param date - Date string or Date object to format
 * @returns Formatted date string for display
 */
export function formatDisplayDate(date: string | Date): string {
  if (!date) {
    return 'N/A';
  }
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting display date:', error);
    return 'Invalid Date';
  }
}

/**
 * Formats a date for display (alias for formatDisplayDate)
 * @param date - Date string or Date object to format
 * @returns Formatted date string for display
 */
export function formatDate(date: string | Date): string {
  return formatDisplayDate(date);
}

/**
 * Date conversion utilities interface for type safety
 */
export interface DateConverter {
  stringToDateTime(dateString: string): Date;
  formatForBackend(date: Date): string;
  validateDateFormat(dateString: string): boolean;
  formDateToDateTime(dateInput: string): Date;
  dateTimeToFormDate(date: Date): string;
  backendDateTimeToDate(backendDateTime: string): Date;
  dateToBackendDateTime(date: Date): string;
  formatDisplayDate(date: string | Date): string;
  formatDate(date: string | Date): string;
}

/**
 * Default date converter implementation
 */
export const dateConverter: DateConverter = {
  stringToDateTime,
  formatForBackend,
  validateDateFormat,
  formDateToDateTime,
  dateTimeToFormDate,
  backendDateTimeToDate,
  dateToBackendDateTime,
  formatDisplayDate,
  formatDate,
};

/**
 * Utility function to safely convert form data dates to Date objects
 * @param formData - Form data object with date strings
 * @param dateFields - Array of field names that contain dates
 * @returns Form data with Date objects instead of strings
 */
export function convertFormDatesToDateTime<T extends Record<string, any>>(
  formData: T,
  dateFields: (keyof T)[]
): T {
  const convertedData = { ...formData };
  
  dateFields.forEach((field) => {
    if (convertedData[field] && typeof convertedData[field] === 'string') {
      try {
        convertedData[field] = formDateToDateTime(convertedData[field] as string) as T[keyof T];
      } catch (error) {
        console.error(`Error converting date field ${String(field)}:`, error);
        throw new Error(`Invalid date format for field ${String(field)}`);
      }
    }
  });
  
  return convertedData;
}

/**
 * Utility function to safely convert Date objects to form date strings
 * @param data - Data object with Date objects
 * @param dateFields - Array of field names that contain Date objects
 * @returns Data with date strings instead of Date objects
 */
export function convertDateTimesToFormDates<T extends Record<string, any>>(
  data: T,
  dateFields: (keyof T)[]
): T {
  const convertedData = { ...data };
  
  dateFields.forEach((field) => {
    if (convertedData[field] && (convertedData[field] as any) instanceof Date) {
      try {
        convertedData[field] = dateTimeToFormDate(convertedData[field] as Date) as T[keyof T];
      } catch (error) {
        console.error(`Error converting Date field ${String(field)}:`, error);
        throw new Error(`Invalid Date object for field ${String(field)}`);
      }
    }
  });
  
  return convertedData;
}