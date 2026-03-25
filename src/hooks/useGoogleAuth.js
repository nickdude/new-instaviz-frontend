'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export function useGoogleAuth() {
  const router = useRouter();
  const { googleAuth, loading: authLoading, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Google SDK
  useEffect(() => {
    // Load Google SDK
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError(null);

      const { credential } = credentialResponse;
      if (!credential) {
        throw new Error('No credential received from Google');
      }

      // Call backend to authenticate with Google token
      const response = await googleAuth(credential);

      if (response?.success && response?.data?.token) {
        // Navigate to dashboard after successful login
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      console.error('Google sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const initGoogleButton = (elementId) => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
      });

      window.google.accounts.id.renderButton(document.getElementById(elementId), {
        theme: 'outline',
        size: 'large',
        width: '100%',
      });
    }
  };

  return {
    initGoogleButton,
    handleGoogleSignIn,
    isLoading: isLoading || authLoading,
    error: error || authError,
  };
}
