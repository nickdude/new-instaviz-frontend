import { Suspense } from 'react';
import TemplatesClient from './TemplatesClient';

export default async function TemplatesPage({ searchParams }) {
  const params = await searchParams;
  const profileType = params?.profileType || null;
  const layout = params?.layout || null;

  return (
    <Suspense fallback={<div className="min-h-screen p-8">Loading...</div>}>
      <TemplatesClient profileType={profileType} layout={layout} />
    </Suspense>
  );
}
