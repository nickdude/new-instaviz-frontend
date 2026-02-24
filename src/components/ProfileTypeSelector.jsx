'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, Building2 } from 'lucide-react';

export function ProfileTypeSelector({ onSelect }) {
  const [selected, setSelected] = useState('');

  const types = [
    {
      value: 'student',
      title: 'Student',
      description: 'Create a profile with contact info, skills, and resume',
      Icon: GraduationCap,
    },
    {
      value: 'professional',
      title: 'Professional',
      description: 'Showcase products, services, and contact information',
      Icon: Briefcase,
    },
    {
      value: 'enterprise',
      title: 'Enterprise',
      description: 'Multi-user team profiles with advanced collaboration features',
      Icon: Building2,
      comingSoon: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Choose Your Profile Type</h2>
        <p className="text-sm text-gray-500 mt-1">Select the type that best describes you</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {types.map((type) => (
          <div key={type.value} className="relative">
            <Card
              className={`cursor-pointer transition-all ${
                type.comingSoon ? 'opacity-60 cursor-not-allowed' : ''
              } ${
                selected === type.value && !type.comingSoon
                  ? 'border-blue-600 ring-2 ring-blue-600'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
              onClick={() => !type.comingSoon && setSelected(type.value)}
            >
              <CardContent className="p-6">
                <div className="mb-3">
                  <type.Icon size={48} className={`${type.comingSoon ? 'text-gray-400' : 'text-blue-600'}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{type.description}</p>
              </CardContent>
            </Card>
            {type.comingSoon && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="text-xs font-semibold text-blue-700">Coming Soon</span>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}
