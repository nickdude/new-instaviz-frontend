'use client';

import { useState } from 'react';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { FileText, Plus, X } from 'lucide-react';

export function StudentDetailsForm({ onSubmit, onBack, initialData = {} }) {
  const [formData, setFormData] = useState({
    aboutMe: initialData.aboutMe || '',
    skills: initialData.skills || [],
    resumeFile: initialData.resumeFile || null,
  });

  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData((prev) => ({ ...prev, resumeFile: file }));
      setErrors((prev) => ({ ...prev, resumeFile: '' }));
    } else {
      setErrors((prev) => ({ ...prev, resumeFile: 'Only PDF files are allowed' }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.aboutMe.trim()) newErrors.aboutMe = 'About Me is required';
    if (formData.skills.length === 0) newErrors.skills = 'Add at least one skill';
    if (!formData.resumeFile) newErrors.resumeFile = 'Resume is required';

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
        <h2 className="text-2xl font-semibold text-gray-900">Additional Details</h2>
        <p className="text-sm text-gray-500 mt-1">Tell us more about yourself</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            About Me <span className="text-red-500">*</span>
          </label>
          <textarea
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
            placeholder="Write a brief description about yourself..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.aboutMe && <p className="mt-1 text-sm text-red-500">{errors.aboutMe}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Skills <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill and press Enter"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
            </button>
          </div>
          {errors.skills && <p className="text-sm text-red-500 mb-2">{errors.skills}</p>}
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Resume (PDF) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition">
                <FileText size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formData.resumeFile
                    ? formData.resumeFile.name
                    : 'Click to upload resume (PDF)'}
                </span>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          {errors.resumeFile && <p className="mt-1 text-sm text-red-500">{errors.resumeFile}</p>}
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
