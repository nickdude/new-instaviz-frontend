'use client';

import { FormButton } from '@/components/FormButton';
import { Badge } from '@/components/ui/badge';

export function PlanCard({
  title,
  price,
  billingNote,
  subNote,
  badgeText,
  description,
  onSelect = () => {},
  buttonText = 'Continue',
  currencySymbol = '₹',
  loading = false,
}) {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {badgeText && <Badge className="bg-green-100 text-green-700">{badgeText}</Badge>}
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-semibold text-gray-900">
            {currencySymbol}
            {price}
          </span>
          {billingNote && <span className="text-sm text-gray-500">{billingNote}</span>}
        </div>
        {subNote && <p className="mt-2 text-sm text-gray-500">{subNote}</p>}
        {description && <p className="mt-4 text-sm text-gray-500">{description}</p>}
      </div>
      <div className="px-6 pb-6">
        <FormButton type="button" onClick={onSelect} loading={loading} className="rounded-xl">
          {buttonText}
        </FormButton>
      </div>
    </div>
  );
}
