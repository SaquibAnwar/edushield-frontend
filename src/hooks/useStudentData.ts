import { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './useAuth';
import type { Student, StudentPerformance, StudentFee } from '../types/user';
import type { StudentMetrics } from '../types/api';
import { PaymentStatus } from '../types/user';

interface UseStudentDataReturn {
  student: Student | null;
  metrics: StudentMetrics | null;
  recentPerformances: StudentPerformance[];
  recentFees: StudentFee[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStudentData = (): UseStudentDataReturn => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [allPerformances, setAllPerformances] = useState<StudentPerformance[]>([]);
  const [allFees, setAllFees] = useState<StudentFee[]>([]);
  const [recentPerformances, setRecentPerformances] = useState<StudentPerformance[]>([]);
  const [recentFees, setRecentFees] = useState<StudentFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate metrics from actual data
  const metrics = useMemo((): StudentMetrics | null => {
    if (!allPerformances.length && !allFees.length) {
      return null;
    }

    // Calculate average grade
    let averageGrade = 'N/A';
    if (allPerformances.length > 0) {
      const totalPercentage = allPerformances.reduce((sum, perf) => {
        const maxScore = perf.maxScore || 100; // Default to 100 if undefined
        const percentage = maxScore > 0 ? (perf.score / maxScore) * 100 : 0;
        return sum + percentage;
      }, 0);
      const avgPercentage = totalPercentage / allPerformances.length;
      
      if (avgPercentage >= 90) averageGrade = 'A+';
      else if (avgPercentage >= 85) averageGrade = 'A';
      else if (avgPercentage >= 80) averageGrade = 'A-';
      else if (avgPercentage >= 75) averageGrade = 'B+';
      else if (avgPercentage >= 70) averageGrade = 'B';
      else if (avgPercentage >= 65) averageGrade = 'B-';
      else if (avgPercentage >= 60) averageGrade = 'C+';
      else if (avgPercentage >= 55) averageGrade = 'C';
      else if (avgPercentage >= 50) averageGrade = 'C-';
      else averageGrade = 'F';
    }

    // Calculate unique subjects
    const subjects = new Set(allPerformances.map(p => p.subject));
    const totalSubjects = subjects.size;

    // Calculate pending fees
    const pendingFees = allFees
      .filter(fee => fee.paymentStatus !== PaymentStatus.Paid)
      .reduce((sum, fee) => sum + fee.amountDue, 0);

    // Calculate overdue amount
    const overdueAmount = allFees
      .filter(fee => fee.isOverdue)
      .reduce((sum, fee) => sum + fee.amountDue, 0);

    return {
      totalSubjects: totalSubjects || 0,
      averageGrade,
      totalExams: allPerformances.length,
      pendingFees,
      overdueAmount,
      recentPerformances: recentPerformances.slice(0, 5)
    };
  }, [allPerformances, allFees, recentPerformances]);

  const fetchStudentData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching student data for user:', user.email);

      // Fetch student data by email
      try {
        const studentData = await apiService.getStudentByEmail(user.email);
        setStudent(studentData);
        console.log('Student data fetched:', studentData);
      } catch (studentError) {
        console.warn('Student profile not found, continuing with limited data:', studentError);
        setStudent(null);
        // Don't set this as an error since the app should still work without student profile
      }

      // Fetch all performance data for metrics calculation
      try {
        const performanceResponse = await apiService.getStudentPerformances({
          page: 1,
          limit: 1000, // Get all performances for metrics
          sortBy: 'examDate',
          sortOrder: 'desc'
        });
        setAllPerformances(performanceResponse.data);
        setRecentPerformances(performanceResponse.data.slice(0, 5));
        console.log('Performance data fetched:', performanceResponse.data.length, 'records');
      } catch (performanceError) {
        console.warn('Could not fetch student performances:', performanceError);
        setAllPerformances([]);
        setRecentPerformances([]);
      }

      // Fetch all fees for metrics calculation
      try {
        const feesResponse = await apiService.getStudentFees({
          page: 1,
          limit: 1000, // Get all fees for metrics
          sortBy: 'dueDate',
          sortOrder: 'desc'
        });
        setAllFees(feesResponse.data);
        setRecentFees(feesResponse.data.slice(0, 5));
        console.log('Fee data fetched:', feesResponse.data.length, 'records');
      } catch (feesError) {
        console.warn('Could not fetch student fees:', feesError);
        setAllFees([]);
        setRecentFees([]);
      }

    } catch (err) {
      // Only set error for critical failures, not missing student profile
      const errorMessage = err instanceof Error ? err.message : 'Failed to load student data';
      if (!errorMessage.includes('Student not found') && !errorMessage.includes('404')) {
        setError(errorMessage);
        console.error('Error fetching student data:', err);
      } else {
        console.warn('Student profile not available:', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const refetch = async () => {
    await fetchStudentData();
  };

  return {
    student,
    metrics,
    recentPerformances,
    recentFees,
    isLoading,
    error,
    refetch
  };
};