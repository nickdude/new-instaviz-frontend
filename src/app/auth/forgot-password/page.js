'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import { FormContainer } from '@/components/FormContainer';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { FormLink } from '@/components/FormLink';
import { Alert } from '@/components/Alert';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    try {
      await forgotPassword(email);
      setSuccessMessage('Password reset link has been sent to your email. Please check your inbox.');
      setIsSubmitted(true);
    } catch (err) {
      setEmailError(err.message || 'Failed to send reset link. Please try again.');
    }
  };

  if (isSubmitted && successMessage) {
    return (
      <FormContainer
        title="Check your email"
        subtitle="We've sent a password reset link to your email address"
      >
        <div className="space-y-6">
          <Alert
            type="success"
            title="Email sent"
            message={successMessage}
          />

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <FormButton
              variant="secondary"
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
            >
              Try again
            </FormButton>
          </div>

          <FormLink
            text="Remember your password?"
            href="/auth/login"
            linkText="Back to login"
          />
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
    >
      {error && <Alert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          placeholder="name@email.com"
          icon={Mail}
          value={email}
          onChange={handleChange}
          error={emailError}
          required
        />

        <FormButton type="submit" loading={loading} className="mt-6">
          Send reset link
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
