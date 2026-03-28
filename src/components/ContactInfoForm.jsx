'use client';

import { useState } from 'react';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { Mail, Phone, User, MapPin, Linkedin, Globe, Github, Camera, Facebook, Instagram, Twitter } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;

const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath; // Already a full URL
  return `${API_BASE_URL}${imagePath}`; // Prepend base URL to relative path
};

export function ContactInfoForm({ onSubmit, onBack, initialData = {}, profileType = 'student' }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    designation: initialData.designation || '',
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
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [fieldName]: 'Only JPG, JPEG, or PNG files are allowed' }));
      e.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrors((prev) => ({ ...prev, [fieldName]: 'Image size must be 3MB or less' }));
      e.target.value = '';
      return;
    }

    if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Mandatory fields (those with asterisks)
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }
    
    if (!formData.designation || !formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!formData.address || !formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.photo) {
      newErrors.photo = 'Photo is required';
    }
    
    if (!formData.companyLogo) {
      newErrors.companyLogo = 'Organization Logo is required';
    }

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
          label="Designation"
          name="designation"
          icon={User}
          value={formData.designation}
          onChange={handleChange}
          error={errors.designation}
          placeholder="e.g., Software Engineer, Manager"
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
          label="Address"
          name="address"
          icon={MapPin}
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="City, State, Country"
          required
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
              Your Photo <span className="text-red-500">*</span>
            </label>
            {formData.photo && !(formData.photo instanceof File) && (
              <div className="mb-3 flex gap-3">
                <img src={getFullImageUrl(formData.photo)} alt="Current photo" className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Current photo:</p>
                  <p>{formData.photo.substring(formData.photo.lastIndexOf('/') + 1)}</p>
                </div>
              </div>
            )}
            <label className="cursor-pointer">
              <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition">
                <Camera size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formData.photo ? (formData.photo instanceof File ? formData.photo.name : 'Click to replace photo') : 'Click to upload photo'}
                </span>
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={(e) => handleFileChange(e, 'photo')}
                className="hidden"
              />
            </label>
            {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Organization Logo <span className="text-red-500">*</span>
            </label>
            {formData.companyLogo && !(formData.companyLogo instanceof File) && (
              <div className="mb-3 flex gap-3">
                <img src={getFullImageUrl(formData.companyLogo)} alt="Current logo" className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Current logo:</p>
                  <p>{formData.companyLogo.substring(formData.companyLogo.lastIndexOf('/') + 1)}</p>
                </div>
              </div>
            )}
            <label className="cursor-pointer">
              <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition">
                <Camera size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formData.companyLogo ? (formData.companyLogo instanceof File ? formData.companyLogo.name : 'Click to replace logo') : 'Click to upload logo'}
                </span>
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={(e) => handleFileChange(e, 'companyLogo')}
                className="hidden"
              />
            </label>
            {errors.companyLogo && <p className="mt-1 text-sm text-red-500">{errors.companyLogo}</p>}
          </div>
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
