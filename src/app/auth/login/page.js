'use client';

import { useState } from 'react';
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
  const { login, loading, error } = useAuth();
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

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
      {(formError || error) && (
        <Alert type="error" message={formError || error} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Google Auth */}
        <GoogleAuthButton onClick={() => {}} loading={loading} />

        <Divider />

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
        <FormButton type="submit" loading={loading} className="mt-6">
          Sign in
        </FormButton>
      </form>

      {/* Sign Up Link */}
      <FormLink text="Don't have an account?" href="/auth/register" linkText="Sign up" />
    </FormContainer>
  );
}
