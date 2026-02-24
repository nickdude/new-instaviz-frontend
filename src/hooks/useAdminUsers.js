'use client';

import { useCallback, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export function useAdminUsers() {
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
        // Ensure token is in Bearer format
        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        options.headers.Authorization = bearerToken;
      }

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error [${method} ${endpoint}]:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUsers = useCallback(async () => {
    return await apiCall('/api/users');
  }, [apiCall]);

  const getUserById = useCallback(async (id) => {
    return await apiCall(`/api/users/${id}`);
  }, [apiCall]);

  const updateUser = useCallback(async (id, userData) => {
    return await apiCall(`/api/users/${id}`, 'PUT', userData);
  }, [apiCall]);

  const deleteUser = useCallback(async (id) => {
    return await apiCall(`/api/users/${id}`, 'DELETE');
  }, [apiCall]);

  return {
    loading,
    error,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
  };
}
