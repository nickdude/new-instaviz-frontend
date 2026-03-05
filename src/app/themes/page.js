'use server';

import { Suspense } from 'react';
import ThemesClient from './ThemesClient';

export default async function ThemesPage({ searchParams }) {
  const params = await searchParams;
  const templateId = params?.template_id || null;
  const templateLabel = params?.template_label || null;

  return (
    <Suspense fallback={<div className="p-8">Loading themes...</div>}>
      <ThemesClient templateId={templateId} templateLabel={templateLabel} />
    </Suspense>
  );
}

