'use client';

import { useCallback, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export function useProfiles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (endpoint, method = 'GET', body = null) => {
    try {
      setError(null);
      setLoading(true);

      const options = {
        method,
        headers: {},
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }

      if (body) {
        if (body instanceof FormData) {
          options.body = body;
        } else {
          options.headers['Content-Type'] = 'application/json';
          options.body = JSON.stringify(body);
        }
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

  const createProfile = useCallback(async (profileData) => {
    return await apiCall('/api/profiles', 'POST', profileData);
  }, [apiCall]);

  const getProfiles = useCallback(async () => {
    return await apiCall('/api/profiles');
  }, [apiCall]);

  const getProfileById = useCallback(async (profileId) => {
    return await apiCall(`/api/profiles/${profileId}`);
  }, [apiCall]);

  const updateProfile = useCallback(async (profileId, profileData) => {
    return await apiCall(`/api/profiles/${profileId}`, 'PUT', profileData);
  }, [apiCall]);

  const deleteProfile = useCallback(async (profileId) => {
    return await apiCall(`/api/profiles/${profileId}`, 'DELETE');
  }, [apiCall]);

  const toggleProfileStatus = useCallback(async (profileId) => {
    return await apiCall(`/api/profiles/${profileId}/toggle`, 'PATCH');
  }, [apiCall]);

  return {
    loading,
    error,
    createProfile,
    getProfiles,
    getProfileById,
    updateProfile,
    deleteProfile,
    toggleProfileStatus,
  };
}
