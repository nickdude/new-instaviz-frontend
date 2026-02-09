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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile</label>
            <select
              name="profileId"
              value={formData.profileId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select profile</option>
              {profiles.map((profile) => (
                <option key={profile._id} value={profile._id}>
                  {profile.contactInfo?.name || 'Profile'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
            <select
              name="templateId"
              value={formData.templateId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select template</option>
              {templates.map((template) => (
                <option key={template.template_id} value={template.template_id}>
                  {template.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              name="themeId"
              value={formData.themeId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!formData.templateId}
            >
              <option value="">Select theme</option>
              {themes.map((theme) => (
                <option key={theme.theme_id} value={theme.theme_id}>
                  {theme.name || theme.label || theme.theme_id}
                </option>
              ))}
            </select>
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
