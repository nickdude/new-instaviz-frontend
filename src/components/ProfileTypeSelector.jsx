'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase } from 'lucide-react';

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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Choose Your Profile Type</h2>
        <p className="text-sm text-gray-500 mt-1">Select the type that best describes you</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {types.map((type) => (
          <Card
            key={type.value}
            className={`cursor-pointer transition-all ${
              selected === type.value
                ? 'border-blue-600 ring-2 ring-blue-600'
                : 'border-gray-200 hover:border-blue-400'
            }`}
            onClick={() => setSelected(type.value)}
          >
            <CardContent className="p-6">
              <div className="mb-3">
                <type.Icon size={48} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{type.description}</p>
            </CardContent>
          </Card>
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
