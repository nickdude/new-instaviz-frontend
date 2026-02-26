import { Suspense } from 'react';
import TemplatesClient from './TemplatesClient';

export default function TemplatesPage({ searchParams }) {
  const profileType = searchParams?.profileType || null;
  const layout = searchParams?.layout || null;

  return (
    <Suspense fallback={<div className="min-h-screen p-8">Loading...</div>}>
      <TemplatesClient profileType={profileType} layout={layout} />
    </Suspense>
  );
}
