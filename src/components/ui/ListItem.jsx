import React from 'react';
import { useRouter } from 'next/navigation';

export default function ListItem({ 
  icon, 
  title, 
  subtitle, 
  value, 
  isPositive = false,
  indentLevel = 0,
  isTotal = false,
  minkaId = null, // Add this prop for navigation
  onClick = null // Allow custom click handlers
}) {
  const router = useRouter();
  
  // Calculate padding based on indent level
  const paddingLeft = indentLevel === 0 ? "" : 
                      indentLevel === 1 ? "pl-10" : 
                      indentLevel === 2 ? "pl-16" : "";
  
  const valueColor = isPositive ? 'text-green-500' : 'text-red-500';
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (minkaId && !isTotal) {
      // Navigate to the minka detail page using the minkaId
      router.push(`/${minkaId.toLowerCase()}`);
    }
  };

  const isClickable = (minkaId && !isTotal) || onClick;
  
  return (
    <div 
      className={`p-4 border-b border-gray-100 flex items-center ${isClickable ? 'hover:bg-gray-50 cursor-pointer' : ''} ${paddingLeft} ${isTotal ? 'bg-gradient-to-r from-blue-50 to-green-50' : ''}`}
      onClick={handleClick}
    >
      {icon && (
        <div className="mr-3">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <div className={`font-medium text-gray-800 ${isTotal ? 'font-bold' : ''}`}>{title}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
      <div className={`font-medium ${isTotal ? 'font-bold text-green-600' : valueColor}`}>
        {isPositive ? '+ ' : '- '}{value}
      </div>
    </div>
  );
}