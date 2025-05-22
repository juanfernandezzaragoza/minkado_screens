
// src/components/shared/FormField.jsx
import React from 'react';

export default function FormField({ 
  label, 
  children, 
  error, 
  required = false,
  description,
  className = ""
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}