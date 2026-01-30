'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/hooks/useProfiles';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, User, Briefcase } from 'lucide-react';

export default function MyProfilesPage() {
  const router = useRouter();
  const { getProfiles, deleteProfile, toggleProfileStatus } = useProfiles();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userRaw) {
      router.replace('/auth/login');
      return;
    }
    loadProfiles();
  }, [router]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const response = await getProfiles();
      setProfiles(response.data || []);
    } catch (err) {
      console.error('Failed to load profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (profileId) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    
    try {
      setActionLoading((prev) => ({ ...prev, [`delete-${profileId}`]: true }));
      await deleteProfile(profileId);
      await loadProfiles();
    } catch (err) {
      console.error('Failed to delete profile:', err);
      alert('Failed to delete profile. Please try again.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`delete-${profileId}`]: false }));
    }
  };

  const handleToggle = async (profileId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [`toggle-${profileId}`]: true }));
      await toggleProfileStatus(profileId);
      await loadProfiles();
    } catch (err) {
      console.error('Failed to toggle profile status:', err);
      alert('Failed to update profile status. Please try again.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`toggle-${profileId}`]: false }));
    }
  };

  const getLayoutDescription = (layout) => {
    const layouts = {
      single: 'Contact Info Only',
      double: 'Two Pages',
      'double-products': 'Contact + Products',
      'double-enquiry': 'Contact + Enquiry',
      triple: 'Contact + Products + Enquiry',
    };
    return layouts[layout] || layout;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
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
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profiles</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your digital card profiles</p>
          </div>
          <Button onClick={() => router.push('/profile/create')} className="flex items-center gap-2">
            <Plus size={18} />
            Create New Profile
          </Button>
        </div>

        {/* Profiles Grid */}
        {profiles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Profiles Yet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Create your first digital card profile to get started
              </p>
              <Button onClick={() => router.push('/profile/create')}>
                Create Your First Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <Card key={profile._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Profile Type Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {profile.profileType === 'student' ? (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-blue-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Briefcase size={20} className="text-purple-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {profile.profileType}
                        </h3>
                        <p className="text-xs text-gray-500">{getLayoutDescription(profile.layout)}</p>
                      </div>
                    </div>
                    <Badge variant={profile.isActive ? 'default' : 'secondary'}>
                      {profile.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-4 space-y-1">
                    <p className="text-sm font-medium text-gray-900">{profile.contactInfo?.name}</p>
                    <p className="text-xs text-gray-600">{profile.contactInfo?.email}</p>
                    <p className="text-xs text-gray-600">{profile.contactInfo?.phone}</p>
                  </div>

                  {/* Additional Info */}
                  {profile.profileType === 'student' && profile.studentDetails?.skills && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.studentDetails.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {profile.studentDetails.skills.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{profile.studentDetails.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {profile.profileType === 'professional' && profile.products?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500">
                        {profile.products.length} Product{profile.products.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleToggle(profile._id)}
                      disabled={actionLoading[`toggle-${profile._id}`]}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                    >
                      {profile.isActive ? (
                        <ToggleRight size={16} />
                      ) : (
                        <ToggleLeft size={16} />
                      )}
                      {actionLoading[`toggle-${profile._id}`] ? 'Wait...' : 'Toggle'}
                    </button>
                    <button
                      onClick={() => router.push(`/profile/edit/${profile._id}`)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(profile._id)}
                      disabled={actionLoading[`delete-${profile._id}`]}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {actionLoading[`delete-${profile._id}`] ? 'Wait...' : 'Delete'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
