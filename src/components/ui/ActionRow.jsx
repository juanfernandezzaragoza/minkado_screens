// src/components/ui/ActionRow.jsx - Updated with valuation support
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Fish, 
  MapPin, 
  ShoppingBag, 
  Baby, 
  Globe, 
  Users, 
  Heart,
  Car,
  Code,
  FileText,
  X
} from 'lucide-react';

// Icon mapping
const iconMap = {
  Fish,
  MapPin,
  ShoppingBag,
  Baby,
  Globe,
  Users,
  Heart,
  Car,
  Code,
  FileText,
};

export default function ActionRow({ 
  action,
  valuation,
  minkaContext,
  onClick = null
}) {
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (action?.id) {
      router.push(`/action/${action.id}?minka=${minkaContext?.id || 'pescadores'}`);
    }
  };

  if (!action || !valuation) {
    return null;
  }

  // Get action icon
  const ActionIcon = iconMap[action.icon] || FileText;
  
  // Determine scope icon and label based on valuation
  let ScopeIcon, scopeLabel, scopeIconColor;
  
  if (valuation.associatedMinka === 'global') {
    ScopeIcon = Globe;
    scopeLabel = 'Global';
    scopeIconColor = 'text-green-600';
  } else if (valuation.complement) {
    // For complement (non-X), show crossed icon
    const MinkaIcon = iconMap[minkaContext?.icon] || Users;
    ScopeIcon = ({ size, className }) => (
      <div className="relative">
        <MinkaIcon size={size} className={className} />
        <X size={size * 0.6} className="absolute top-0 left-0 text-red-500" />
      </div>
    );
    scopeLabel = `No ${valuation.associatedMinka}`;
    scopeIconColor = 'text-red-600';
  } else {
    // Regular minka
    const minka = minkaContext?.id === valuation.associatedMinka ? 
      minkaContext : 
      { icon: 'Users', iconColor: 'text-blue-600' }; // Default for other minkas
    
    ScopeIcon = iconMap[minka.icon] || Users;
    scopeLabel = valuation.associatedMinka;
    scopeIconColor = minka.iconColor || 'text-blue-600';
  }

  // Format valuation value
  let valueDisplay, valueColor;
  
  if (valuation.isExchange) {
    valueDisplay = `⇆ ${valuation.exchangePercentage}%`;
    valueColor = 'text-gray-600';
  } else {
    const isPositive = valuation.value >= 0;
    valueDisplay = `${isPositive ? '+' : ''}₭ ${Math.abs(valuation.value)}`;
    valueColor = isPositive ? 'text-green-600' : 'text-red-600';
  }

  const isClickable = action.id || onClick;
  
  return (
    <div 
      className={`p-4 border-b border-gray-100 last:border-b-0 ${isClickable ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1 pr-4">
          <div className="w-8 h-8 flex items-center justify-center mr-3 mt-1">
            <ActionIcon size={18} className="text-gray-600" />
          </div>
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="text-gray-800 font-medium">{action.name}</div>
              <div className="flex items-center ml-2">
                <div className="w-4 h-4 flex items-center justify-center mr-1">
                  <ScopeIcon size={14} className={scopeIconColor} />
                </div>
                <span className="text-xs text-gray-500">{scopeLabel}</span>
              </div>
            </div>
            {action.description && (
              <div className="text-sm text-gray-600 mt-1">
                {action.description.length > 45 ? `${action.description.substring(0, 45)}...` : action.description}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`font-medium text-lg ${valueColor}`}>{valueDisplay}</div>
          <div className="text-xs text-gray-500 mt-1">
            <div>Mi voto: {valuation.userValue >= 0 ? '+' : ''}₭{valuation.userValue}</div>
            <div>Mediana: {valuation.medianValue >= 0 ? '+' : ''}₭{valuation.medianValue}</div>
          </div>
        </div>
      </div>
    </div>
  );
}