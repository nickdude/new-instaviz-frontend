'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { FormContainer } from '@/components/FormContainer';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';
import { Divider } from '@/components/Divider';
import { FormLink } from '@/components/FormLink';
import { Alert } from '@/components/Alert';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, googleAuth, loading, error } = useAuth();
  const [formError, setFormError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Initialize Google OAuth
  useEffect(() => {
    const initializeGoogle = async () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleGoogleSuccess,
          });

          const googleButton = document.getElementById('googleSignInButton');
          if (googleButton) {
            googleButton.innerHTML = '';
            const buttonWidth = Math.max(280, Math.floor(googleButton.offsetWidth || 320));
            window.google.accounts.id.renderButton(googleButton, {
              theme: 'outline',
              size: 'large',
              width: buttonWidth,
            });
          }
        } catch (err) {
          console.error('Failed to initialize Google:', err);
        }
      }
    };

    // Check if script is loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    } else {
      initializeGoogle();
    }

    return () => {
      // Cleanup
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      setFormError('');

      const token = credentialResponse.credential;
      if (!token) {
        throw new Error('No credential received from Google');
      }

      // Call backend to authenticate with Google token
      const response = await googleAuth(token);

      if (response?.data?.token) {
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      }
    } catch (err) {
      setFormError(err.message || 'Google sign-in failed');
      console.error('Google sign-in error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <FormContainer
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          &larr; Back to Home
        </button>
      </div>
      {(formError || error) && (
        <Alert type="error" message={formError || error} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email Field */}
        <FormInput
          label="Email"
          type="email"
          placeholder="name@email.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          name="email"
          error={fieldErrors.email}
          required
        />

        {/* Password Field */}
        <FormInput
          label="Password"
          type="password"
          placeholder="Min. 8 character"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          name="password"
          error={fieldErrors.password}
          required
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <FormLink
            text=""
            href="/auth/forgot-password"
            linkText="Forgot Password?"
          />
        </div>

        {/* Submit Button */}
        <FormButton type="submit" loading={loading || googleLoading} className="mt-6">
          Sign in
        </FormButton>

         {/* Google Auth */}
          <Divider />
        <div id="googleSignInButton" className="w-full" />

       
      </form>

      {/* Sign Up Link */}
      <FormLink text="Don't have an account?" href="/auth/register" linkText="Sign up" />
    </FormContainer>
  );
}
