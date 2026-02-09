'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/hooks/useTemplates';
import { FormButton } from '@/components/FormButton';
import { Card, CardContent } from '@/components/ui/card';
import { FileImage } from 'lucide-react';

export default function TemplatesPage() {
  const router = useRouter();
  const { getTemplates } = useTemplates();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userRaw) {
      router.replace('/auth/login');
      return;
    }
    
    loadTemplates();
  }, [router]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await getTemplates();
      setTemplates(response.data || []);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (template) => {
    // Store selected template and navigate to themes page
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTemplate', JSON.stringify(template));
    }
    router.push(`/themes?template_id=${template.template_id}&template_label=${encodeURIComponent(template.label)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-36 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Choose a Template</h1>
            <p className="mt-2 text-sm text-gray-500">Start building your digital or physical card.</p>
          </div>
          <FormButton onClick={() => router.push('/profile/create')} className="w-auto px-5">
            Create New
          </FormButton>
        </div>

        {templates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileImage size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Available</h3>
              <p className="text-sm text-gray-500 mb-6">
                Templates could not be loaded at the moment.
              </p>
              <FormButton onClick={loadTemplates}>Retry</FormButton>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.template_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="h-36 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden mb-4">
                    <div className="text-center">
                      <FileImage size={48} className="text-blue-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-600 font-medium">
                        {template.screen_count} {template.screen_count === 1 ? 'Screen' : 'Screens'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {template.label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {template.screens.map(screen => screen.charAt(0).toUpperCase() + screen.slice(1)).join(' + ')}
                  </p>
                  <FormButton 
                    onClick={() => handleUseTemplate(template)} 
                    className="mt-4 w-full"
                  >
                    Use Template
                  </FormButton>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
