'use client';

import { useCallback, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export function useOrders() {
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

  // Get all orders with optional filters
  const getOrders = useCallback(async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.cardType) queryParams.append('cardType', filters.cardType);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/api/orders${queryString ? `?${queryString}` : ''}`;
    
    return await apiCall(endpoint);
  }, [apiCall]);

  // Get single order by ID
  const getOrderById = useCallback(async (orderId) => {
    return await apiCall(`/api/orders/${orderId}`);
  }, [apiCall]);

  // Create new order
  const createOrder = useCallback(async (orderData) => {
    return await apiCall('/api/orders', 'POST', orderData);
  }, [apiCall]);

  // Update order (edit pending order details)
  const updateOrder = useCallback(async (orderId, updateData) => {
    return await apiCall(`/api/orders/${orderId}`, 'PUT', updateData);
  }, [apiCall]);

  // Delete order (pending orders only)
  const deleteOrder = useCallback(async (orderId) => {
    return await apiCall(`/api/orders/${orderId}`, 'DELETE');
  }, [apiCall]);

  // Update order status (admin only)
  const updateOrderStatus = useCallback(async (orderId, status, adminNotes = null) => {
    return await apiCall(`/api/orders/${orderId}/status`, 'PATCH', {
      status,
      adminNotes,
    });
  }, [apiCall]);

  // Get order statistics
  const getOrderStats = useCallback(async () => {
    return await apiCall('/api/orders/stats/summary');
  }, [apiCall]);

  return {
    loading,
    error,
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    getOrderStats,
  };
}
