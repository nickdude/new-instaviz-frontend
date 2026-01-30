'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { FormContainer } from '@/components/FormContainer';
import { FormButton } from '@/components/FormButton';
import { Alert } from '@/components/Alert';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, loading } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const tokenParam = searchParams.get('token');
        
        if (!tokenParam) {
          setStatus('error');
          setMessage('Invalid or missing verification token. Please check your email for the correct link.');
          return;
        }

        setToken(tokenParam);
        await verifyEmail(tokenParam);
        setStatus('success');
        setMessage('Email verified successfully! You can now log in to your account.');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Email verification failed. Please try again or request a new verification link.');
      }
    };

    verifyToken();
  }, [searchParams, verifyEmail]);

  if (status === 'verifying') {
    return (
      <FormContainer
        title="Verifying your email"
        subtitle="Please wait while we verify your email address..."
      >
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </FormContainer>
    );
  }

  if (status === 'success') {
    return (
      <FormContainer
        title="Email verified"
        subtitle="Your email has been successfully verified"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <Alert
            type="success"
            title="Verification successful"
            message={message}
          />

          <FormButton
            onClick={() => router.push('/auth/login')}
            className="w-full"
          >
            Go to login
          </FormButton>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer
      title="Verification failed"
      subtitle="We couldn't verify your email"
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-red-600" />
        </div>

        <Alert
          type="error"
          title="Verification error"
          message={message}
        />

        <div className="space-y-3">
          <FormButton
            variant="secondary"
            onClick={() => router.push('/auth/register')}
            className="w-full"
          >
            Request new verification
          </FormButton>

          <FormButton
            variant="outline"
            onClick={() => router.push('/auth/login')}
            className="w-full"
          >
            Back to login
          </FormButton>
        </div>
      </div>
    </FormContainer>
  );
}
