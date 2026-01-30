'use client';

import Link from 'next/link';

export function FormLink({ text, href, linkText, onClick }) {
  return (
    <p className="text-center text-gray-600 text-sm mt-6">
      {text}{' '}
      <Link
        href={href}
        onClick={onClick}
        className="text-blue-600 font-medium hover:underline transition-colors"
      >
        {linkText}
      </Link>
    </p>
  );
}
