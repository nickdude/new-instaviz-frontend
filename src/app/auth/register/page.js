'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User, Lock, Phone, Building2 } from 'lucide-react';
import { FormContainer } from '@/components/FormContainer';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';
import { Divider } from '@/components/Divider';
import { FormLink } from '@/components/FormLink';
import { Alert } from '@/components/Alert';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error } = useAuth();
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

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
      await register(formData.name, formData.email, formData.password);
      setSuccessMessage('Registration successful! Please verify your email to login.');
      setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <FormContainer
      title="Create your account"
      subtitle="Save your digital card so you can share it, edit it, and access it anytime"
    >
      {formError && <Alert type="error" message={formError} />}
      {successMessage && <Alert type="success" message={successMessage} />}
      {!formError && error && <Alert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Google Auth */}
        <GoogleAuthButton onClick={() => {}} loading={loading} />

        <Divider />

        {/* Name Field */}
        <FormInput
          label="Your Name"
          type="text"
          placeholder="Your name here"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          name="name"
          error={fieldErrors.name}
          required
        />

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

        {/* Phone Field (Optional) */}
        <FormInput
          label="Phone (Optional)"
          type="tel"
          placeholder="+919876543210"
          icon={Phone}
          value={formData.phone}
          onChange={handleChange}
          name="phone"
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

        {/* Terms and Privacy */}
        <div className="flex items-start gap-3 mt-6">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-5 h-5 mt-0.5 cursor-pointer accent-blue-600"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{' '}
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Terms and Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <FormButton type="submit" loading={loading} className="mt-6">
          Sign up
        </FormButton>
      </form>

      {/* Sign In Link */}
      <FormLink text="Already have an account?" href="/auth/login" linkText="Sign in" />
    </FormContainer>
  );
}
