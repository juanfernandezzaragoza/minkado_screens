// src/components/ui/MinkaListItem.jsx - Updated with onClick support
import React from 'react';

export default function MinkaListItem({ 
  icon, 
  title, 
  subtitle, 
  value, 
  isPositive = false,
  isMember = true,
  onClick
}) {
  const valueColor = isPositive ? 'text-green-500' : 'text-red-500';
  const textOpacity = isMember ? '' : 'opacity-50';
  
  return (
    <div 
      className={`p-4 border-b border-gray-100 flex items-center hover:bg-gray-50 last:border-b-0 ${textOpacity} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="mr-3">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-800">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
      <div className={`font-medium ${valueColor}`}>
        {isPositive ? '+ ' : '- '}{value}
      </div>
    </div>
  );
}

// src/utils/navigation.js - Navigation utilities
export const navigationUtils = {
  goToMinka: (router, minkaId) => router.push(`/minka/${minkaId}`),
  goToAction: (router, actionId) => router.push(`/action/${actionId}`),
  goToCreateMinka: (router, parentId = null) => {
    const url = parentId ? `/crear-minka?parent=${parentId}` : '/crear-minka';
    router.push(url);
  },
  goToValorarAccion: (router, actionId) => router.push(`/valorar-accion?action=${actionId}`),
  goHome: (router) => router.push('/'),
};