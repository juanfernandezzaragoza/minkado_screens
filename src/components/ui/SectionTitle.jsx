import React from 'react';
import { theme } from '@/styles/theme';

export default function SectionTitle({ title, actionText, onAction }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
      {actionText && (
        <div 
          className={`text-sm ${theme.colors.primary.text} cursor-pointer`}
          onClick={onAction}
        >
          {actionText}
        </div>
      )}
    </div>
  );
}