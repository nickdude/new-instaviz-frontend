'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/hooks/useTemplates';
import { UserNavbar } from '@/components/UserNavbar';
import { FormButton } from '@/components/FormButton';
import { Card, CardContent } from '@/components/ui/card';
import { FileImage, ArrowLeft } from 'lucide-react';

export default function TemplatesClient({ profileType: initialProfileType, layout: initialLayout }) {
  const router = useRouter();
  const { getTemplates } = useTemplates();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState('');
  const [layout, setLayout] = useState('');

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userRaw) {
      router.replace('/auth/login');
      return;
    }

    // Get profile type and layout from props or localStorage
    const storedType = initialProfileType || (typeof window !== 'undefined' ? localStorage.getItem('profileType') : null);
    const storedLayout = initialLayout || (typeof window !== 'undefined' ? localStorage.getItem('layout') : null);
    
    if (storedType) {
      setProfileType(storedType);
      if (typeof window !== 'undefined') {
        localStorage.setItem('profileType', storedType);
      }
    }
    
    if (storedLayout) {
      setLayout(storedLayout);
      if (typeof window !== 'undefined') {
        localStorage.setItem('layout', storedLayout);
      }
    }
    
    loadTemplates();
  }, [router, initialProfileType, initialLayout]);

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

  const getFilteredTemplates = () => {
    let filtered = templates;

    // Filter by profile type
    if (profileType) {
      if (profileType === 'student') {
        filtered = filtered.filter(t => t.template_id.startsWith('student_'));
      } else if (profileType === 'professional') {
        filtered = filtered.filter(t => t.template_id.startsWith('pro_'));
      }
    }

    // Filter by layout (based on screen count)
    if (layout) {
      if (layout === 'single') {
        filtered = filtered.filter(t => t.screen_count === 1);
      } else if (layout === 'double' || layout === 'double-products' || layout === 'double-enquiry') {
        filtered = filtered.filter(t => t.screen_count === 2);
      } else if (layout === 'triple') {
        filtered = filtered.filter(t => t.screen_count === 3);
      }
    }

    return filtered;
  };

  const handleUseTemplate = (template) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTemplate', JSON.stringify(template));
    }
    router.push(`/themes?template_id=${template.template_id}&template_label=${encodeURIComponent(template.label)}`);
  };

  const filteredTemplates = getFilteredTemplates();
  const typeLabel = profileType === 'student' ? 'Student' : profileType === 'professional' ? 'Professional' : 'All';
  const layoutLabel = layout ? ` - ${layout.charAt(0).toUpperCase() + layout.slice(1).replace(/-/g, ' ')}` : '';
  const screenCount = layout === 'single' ? ' (1 Screen)' : layout === 'double' || layout === 'double-products' || layout === 'double-enquiry' ? ' (2 Screens)' : layout === 'triple' ? ' (3 Screens)' : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <UserNavbar />
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UserNavbar />
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-6 mb-6">
            <button
              onClick={() => router.back()}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition flex-shrink-0 mt-1"
              title="Go back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">{typeLabel} Templates{layoutLabel}</h1>
              <p className="mt-1.5 text-sm text-gray-600">Choose a template to get started{screenCount}</p>
            </div>
            <FormButton 
              onClick={() => router.push('/my-card')} 
              className="!w-auto !px-4 !py-2 text-sm whitespace-nowrap flex-shrink-0"
              fullWidth={false}
            >
              My Cards
            </FormButton>
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.template_id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-40 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden mb-4">
                    <div className="text-center">
                      <FileImage size={48} className="text-blue-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-600 font-medium">
                        {template.screen_count} {template.screen_count === 1 ? 'Screen' : 'Screens'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 flex-1">
                    {template.label}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 mb-4">
                    {template.screens.map(screen => screen.charAt(0).toUpperCase() + screen.slice(1)).join(' + ')}
                  </p>
                  <FormButton 
                    onClick={() => handleUseTemplate(template)} 
                    className="w-full mt-auto"
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
