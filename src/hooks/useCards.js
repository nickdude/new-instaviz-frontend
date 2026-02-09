'use client';

import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export function useCards() {
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

  const createCard = async ({ profileId, templateId, themeId }) => {
    return await apiCall('/api/cards', 'POST', { profileId, templateId, themeId });
  };

  const getCards = async () => {
    return await apiCall('/api/cards', 'GET');
  };

  const getCardById = async (cardId) => {
    return await apiCall(`/api/cards/${cardId}`, 'GET');
  };

  const updateCard = async (cardId, payload) => {
    return await apiCall(`/api/cards/${cardId}`, 'PUT', payload);
  };

  return {
    loading,
    error,
    createCard,
    getCards,
    getCardById,
    updateCard,
  };
}
