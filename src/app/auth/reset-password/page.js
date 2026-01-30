'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { FormContainer } from '@/components/FormContainer';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { FormLink } from '@/components/FormLink';
import { Alert } from '@/components/Alert';
import { useAuth } from '@/hooks/useAuth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, loading, error } = useAuth();
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setTokenError('Invalid or missing reset token. Please request a new password reset.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

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
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword(token, formData.password);
      setSuccessMessage('Password reset successful! Redirecting to login...');
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
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
        {/* Password Field */}
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

        {/* Confirm Password Field */}
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

        {/* Submit Button */}
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
