import { Suspense } from 'react';
import ThemesClient from './ThemesClient';

export default function ThemesPage({ searchParams }) {
  const templateId = searchParams?.template_id || null;
  const templateLabel = searchParams?.template_label || null;

  return (
    <Suspense fallback={<div className="min-h-screen p-8">Loading...</div>}>
      <ThemesClient templateId={templateId} templateLabel={templateLabel} />
    </Suspense>
  );
}
