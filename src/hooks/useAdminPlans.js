'use client';

import { useCallback, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export function useAdminPlans() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (endpoint, method = 'GET', body = null) => {
    try {
      setError(null);
      setLoading(true);

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlans = useCallback(async () => {
    return await apiCall('/api/plans');
  }, [apiCall]);

  const createPlan = useCallback(async (planData) => {
    return await apiCall('/api/plans', 'POST', planData);
  }, [apiCall]);

  const updatePlan = useCallback(async (planId, planData) => {
    return await apiCall(`/api/plans/${planId}`, 'PUT', planData);
  }, [apiCall]);

  const deletePlan = useCallback(async (planId) => {
    return await apiCall(`/api/plans/${planId}`, 'DELETE');
  }, [apiCall]);

  const togglePlanStatus = useCallback(async (planId) => {
    return await apiCall(`/api/plans/${planId}/toggle`, 'PATCH');
  }, [apiCall]);

  return {
    loading,
    error,
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
  };
}
