'use client';

import { useState } from 'react';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';

export function EnquiryFormSetup({ onSubmit, onBack, initialData = {} }) {
  const [formData, setFormData] = useState({
    enableEnquiry: initialData.enableEnquiry !== false,
    customMessage: initialData.customMessage || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Enquiry Form</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enable visitors to send you enquiries
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            The enquiry form will include fields for: Name, Email, Phone, and Message.
            Submissions will be sent to your registered email.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Custom Message (Optional)
          </label>
          <textarea
            name="customMessage"
            value={formData.customMessage}
            onChange={handleChange}
            placeholder="Add a custom message for visitors (e.g., 'Feel free to reach out for collaborations')"
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
