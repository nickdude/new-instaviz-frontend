'use client';

export function FormContainer({
  children,
  title,
  subtitle,
  maxWidth = 'max-w-md',
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className={`w-full ${maxWidth}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
          {subtitle && <p className="text-gray-600 text-base">{subtitle}</p>}
        </div>

        {/* Form Container */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
