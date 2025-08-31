import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './useAuth';
import type { Student, StudentPerformance, StudentFee } from '../types/user';
import type { StudentMetrics } from '../types/api';

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
  const [metrics, setMetrics] = useState<StudentMetrics | null>(null);
  const [recentPerformances, setRecentPerformances] = useState<StudentPerformance[]>([]);
  const [recentFees, setRecentFees] = useState<StudentFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch student data by email
      const studentData = await apiService.getStudentByEmail(user.email);
      setStudent(studentData);

      // Fetch student metrics using the student ID
      try {
        const metricsData = await apiService.getStudentMetrics(studentData.id);
        setMetrics(metricsData);
        setRecentPerformances(metricsData.recentPerformances || []);
      } catch (metricsError) {
        console.warn('Could not fetch student metrics:', metricsError);
        // Set empty metrics if not available
        setMetrics(null);
        setRecentPerformances([]);
      }

      // Fetch recent fees for current user (backend automatically filters by current user for students)
      try {
        const feesResponse = await apiService.getStudentFees({
          page: 1,
          limit: 5,
          sortBy: 'dueDate',
          sortOrder: 'desc'
        });
        setRecentFees(feesResponse.data);
      } catch (feesError) {
        console.warn('Could not fetch student fees:', feesError);
        setRecentFees([]);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load student data';
      setError(errorMessage);
      console.error('Error fetching student data:', err);
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