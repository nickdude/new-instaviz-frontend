'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/FormInput';

export function PlanModal({ isOpen, onClose, onSubmit, plan = null, loading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationDays: 30,
    price: { rupees: 0, dollar: 0 },
    cardTypes: [],
    features: [],
  });
  const [featureInput, setFeatureInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plan && isOpen) {
      setFormData({
        title: plan.title || '',
        description: plan.description || '',
        durationDays: plan.durationDays || 30,
        price: {
          rupees: plan.price?.rupees || 0,
          dollar: plan.price?.dollar || 0,
        },
        cardTypes: Array.isArray(plan.cardTypes) ? [...plan.cardTypes] : [],
        features: Array.isArray(plan.features) ? [...plan.features] : [],
      });
    } else if (!plan && isOpen) {
      setFormData({
        title: '',
        description: '',
        durationDays: 30,
        price: { rupees: 0, dollar: 0 },
        cardTypes: [],
        features: [],
      });
    }
    setFeatureInput('');
    setErrors({});
  }, [plan, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('price.')) {
      const currency = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        price: { ...prev.price, [currency]: Number(value) },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const toggleCardType = (type) => {
    setFormData((prev) => ({
      ...prev,
      cardTypes: prev.cardTypes.includes(type)
        ? prev.cardTypes.filter((t) => t !== type)
        : [...prev.cardTypes, type],
    }));
    setErrors((prev) => ({ ...prev, cardTypes: '' }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.durationDays < 1) newErrors.durationDays = 'Duration must be at least 1 day';
    if (formData.price.rupees < 0) newErrors.priceRupees = 'Price must be positive';
    if (formData.price.dollar < 0) newErrors.priceDollar = 'Price must be positive';
    if (formData.cardTypes.length === 0) newErrors.cardTypes = 'Select at least one card type';
    if (formData.features.length === 0) newErrors.features = 'Add at least one feature';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{plan ? 'Edit Plan' : 'Add New Plan'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Plan Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="e.g., Annual Plan"
              required
            />

            <FormInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              placeholder="Plan description"
              required
            />

            <FormInput
              label="Duration (Days)"
              type="number"
              name="durationDays"
              value={formData.durationDays}
              onChange={handleChange}
              error={errors.durationDays}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Price (INR)"
                type="number"
                name="price.rupees"
                value={formData.price.rupees}
                onChange={handleChange}
                error={errors.priceRupees}
                step="0.01"
                required
              />
              <FormInput
                label="Price (USD)"
                type="number"
                name="price.dollar"
                value={formData.price.dollar}
                onChange={handleChange}
                error={errors.priceDollar}
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Card Types
                {errors.cardTypes && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="flex flex-wrap gap-3 mb-3">
                {[
                  { value: 'physical', label: 'Physical Card', color: 'orange' },
                  { value: 'digital', label: 'Digital Card', color: 'blue' },
                  { value: 'NFC', label: 'NFC Card', color: 'purple' }
                ].map((type) => {
                  const isSelected = formData.cardTypes.includes(type.value);
                  const colorClasses = {
                    orange: isSelected ? 'bg-orange-100 border-orange-700 text-orange-700' : 'bg-white border-orange-200 text-orange-700',
                    blue: isSelected ? 'bg-blue-100 border-blue-700 text-blue-700' : 'bg-white border-blue-200 text-blue-700',
                    purple: isSelected ? 'bg-purple-100 border-purple-700 text-purple-700' : 'bg-white border-purple-200 text-purple-700'
                  };
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => toggleCardType(type.value)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition ${colorClasses[type.color]}`}
                    >
                      {isSelected ? '✓ ' : ''}{type.label}
                    </button>
                  );
                })}
              </div>
              {errors.cardTypes && <p className="text-sm text-red-500 mb-4">{errors.cardTypes}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Features
                {errors.features && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  placeholder="Type a feature and press Enter"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" onClick={addFeature} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              {errors.features && <p className="text-sm text-red-500 mb-2">{errors.features}</p>}
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-700">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-700 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="flex-1">
                {plan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
