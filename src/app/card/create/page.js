import { Suspense } from 'react';
import CreateCardClient from './CreateCardClient';

export default function CreateCardPage({ searchParams }) {
  const presetTemplateId = searchParams?.get ? searchParams.get('template_id') : null;
  const presetThemeId = searchParams?.get ? searchParams.get('theme_id') : null;

  return (
    <Suspense fallback={<div className="min-h-screen p-8">Loading...</div>}>
      <CreateCardClient presetTemplateId={presetTemplateId} presetThemeId={presetThemeId} />
    </Suspense>
  );
}
