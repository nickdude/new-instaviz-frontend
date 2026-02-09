'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useThemes } from '@/hooks/useThemes';
import { useCards } from '@/hooks/useCards';
import { useProfiles } from '@/hooks/useProfiles';
import { UserNavbar } from '@/components/UserNavbar';
import { FormButton } from '@/components/FormButton';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, ArrowLeft, AlertCircle, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ThemesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template_id');
  const templateLabel = searchParams.get('template_label');
  
  const { getThemesByTemplateId } = useThemes();
  const { createCard } = useCards();
  const { getProfiles } = useProfiles();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewModal, setPreviewModal] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);

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

  // Handle keyboard navigation for preview modal
  useEffect(() => {
    if (!previewModal || !previewModal.images || previewModal.images.length <= 1) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPreviewIndex((prev) => (prev === 0 ? previewModal.images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPreviewIndex((prev) => (prev === previewModal.images.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'Escape') {
        setPreviewModal(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [previewModal, previewIndex]);

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

  const handleUseTheme = async (theme) => {
    try {
      setCreating(true);
      setToast(null);
      
      // Get the user's first profile
      const profilesResponse = await getProfiles();
      const profiles = profilesResponse.data || [];
      
      if (profiles.length === 0) {
        setToast({
          type: 'error',
          message: 'Please create a profile first'
        });
        setTimeout(() => router.push('/profile/create'), 1500);
        return;
      }
      
      // Use the first profile
      const profileId = profiles[0]._id;
      
      // Create the card automatically
      await createCard({
        profileId,
        templateId,
        themeId: theme.theme_id,
      });
      
      setToast({
        type: 'success',
        message: 'Card created successfully!'
      });
      
      // Redirect to cards list after short delay
      setTimeout(() => router.push('/cards'), 1500);
    } catch (err) {
      console.error('Failed to create card:', err);
      
      // Handle different error types with detailed messages
      let message = 'Failed to create card. Please try again.';
      
      if (err.message) {
        if (err.message.includes('already exists')) {
          message = 'A card with this contact number already exists. Please update your profile with a different number.';
        } else if (err.message.includes('Validation error')) {
          message = 'Some required fields are missing in your profile. Please complete your profile and try again.';
        } else {
          message = err.message;
        }
      }
      
      setToast({
        type: 'error',
        message
      });
    } finally {
      setCreating(false);
    }
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UserNavbar />
      
      {/* Toast Notifications */}
      {toast && (
        <div className="fixed top-4 right-4 max-w-md z-50 animate-in slide-in-from-top">
          <div className={`${toast.type === 'error' ? 'bg-red-50 border-red-200 border-2' : 'bg-green-50 border-green-200 border-2'} rounded-lg p-4`}>
            <div className="flex items-start gap-3">
              {toast.type === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={toast.type === 'error' ? 'text-red-800 text-sm' : 'text-green-800 text-sm'}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
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
            {themes.map((theme) => {
              // Map API response fields consistently
              const previewImages = theme.previews || [];
              const previewImage = previewImages[0] || theme.thumbnail || theme.preview || null;
              const themeName = theme.description || theme.name || theme.label || 'Theme';
              const hasMultiplePreviews = previewImages.length > 1;
              
              return (
                <Card key={theme.theme_id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div 
                      className="h-48 rounded-xl overflow-hidden mb-4 border border-gray-200 bg-gray-50 cursor-pointer group relative"
                      onClick={() => {
                        setPreviewModal({ images: previewImages, name: themeName });
                        setPreviewIndex(0);
                      }}
                    >
                      {previewImage ? (
                        <>
                          <img
                            src={previewImage}
                            alt={themeName}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded">
                              {hasMultiplePreviews ? `Click to view all (${previewImages.length})` : 'Click to view full screen'}
                            </span>
                          </div>
                          {hasMultiplePreviews && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                              1 / {previewImages.length}
                            </div>
                          )}
                        </>
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
                      {themeName}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      ID: {theme.theme_id}
                    </p>
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
                      disabled={creating}
                    >
                      {creating ? 'Creating Card...' : 'Use Theme'}
                    </FormButton>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Screen Preview Modal */}
      {previewModal && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setPreviewModal(null)}
        >
          <button
            onClick={() => setPreviewModal(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>
          
          <div className="max-w-6xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-white text-xl font-semibold mb-4">
              {previewModal.name}
            </h3>
            
            <div className="relative w-full h-full flex items-center justify-center group">
              {previewModal.images && previewModal.images.length > 0 ? (
                <>
                  <img
                    src={previewModal.images[previewIndex]}
                    alt={`${previewModal.name} - Preview ${previewIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  {previewModal.images.length > 1 && (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewIndex((prev) => (prev === 0 ? previewModal.images.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      
                      {/* Next Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewIndex((prev) => (prev === previewModal.images.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={24} />
                      </button>
                      
                      {/* Preview Counter */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {previewIndex + 1} / {previewModal.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img
                  src={previewModal.image}
                  alt={previewModal.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              Click anywhere outside or press X to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
