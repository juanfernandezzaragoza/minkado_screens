import React from 'react';

export default function ActionItem({ icon, label, highlight = false, onClick }) {
  return (
    <div 
      className={`flex items-center p-2 hover:bg-gray-50 rounded-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className={`h-10 w-10 rounded-lg ${highlight ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center mr-3`}>
        {icon}
      </div>
      <span className={`text-sm ${highlight ? 'font-medium text-blue-700' : ''}`}>{label}</span>
    </div>
  );
}