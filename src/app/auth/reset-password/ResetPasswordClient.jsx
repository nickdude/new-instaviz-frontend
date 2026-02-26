"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { FormContainer } from '@/components/FormContainer';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { FormLink } from '@/components/FormLink';
import { Alert } from '@/components/Alert';
import { useAuth } from '@/hooks/useAuth';

export default function ResetPasswordClient({ token: initialToken }) {
  const router = useRouter();
  const { resetPassword, loading, error } = useAuth();
  const searchParams = useSearchParams();
  const [token, setToken] = useState(initialToken || '');
  const [tokenError, setTokenError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    // If server passed token use it, otherwise try client-side search params
    if (initialToken) {
      setToken(initialToken);
      setTokenError('');
      console.log('Reset token from server prop:', initialToken);
      return;
    }

    // client-side fallback for when token isn't passed from server
    try {
      const param = searchParams?.get ? searchParams.get('token') : null;
      console.log('Reset token from URL (client):', param);
      if (!param) {
        setTokenError('Invalid or missing reset token. Please request a new password reset.');
      } else {
        setToken(param);
      }
    } catch (err) {
      // if useSearchParams isn't available, show error
      setTokenError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [initialToken, searchParams]);

  const validateForm = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
    setSuccessMessage('');

    if (!validateForm()) return;

    try {
      await resetPassword(token, formData.password);
      setSuccessMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err) {
      setFormError(err.message || 'Failed to reset password. Please try again.');
    }
  };

  if (tokenError) {
    return (
      <FormContainer
        title="Invalid reset link"
        subtitle="The password reset link is invalid or has expired"
      >
        <Alert type="error" message={tokenError} />
        <FormLink
          text="Request a new reset link?"
          href="/auth/forgot-password"
          linkText="Click here"
        />
      </FormContainer>
    );
  }

  return (
    <FormContainer
      title="Create new password"
      subtitle="Enter your new password below"
    >
      {formError && <Alert type="error" message={formError} />}
      {successMessage && <Alert type="success" message={successMessage} />}
      {error && <Alert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="New Password"
          type="password"
          placeholder="Min. 8 character"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          name="password"
          error={fieldErrors.password}
          required
        />

        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          error={fieldErrors.confirmPassword}
          required
        />

        <FormButton type="submit" loading={loading} className="mt-6">
          Reset Password
        </FormButton>
      </form>

      <FormLink
        text="Remember your password?"
        href="/auth/login"
        linkText="Back to login"
      />
    </FormContainer>
  );
}
