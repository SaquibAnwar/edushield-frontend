// User related types
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum StudentStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  GRADUATED = 'Graduated',
  SUSPENDED = 'Suspended',
}

export enum ExamType {
  MIDTERM = 'Midterm',
  FINAL = 'Final',
  QUIZ = 'Quiz',
  ASSIGNMENT = 'Assignment',
}

export enum FeeType {
  TUITION = 'Tuition',
  LIBRARY = 'Library',
  LABORATORY = 'Laboratory',
  SPORTS = 'Sports',
  TRANSPORT = 'Transport',
  OTHER = 'Other',
}

export enum PaymentStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  OVERDUE = 'Overdue',
  PARTIAL = 'Partial',
}
