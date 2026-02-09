'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useThemes } from '@/hooks/useThemes';
import { FormButton } from '@/components/FormButton';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, ArrowLeft } from 'lucide-react';

export default function ThemesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template_id');
  const templateLabel = searchParams.get('template_label');
  
  const { getThemesByTemplateId } = useThemes();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userRaw) {
      router.replace('/auth/login');
      return;
    }

    if (!templateId) {
      router.replace('/templates');
      return;
    }
    
    loadThemes();
  }, [router, templateId]);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const response = await getThemesByTemplateId(templateId);
      setThemes(response.data || []);
    } catch (err) {
      console.error('Failed to load themes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTheme = (theme) => {
    // Store selected template and theme, then navigate to profile creation
    if (typeof window !== 'undefined') {
      const selectedTemplate = localStorage.getItem('selectedTemplate');
      if (selectedTemplate) {
        const template = JSON.parse(selectedTemplate);
        localStorage.setItem('selectedTemplate', JSON.stringify({
          ...template,
          selectedTheme: theme,
        }));
      }
    }
    router.push('/profile/create');
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
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Templates
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Choose a Theme</h1>
              <p className="mt-2 text-sm text-gray-500">
                {templateLabel || 'Select a theme for your template'}
              </p>
            </div>
          </div>
        </div>

        {themes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Themes Available</h3>
              <p className="text-sm text-gray-500 mb-6">
                Themes could not be loaded for this template.
              </p>
              <FormButton onClick={loadThemes}>Retry</FormButton>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <Card key={theme.theme_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="h-36 rounded-xl overflow-hidden mb-4 border border-gray-200">
                    {theme.thumbnail || theme.preview ? (
                      <img
                        src={theme.thumbnail || theme.preview}
                        alt={theme.name || theme.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: theme.primary_color || theme.color || '#3B82F6' 
                        }}
                      >
                        <Palette size={48} className="text-white opacity-50" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {theme.name || theme.label || 'Theme'}
                  </h3>
                  {theme.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {theme.description}
                    </p>
                  )}
                  {theme.primary_color && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Primary:</span>
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.primary_color }}
                      />
                    </div>
                  )}
                  <FormButton 
                    onClick={() => handleUseTheme(theme)} 
                    className="mt-4 w-full"
                  >
                    Use Theme
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
