'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function LayoutSelector({ profileType, onSelect, onBack }) {
  const [selected, setSelected] = useState('');

  const studentLayouts = [
    {
      value: 'single',
      title: 'Single Page',
      description: 'Contact information only',
      pages: ['Contact Info'],
    },
    {
      value: 'double',
      title: 'Two Pages',
      description: 'Contact info + About, Skills & Resume',
      pages: ['Contact Info', 'About, Skills, Resume'],
    },
  ];

  const professionalLayouts = [
    {
      value: 'single',
      title: 'Single Page',
      description: 'Contact information only',
      pages: ['Contact Info'],
    },
    {
      value: 'double-products',
      title: 'Two Pages - Products',
      description: 'Contact info + Product showcase',
      pages: ['Contact Info', 'Products (up to 3)'],
    },
    {
      value: 'double-enquiry',
      title: 'Two Pages - Enquiry',
      description: 'Contact info + Enquiry form',
      pages: ['Contact Info', 'Enquiry Form'],
    },
    {
      value: 'triple',
      title: 'Three Pages',
      description: 'Contact info + Products + Enquiry',
      pages: ['Contact Info', 'Products', 'Enquiry Form'],
    },
  ];

  const layouts = profileType === 'student' ? studentLayouts : professionalLayouts;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Choose Your Layout</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select how you want to organize your card
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {layouts.map((layout) => (
          <Card
            key={layout.value}
            className={`cursor-pointer transition-all ${
              selected === layout.value
                ? 'border-blue-600 ring-2 ring-blue-600'
                : 'border-gray-200 hover:border-blue-400'
            }`}
            onClick={() => setSelected(layout.value)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">{layout.title}</h3>
                {selected === layout.value && (
                  <Check size={20} className="text-blue-600 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">{layout.description}</p>
              <div className="space-y-1">
                {layout.pages.map((page, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    {page}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
