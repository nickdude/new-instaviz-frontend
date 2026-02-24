'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCards } from '@/hooks/useCards';
import { UserNavbar } from '@/components/UserNavbar';
import { useProfiles } from '@/hooks/useProfiles';
import { useTemplates } from '@/hooks/useTemplates';
import { useThemes } from '@/hooks/useThemes';
import { FormButton } from '@/components/FormButton';
import { Card, CardContent } from '@/components/ui/card';

export default function EditCardPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id;

  const { getCardById, updateCard, loading: saving } = useCards();
  const { getProfiles } = useProfiles();
  const { getTemplates } = useTemplates();
  const { getThemesByTemplateId } = useThemes();

  const [profiles, setProfiles] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    profileId: '',
    templateId: '',
    themeId: ''
  });

  const selectedProfile = useMemo(() => {
    return profiles.find((profile) => profile._id === formData.profileId) || null;
  }, [profiles, formData.profileId]);

  const filteredTemplates = useMemo(() => {
    if (!selectedProfile) return [];

    let filtered = templates;
    const profileType = selectedProfile.profileType;
    const layout = selectedProfile.layout;

    if (profileType === 'student') {
      filtered = filtered.filter((t) => t.template_id?.startsWith('student_'));
    } else if (profileType === 'professional') {
      filtered = filtered.filter((t) => t.template_id?.startsWith('pro_'));
    }

    if (layout === 'single') {
      filtered = filtered.filter((t) => t.screen_count === 1);
    } else if (layout === 'double' || layout === 'double-products' || layout === 'double-enquiry') {
      filtered = filtered.filter((t) => t.screen_count === 2);
    } else if (layout === 'triple') {
      filtered = filtered.filter((t) => t.screen_count === 3);
    }

    return filtered;
  }, [templates, selectedProfile]);

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userRaw) {
      router.replace('/auth/login');
      return;
    }

    loadData();
  }, [router, cardId]);

  useEffect(() => {
    if (formData.templateId) {
      loadThemes(formData.templateId);
    } else {
      setThemes([]);
      setFormData((prev) => ({ ...prev, themeId: '' }));
    }
  }, [formData.templateId]);

  useEffect(() => {
    if (!formData.profileId) return;
    if (!formData.templateId) return;

    const isTemplateValid = filteredTemplates.some(
      (template) => template.template_id === formData.templateId
    );

    if (!isTemplateValid) {
      setFormData((prev) => ({ ...prev, templateId: '', themeId: '' }));
    }
  }, [formData.profileId, formData.templateId, filteredTemplates]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cardResponse, profilesResponse, templatesResponse] = await Promise.all([
        getCardById(cardId),
        getProfiles(),
        getTemplates()
      ]);

      const card = cardResponse.data;
      setProfiles(profilesResponse.data || []);
      setTemplates(templatesResponse.data || []);
      setFormData({
        profileId: card.profileId,
        templateId: card.templateId,
        themeId: card.themeId
      });
    } catch (err) {
      console.error('Failed to load card:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadThemes = async (templateId) => {
    try {
      const response = await getThemesByTemplateId(templateId);
      setThemes(response.data || []);
    } catch (err) {
      console.error('Failed to load themes:', err);
      setThemes([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = useMemo(() => {
    return formData.profileId && formData.templateId && formData.themeId;
  }, [formData]);

  const handleUpdate = async () => {
    try {
      await updateCard(cardId, {
        profileId: formData.profileId,
        templateId: formData.templateId,
        themeId: formData.themeId
      });
      router.push(`/cards/${cardId}`);
    } catch (err) {
      console.error('Failed to update card:', err);
      alert('Failed to update card. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <Card className="animate-pulse">
            <CardContent className="p-8">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UserNavbar />
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Card</h1>
          <p className="mt-2 text-sm text-gray-500">Update your card details and regenerate.</p>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Profile</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedProfile?.contactInfo?.name || 'Profile'}
                </p>
              </div>
              {selectedProfile && (
                <span className="text-xs text-gray-500">
                  {selectedProfile.profileType === 'student' ? 'Student' : 'Professional'} • {selectedProfile.layout}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Template</label>
            </div>

            {!formData.profileId ? (
              <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                Select a profile to see templates
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                No templates available for this profile
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.template_id}
                    className={`cursor-pointer transition-all overflow-hidden ${
                      formData.templateId === template.template_id
                        ? 'border-blue-600 ring-2 ring-blue-600'
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        templateId: template.template_id,
                        themeId: ''
                      }))
                    }
                  >
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="h-32 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden mb-3">
                        <div className="text-center">
                          <span className="text-xs text-gray-600 font-medium">
                            {template.screen_count} {template.screen_count === 1 ? 'Screen' : 'Screens'}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 flex-1">
                        {template.label}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {template.screens?.map((screen) => screen.charAt(0).toUpperCase() + screen.slice(1)).join(' + ')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            {!formData.templateId ? (
              <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                Select a template to see themes
              </div>
            ) : themes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                No themes available for this template
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {themes.map((theme) => {
                  const previewImages = theme.previews || [];
                  const previewImage = previewImages[0] || theme.thumbnail || theme.preview || null;
                  const themeName = theme.description || theme.name || theme.label || 'Theme';

                  return (
                    <Card
                      key={theme.theme_id}
                      className={`cursor-pointer transition-all overflow-hidden ${
                        formData.themeId === theme.theme_id
                          ? 'border-blue-600 ring-2 ring-blue-600'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          themeId: theme.theme_id
                        }))
                      }
                    >
                      <CardContent className="p-4">
                        <div className="h-32 rounded-xl overflow-hidden mb-3 border border-gray-200 bg-gray-50">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt={themeName}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div
                              className="w-full h-full"
                              style={{ backgroundColor: theme.primary_color || theme.color || '#3B82F6' }}
                            />
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {themeName}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          ID: {theme.theme_id}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <FormButton
            onClick={handleUpdate}
            disabled={!isFormValid || saving}
            className="w-full"
          >
            {saving ? 'Updating Card...' : 'Update Card'}
          </FormButton>
        </div>
      </div>
    </div>
  );
}
