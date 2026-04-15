'use client';

import { FormButton } from '@/components/FormButton';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export function PlanCard({
  id,
  title,
  price,
  billingNote,
  subNote,
  badgeText,
  cardTypes = [],
  features = [],
  description,
  onSelect = () => {},
  buttonText = 'Continue',
  currencySymbol = '₹',
  loading = false,
}) {
  // Truncate description to 300 chars
  const desc = (subNote || description || '').slice(0, 300);
  return (
    <div className="w-[80vw] md:w-full rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full min-h-[40px] md:min-h-[40px]">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header with title and badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {desc && <p className="mt-1 text-xs text-gray-500 min-h-[63px] line-clamp-4">{desc}{(subNote || description || '').length > 300 ? '...' : ''}</p>}
          </div>
          {badgeText && <Badge className="bg-green-100 text-green-700 text-xs font-medium whitespace-nowrap">{badgeText}</Badge>}
        </div>

        {/* Price section */}
        <div className="mb-5">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {currencySymbol}
              {price}
            </span>
            {billingNote && <span className="text-xs text-gray-500 mb-1">{billingNote}</span>}
          </div>
        </div>

        {/* Card Types */}
        {cardTypes && cardTypes.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-700 mb-2">Card Types:</p>
            <div className="flex flex-wrap gap-2">
              {cardTypes.map((type) => {
                const typeColors = {
                  physical: 'bg-orange-100 text-orange-700 border-orange-200',
                  digital: 'bg-blue-100 text-blue-700 border-blue-200',
                  NFC: 'bg-purple-100 text-purple-700 border-purple-200'
                };
                return (
                  <span
                    key={type}
                    className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border ${typeColors[type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                  >
                    {type}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Features list */}
        {features && features.length > 0 && (
          <div className="mb-5 flex-1">
            <p className="text-xs font-semibold text-gray-700 mb-3">Features:</p>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="px-6 pb-6 mt-auto">
        <FormButton type="button" onClick={onSelect} loading={loading} className="rounded-xl w-full">
          {buttonText}
        </FormButton>
      </div>
    </div>
  );
}
