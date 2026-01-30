'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfiles } from '@/hooks/useProfiles';
import { ProfileTypeSelector } from '@/components/ProfileTypeSelector';
import { LayoutSelector } from '@/components/LayoutSelector';
import { ContactInfoForm } from '@/components/ContactInfoForm';
import { StudentDetailsForm } from '@/components/StudentDetailsForm';
import { ProductsForm } from '@/components/ProductsForm';
import { EnquiryFormSetup } from '@/components/EnquiryFormSetup';

export default function CreateProfilePage() {
  const router = useRouter();
    const { createProfile, loading: saving } = useProfiles();
  const [step, setStep] = useState(1);
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
    }
  }, [router]);

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

        if (profileData.contactInfo.photo) {
          formData.append('photo', profileData.contactInfo.photo);
        }

        if (profileData.contactInfo.companyLogo) {
          formData.append('companyLogo', profileData.contactInfo.companyLogo);
        }

        if (profileData.studentDetails.resumeFile) {
          formData.append('resumeFile', profileData.studentDetails.resumeFile);
        }

        (profileData.products || []).forEach((product) => {
          if (product.image) formData.append('productImages', product.image);
          if (product.pdf) formData.append('productPdfs', product.pdf);
        });

        await createProfile(formData);
        router.push('/plans'); // Redirect to plans page
      } catch (err) {
        console.error('Failed to create profile:', err);
        alert('Failed to create profile. Please try again.');
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">
              Step {step < 99 ? step : step - 93} of {step < 99 ? 5 : 6}
            </span>
            <span className="text-xs font-medium text-blue-600">
              {step < 99 ? Math.round((step / 5) * 100) : 100}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: step < 99 ? `${(step / 5) * 100}%` : '100%' }}
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
              onBack={() => setStep(2)}
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
                <h2 className="text-2xl font-semibold text-gray-900">Profile Created!</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Your profile is ready. Choose a plan to activate your digital card.
                </p>
              </div>
              <button
                onClick={handleComplete}
                  disabled={saving}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                  {saving ? 'Creating Profile...' : 'Continue to Plans'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
