// src/components/ui/ActionRow.jsx - Updated version
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ActionRow({ 
  icon, 
  title, 
  subtitle,
  value, 
  valueColor = "text-gray-600",
  actionId = null,
  scopeIcon,
  scopeLabel,
  miVoto,
  resultado,
  onClick = null
}) {
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (actionId) {
      router.push(`/action/${actionId}`); // Updated to use dynamic route
    }
  };

  const isClickable = actionId || onClick;
  
  return (
    <div 
      className={`p-4 border-b border-gray-100 last:border-b-0 ${isClickable ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1 pr-4">
          <div className="w-8 h-8 flex items-center justify-center mr-3 mt-1">
            {icon}
          </div>
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="text-gray-800 font-medium">{title}</div>
              <div className="flex items-center ml-2">
                <div className="w-4 h-4 flex items-center justify-center mr-1">
                  {scopeIcon}
                </div>
                <span className="text-xs text-gray-500">{scopeLabel}</span>
              </div>
            </div>
            {subtitle && (
              <div className="text-sm text-gray-600 mt-1">
                {subtitle.length > 45 ? `${subtitle.substring(0, 45)}...` : subtitle}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`font-medium text-lg ${valueColor}`}>{value}</div>
          <div className="text-xs text-gray-500 mt-1">
            <div>Mi voto: {miVoto}</div>
            <div>Resultado: {resultado}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

