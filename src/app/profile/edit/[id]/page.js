'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProfiles } from '@/hooks/useProfiles';
import { ProfileTypeSelector } from '@/components/ProfileTypeSelector';
import { LayoutSelector } from '@/components/LayoutSelector';
import { ContactInfoForm } from '@/components/ContactInfoForm';
import { StudentDetailsForm } from '@/components/StudentDetailsForm';
import { ProductsForm } from '@/components/ProductsForm';
import { EnquiryFormSetup } from '@/components/EnquiryFormSetup';

export default function EditProfilePage() {
  const router = useRouter();
  const params = useParams();
  const profileId = params.id;
  const { getProfileById, updateProfile, loading: saving } = useProfiles();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    profileType: '',
    layout: '',
    contactInfo: {},
    studentDetails: {},
    products: [],
    enquiryForm: {},
  });

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userRaw) {
      router.replace('/auth/login');
      return;
    }
    
    loadProfile();
  }, [router, profileId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getProfileById(profileId);
      const profile = response.data;
      
      setProfileData({
        profileType: profile.profileType || '',
        layout: profile.layout || '',
        contactInfo: profile.contactInfo || {},
        studentDetails: profile.studentDetails || {},
        products: profile.products || [],
        enquiryForm: {
          enableEnquiry: profile.enquiryForm?.enabled ?? false,
          customMessage: profile.enquiryForm?.customMessage || '',
        },
      });
      
      // Start from contact info step in edit mode
      setStep(3);
    } catch (err) {
      console.error('Failed to load profile:', err);
      alert('Failed to load profile. Redirecting to profiles page.');
      router.push('/profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileTypeSelect = (type) => {
    setProfileData((prev) => ({ ...prev, profileType: type }));
    setStep(2);
  };

  const handleLayoutSelect = (layout) => {
    setProfileData((prev) => ({ ...prev, layout }));
    setStep(3);
  };

  const handleContactInfoSubmit = (data) => {
    setProfileData((prev) => ({ ...prev, contactInfo: data }));
    
    const { profileType, layout } = profileData;
    
    if (layout === 'single') {
      // Single page - go to review/completion
      setStep(99); // Final step
    } else if (profileType === 'student' && layout === 'double') {
      setStep(4); // Student details
    } else if (profileType === 'professional') {
      if (layout === 'double-products') {
        setStep(4); // Products only
      } else if (layout === 'double-enquiry') {
        setStep(5); // Enquiry only
      } else if (layout === 'triple') {
        setStep(4); // Products first
      }
    }
  };

  const handleStudentDetailsSubmit = (data) => {
    setProfileData((prev) => ({ ...prev, studentDetails: data }));
    setStep(99); // Final step
  };

  const handleProductsSubmit = (data) => {
    setProfileData((prev) => ({ ...prev, products: data.products }));
    
    if (profileData.layout === 'triple') {
      setStep(5); // Enquiry form next
    } else {
      setStep(99); // Final step
    }
  };

  const handleEnquirySubmit = (data) => {
    setProfileData((prev) => ({ ...prev, enquiryForm: data }));
    setStep(99); // Final step
  };

  const handleComplete = async () => {
    try {
      // Prepare data for API
      const apiData = {
        profileType: profileData.profileType,
        layout: profileData.layout,
        contactInfo: {
          name: profileData.contactInfo.name,
          email: profileData.contactInfo.email,
          phone: profileData.contactInfo.phone,
          address: profileData.contactInfo.address,
          website: profileData.contactInfo.website,
          linkedin: profileData.contactInfo.linkedin,
          facebook: profileData.contactInfo.facebook,
          instagram: profileData.contactInfo.instagram,
          twitter: profileData.contactInfo.twitter,
          github: profileData.contactInfo.github
        },
      };

      // Add professional-specific data
      if (profileData.profileType === 'professional') {
        apiData.companyLogo = null;
        apiData.products = (profileData.products || []).map((product) => ({
          name: product.name,
          description: product.description
        }));
        apiData.enquiryForm = {
          enabled: profileData.enquiryForm?.enableEnquiry ?? false,
          customMessage: profileData.enquiryForm?.customMessage || '',
        };
      }

      // Add student-specific data
      if (profileData.profileType === 'student') {
        apiData.studentDetails = {
          aboutMe: profileData.studentDetails.aboutMe,
          skills: profileData.studentDetails.skills,
          resumeFile: null,
        };
      }

      const formData = new FormData();
      formData.append('profileData', JSON.stringify(apiData));

      if (profileData.contactInfo.photo instanceof File) {
        formData.append('photo', profileData.contactInfo.photo);
      }

      if (profileData.contactInfo.companyLogo instanceof File) {
        formData.append('companyLogo', profileData.contactInfo.companyLogo);
      }

      if (profileData.studentDetails.resumeFile instanceof File) {
        formData.append('resumeFile', profileData.studentDetails.resumeFile);
      }

      (profileData.products || []).forEach((product) => {
        if (product.image instanceof File) formData.append('productImages', product.image);
        if (product.pdf instanceof File) formData.append('productPdfs', product.pdf);
      });

      await updateProfile(profileId, formData);
      router.push('/profiles'); // Redirect to profiles page
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Update your digital card profile</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">
              Step {step < 99 ? step - 2 : 4} of 4
            </span>
            <span className="text-xs font-medium text-blue-600">
              {step < 99 ? Math.round(((step - 2) / 4) * 100) : 100}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: step < 99 ? `${((step - 2) / 4) * 100}%` : '100%' }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {step === 1 && <ProfileTypeSelector onSelect={handleProfileTypeSelect} />}
          
          {step === 2 && (
            <LayoutSelector
              profileType={profileData.profileType}
              onSelect={handleLayoutSelect}
              onBack={() => setStep(1)}
            />
          )}
          
          {step === 3 && (
            <ContactInfoForm
              profileType={profileData.profileType}
              onSubmit={handleContactInfoSubmit}
              onBack={() => router.push('/profiles')}
              initialData={profileData.contactInfo}
            />
          )}
          
          {step === 4 && profileData.profileType === 'student' && (
            <StudentDetailsForm
              onSubmit={handleStudentDetailsSubmit}
              onBack={() => setStep(3)}
              initialData={profileData.studentDetails}
            />
          )}
          
          {step === 4 && profileData.profileType === 'professional' && (
            <ProductsForm
              onSubmit={handleProductsSubmit}
              onBack={() => setStep(3)}
              initialData={{ products: profileData.products }}
            />
          )}
          
          {step === 5 && (
            <EnquiryFormSetup
              onSubmit={handleEnquirySubmit}
              onBack={() => setStep(4)}
              initialData={profileData.enquiryForm}
            />
          )}
          
          {step === 99 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">✓</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Profile Updated!</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Your profile changes are ready to be saved.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/profiles')}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
