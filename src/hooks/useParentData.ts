import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './useAuth';
import type { Parent, Student } from '../types/user';
import type { ParentMetrics } from '../types/api';

interface UseParentDataReturn {
  parent: Parent | null;
  children: Student[];
  selectedChild: Student | null;
  metrics: ParentMetrics | null;
  isLoading: boolean;
  error: string | null;
  fetchParentData: () => Promise<void>;
  selectChild: (child: Student | null) => void;
  refreshData: () => Promise<void>;
}

export const useParentData = (): UseParentDataReturn => {
  const { user } = useAuth();
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChild, setSelectedChild] = useState<Student | null>(null);
  const [metrics, setMetrics] = useState<ParentMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParentData = useCallback(async () => {
    if (!user?.email) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current user's parent profile using the dedicated endpoint
      console.log('Fetching parent profile for user:', user.email);
      const currentParent = await apiService.getCurrentUserParentProfile();

      if (!currentParent) {
        setError('Parent profile not found for current user');
        return;
      }

      console.log('Parent profile loaded:', currentParent);
      console.log('Parent childrenCount:', currentParent.childrenCount);
      console.log('Parent children array:', currentParent.children);
      setParent(currentParent);

      // Get detailed student information for all children using parent-specific endpoint
      let childrenData: Student[] = [];
      try {
        console.log('Fetching children for parent ID:', currentParent.id);
        childrenData = await apiService.getStudentsByParentId(currentParent.id);
        console.log('Children loaded:', childrenData);
      } catch (err) {
        console.warn('Failed to fetch children details:', err);
        // Fallback to basic info from parent profile if available
        if (currentParent.children && currentParent.children.length > 0) {
          console.log('Using fallback children data from parent profile');
          childrenData = currentParent.children.map(child => ({
            id: child.id,
            firstName: child.firstName,
            lastName: child.lastName,
            email: 'Not available',
            phoneNumber: 'Not available',
            dateOfBirth: '',
            address: '',
            gender: 0,
            rollNumber: child.rollNumber,
            enrollmentDate: child.enrollmentDate,
            status: child.status,
            grade: child.grade || '',
            section: child.section || '',
            userId: undefined,
            parentId: currentParent.id,
            fullName: child.fullName,
            age: child.age,
            isEnrolled: child.isEnrolled,
            assignedFaculties: [],
            createdAt: '',
            updatedAt: ''
          }));
        }
      }

      setChildren(childrenData);

      // Update parent with correct children count if it's different
      if (currentParent.childrenCount !== childrenData.length) {
        const updatedParent = {
          ...currentParent,
          childrenCount: childrenData.length
        };
        console.log('Updating parent with correct children count:', childrenData.length);
        setParent(updatedParent);
      }

      // Set first child as selected by default if no child is selected
      if (childrenData.length > 0 && !selectedChild) {
        setSelectedChild(childrenData[0]);
      }

      // Get parent metrics from backend using the new current user endpoint
      try {
        console.log('Fetching parent metrics for current user...');
        const parentMetrics = await apiService.getCurrentUserParentMetrics();
        console.log('Parent metrics loaded:', parentMetrics);
        setMetrics(parentMetrics);
      } catch (err) {
        console.warn('Failed to fetch parent metrics:', err);
        // Fallback to basic metrics with actual children count
        const actualChildrenCount = childrenData.length;
        console.log('Using fallback metrics with children count:', actualChildrenCount);
        setMetrics({
          totalChildren: actualChildrenCount,
          childrenWithOverdueFees: 0,
          totalOverdueAmount: 0,
          recentPerformances: []
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch parent data';
      setError(errorMessage);
      console.error('Error fetching parent data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email, selectedChild]);

  const selectChild = useCallback((child: Student | null) => {
    setSelectedChild(child);
  }, []);

  const refreshData = useCallback(async () => {
    await fetchParentData();
  }, [fetchParentData]);

  // Fetch data on mount and when user changes
  useEffect(() => {
    if (user?.email) {
      fetchParentData();
    }
  }, [user?.email, fetchParentData]);

  return {
    parent,
    children,
    selectedChild,
    metrics,
    isLoading,
    error,
    fetchParentData,
    selectChild,
    refreshData,
  };
};