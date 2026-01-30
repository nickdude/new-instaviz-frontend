'use client';

import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (endpoint, method = 'GET', body = null) => {
    try {
      setError(null);
      setLoading(true);

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Add auth token if available
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
  };

  const register = async (name, email, password) => {
    const response = await apiCall('/api/auth/register', 'POST', {
      name,
      email,
      password,
      userType: 'user',
    });

    return response;
  };

  const login = async (email, password) => {
    const response = await apiCall('/api/auth/login', 'POST', {
      email,
      password,
    });

    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  };

  const forgotPassword = async (email) => {
    return await apiCall('/api/auth/forgot', 'POST', { email });
  };

  const resetPassword = async (token, password) => {
    return await apiCall(`/api/auth/reset/${token}`, 'POST', { password });
  };

  const verifyEmail = async (token) => {
    return await apiCall(`/api/auth/verify/${token}`, 'GET');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return {
    loading,
    error,
    register,
    login,
    forgotPassword,
    resetPassword,
    verifyEmail,
    logout,
  };
}
