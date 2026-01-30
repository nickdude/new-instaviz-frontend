'use client';

import { useCallback, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export function useSubscriptions() {
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

  const getActiveSubscription = useCallback(async () => {
    return await apiCall('/api/subscriptions/active');
  }, [apiCall]);

  const purchasePlan = useCallback(async (planId, currency) => {
    return await apiCall('/api/subscriptions/purchase', 'POST', { planId, currency });
  }, [apiCall]);

  const verifyPayment = useCallback(async (subscriptionId, orderId, paymentId, signature) => {
    return await apiCall('/api/subscriptions/verify', 'POST', {
      subscriptionId,
      orderId,
      paymentId,
      signature
    });
  }, [apiCall]);

  return {
    loading,
    error,
    getActiveSubscription,
    purchasePlan,
    verifyPayment,
  };
}
