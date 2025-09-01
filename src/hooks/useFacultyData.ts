import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Faculty, Student } from '../types/user';
import type { FacultyMetrics } from '../types/api';
import { useAuth } from './useAuth';

export interface FacultyData {
  profile: Faculty | null;
  metrics: FacultyMetrics | null;
  assignedStudents: Student[];
  loading: boolean;
  error: string | null;
}

export const useFacultyData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<FacultyData>({
    profile: null,
    metrics: null,
    assignedStudents: [],
    loading: true,
    error: null,
  });

  const fetchFacultyData = async () => {
    if (!user?.email) {
      setData(prev => ({ ...prev, loading: false, error: 'User not authenticated' }));
      return;
    }

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Get faculty profile by email
      const profile = await apiService.getFacultyByEmail(user.email);
      
      // Get faculty metrics
      const metrics = await apiService.getFacultyMetrics(profile.id);
      
      // Get assigned students using the faculty-specific endpoint
      const assignedStudents = await apiService.getFacultyStudents(profile.id);

      setData({
        profile,
        metrics,
        assignedStudents,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch faculty data',
      }));
    }
  };

  const refreshData = () => {
    fetchFacultyData();
  };

  useEffect(() => {
    fetchFacultyData();
  }, [user?.email]);

  return {
    ...data,
    refreshData,
  };
};