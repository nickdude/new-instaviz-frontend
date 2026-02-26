import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export default function ResetPasswordPage({ searchParams }) {
  const token = searchParams?.token || null;
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ResetPasswordClient token={token} />
    </Suspense>
  );
}
