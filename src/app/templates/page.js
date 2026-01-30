'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormButton } from '@/components/FormButton';

export default function TemplatesPage() {
  const router = useRouter();

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userRaw) {
      router.replace('/auth/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Choose a template</h1>
            <p className="mt-2 text-sm text-gray-500">Start building your digital or physical card.</p>
          </div>
          <FormButton className="w-auto px-5">Create New</FormButton>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {['Classic', 'Modern', 'Minimal'].map((template) => (
            <div key={template} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="h-36 rounded-xl bg-gray-100" />
              <h3 className="mt-4 text-base font-semibold text-gray-900">{template}</h3>
              <p className="mt-1 text-sm text-gray-500">A clean layout for professionals.</p>
              <FormButton className="mt-4">Use template</FormButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
