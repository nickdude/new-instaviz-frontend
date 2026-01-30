'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscriptions } from '@/hooks/useSubscriptions';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { getActiveSubscription } = useSubscriptions();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const run = async () => {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

      if (!storedUser) {
        router.replace('/auth/login');
        return;
      }

      const user = JSON.parse(storedUser);

      if (user?.userType === 'admin') {
        router.replace('/admin/dashboard');
        return;
      }

      try {
        const response = await getActiveSubscription();
        const hasActive = Boolean(response?.data);
        router.replace(hasActive ? '/templates' : '/plans');
      } catch (err) {
        router.replace('/plans');
      } finally {
        setChecking(false);
      }
    };

    run();
  }, [getActiveSubscription, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">Checking your account...</p>
    </div>
  );
}
