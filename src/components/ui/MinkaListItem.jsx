import React from 'react';

export default function MinkaListItem({ 
  icon, 
  title, 
  subtitle, 
  value, 
  isPositive = false,
  isMember = true
}) {
  const valueColor = isPositive ? 'text-green-500' : 'text-red-500';
  const textOpacity = isMember ? '' : 'opacity-50';
  
  return (
    <div className={`p-4 border-b border-gray-100 flex items-center hover:bg-gray-50 last:border-b-0 ${textOpacity}`}>
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