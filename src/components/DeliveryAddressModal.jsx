'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

export default function DeliveryAddressModal({ order, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    fullName: order?.shippingAddress?.fullName || '',
    email: order?.shippingAddress?.email || '',
    phone: order?.shippingAddress?.phone || '',
    addressLine1: order?.shippingAddress?.addressLine1 || '',
    addressLine2: order?.shippingAddress?.addressLine2 || '',
    city: order?.shippingAddress?.city || '',
    state: order?.shippingAddress?.state || '',
    zipCode: order?.shippingAddress?.zipCode || '',
    country: order?.shippingAddress?.country || 'India',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone?.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Valid phone number is required (10 digits)';
    }
    if (!formData.addressLine1?.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state?.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode?.trim() || !/^\d{6}$/.test(formData.zipCode.replace(/\D/g, ''))) {
      newErrors.zipCode = 'Valid zip code is required (6 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Delivery Address</CardTitle>
          <p className="text-sm text-gray-600 mt-2">Please provide your delivery address for the physical cards</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 space-y-6">
            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Note</p>
                <p className="text-sm text-blue-800 mt-1">Ensure the address is correct as the cards will be shipped to this location</p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`border ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.fullName && (
                  <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
                  className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && (
                  <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Address Line 1 */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <Input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder="House number, street name"
                  className={`border ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.addressLine1 && (
                  <p className="text-red-600 text-xs mt-1">{errors.addressLine1}</p>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2 (Optional)
                </label>
                <Input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, building, etc."
                  className="border border-gray-300"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City name"
                  className={`border ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.city && (
                  <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State/Province"
                  className={`border ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.state && (
                  <p className="text-red-600 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code *
                </label>
                <Input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="6-digit postal code"
                  className={`border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.zipCode && (
                  <p className="text-red-600 text-xs mt-1">{errors.zipCode}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <Input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="border border-gray-300"
                />
              </div>
            </div>
          </CardContent>

          {/* Footer with Actions */}
          <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="border border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Saving...' : 'Save Address'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
