'use client';

import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';

export function Alert({ type = 'info', message, title }) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      Icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      Icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      Icon: InfoIcon,
    },
  };

  const style = styles[type];
  const Icon = style.Icon;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 mb-6`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.icon}`} />
        <div>
          {title && <p className={`font-medium ${style.text}`}>{title}</p>}
          <p className={`text-sm ${style.text}`}>{message}</p>
        </div>
      </div>
    </div>
  );
}
