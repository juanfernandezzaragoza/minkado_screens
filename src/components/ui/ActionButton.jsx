import React from 'react';

export default function ActionButton({ icon, label, bgColor, textColor }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`h-14 w-14 rounded-full ${bgColor} flex items-center justify-center mb-2 shadow-sm`}>
        {icon}
      </div>
      <span className="font-medium text-xs">{label}</span>
    </div>
  );
}

