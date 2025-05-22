import React from 'react';

export default function GradientCard({ children, gradient, className = "" }) {
  return (
    <div className={`rounded-xl shadow-sm overflow-hidden ${gradient} ${className}`}>
      {children}
    </div>
  );
}