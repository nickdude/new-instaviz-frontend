'use client';

import { useState } from 'react';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { Mail, Phone, User, MapPin, Linkedin, Globe, Github, Camera, Facebook, Instagram, Twitter } from 'lucide-react';

export function ContactInfoForm({ onSubmit, onBack, initialData = {}, profileType = 'student' }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    website: initialData.website || '',
    linkedin: initialData.linkedin || '',
    facebook: initialData.facebook || '',
    instagram: initialData.instagram || '',
    twitter: initialData.twitter || '',
    github: initialData.github || '',
    photo: initialData.photo || null,
    companyLogo: initialData.companyLogo || null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

    const handleFileChange = (e, fieldName) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        setFormData((prev) => ({ ...prev, [fieldName]: file }));
        setErrors((prev) => ({ ...prev, [fieldName]: '' }));
      } else {
        setErrors((prev) => ({ ...prev, [fieldName]: 'Only image files are allowed' }));
      }
    };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
        <p className="text-sm text-gray-500 mt-1">Enter your contact details</p>
      </div>

      <div className="space-y-4">
        <FormInput
          label="Full Name"
          name="name"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="John Doe"
          required
        />

        <FormInput
          label="Email"
          type="email"
          name="email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="john@example.com"
          required
        />

        <FormInput
          label="Phone"
          type="tel"
          name="phone"
          icon={Phone}
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="+91 9876543210"
          required
        />

        <FormInput
          label="Address (Optional)"
          name="address"
          icon={MapPin}
          value={formData.address}
          onChange={handleChange}
          placeholder="City, State, Country"
        />

        <FormInput
          label="Website (Optional)"
          name="website"
          icon={Globe}
          value={formData.website}
          onChange={handleChange}
          placeholder="https://yourwebsite.com"
        />

        <FormInput
          label="LinkedIn (Optional)"
          name="linkedin"
          icon={Linkedin}
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/username"
        />

        <FormInput
          label="Facebook (Optional)"
          name="facebook"
          icon={Facebook}
          value={formData.facebook}
          onChange={handleChange}
          placeholder="https://facebook.com/username"
        />

        <FormInput
          label="Instagram (Optional)"
          name="instagram"
          icon={Instagram}
          value={formData.instagram}
          onChange={handleChange}
          placeholder="https://instagram.com/username"
        />

        <FormInput
          label="X / Twitter (Optional)"
          name="twitter"
          icon={Twitter}
          value={formData.twitter}
          onChange={handleChange}
          placeholder="https://x.com/username"
        />

        <FormInput
          label="GitHub (Optional)"
          name="github"
          icon={Github}
          value={formData.github}
          onChange={handleChange}
          placeholder="https://github.com/username"
        />

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {profileType === 'student' ? 'Your Photo' : 'Your Photo'} (Optional)
            </label>
            <label className="cursor-pointer">
              <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition">
                <Camera size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formData.photo ? (formData.photo instanceof File ? formData.photo.name : 'Current photo uploaded') : 'Click to upload photo'}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
                className="hidden"
              />
            </label>
            {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
          </div>

          {profileType === 'professional' && (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Company Logo (Optional)
              </label>
              <label className="cursor-pointer">
                <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition">
                  <Camera size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formData.companyLogo ? (formData.companyLogo instanceof File ? formData.companyLogo.name : 'Current logo uploaded') : 'Click to upload company logo'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'companyLogo')}
                  className="hidden"
                />
              </label>
              {errors.companyLogo && <p className="mt-1 text-sm text-red-500">{errors.companyLogo}</p>}
            </div>
          )}
      </div>

      <div className="flex gap-3">
        <FormButton type="button" onClick={onBack} variant="secondary" className="flex-1">
          Back
        </FormButton>
        <FormButton type="submit" className="flex-1">
          Continue
        </FormButton>
      </div>
    </form>
  );
}
