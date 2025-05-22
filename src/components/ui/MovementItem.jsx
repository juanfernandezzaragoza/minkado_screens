import React from 'react';

export default function MovementItem({ 
  transactionText,
  amount,
  isPositive,
  scopeIcon,
  scopeLabel,
  percentage,
  scopePosition = "right",
  alignment = "right", // "left" or "right" for chat-like positioning
  timestamp
}) {
  const amountColor = isPositive ? 'text-green-600' : 'text-red-600';
  const sign = isPositive ? '+' : '-';
  
  // Different colors based on alignment (like chat messages)
  const bgColor = alignment === "right" ? "bg-blue-50" : "bg-gray-50";
  const containerClass = alignment === "right" ? "ml-8" : "mr-8";
  
  return (
    <div className={`mb-3 ${containerClass}`}>
      <div className={`${bgColor} rounded-xl p-4 shadow-sm`}>
        {/* Community info at top */}
        <div className={`flex ${scopePosition === 'left' ? 'justify-start' : 'justify-end'} mb-2`}>
          {scopeIcon && (
            <div className="flex items-center">
              <div className="w-4 h-4 flex items-center justify-center mr-1">
                {scopeIcon}
              </div>
              <span className="text-xs text-gray-500">{scopeLabel}</span>
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 pr-4">
            <div className="text-gray-800 font-medium mb-1">
              <span className="font-bold">{transactionText}</span>
            </div>
            {percentage && (
              <div className="text-sm text-gray-600 mt-1">
                {percentage}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className={`font-medium text-lg ${amountColor}`}>
              {sign}₭{amount}
            </div>
          </div>
        </div>
        
        {/* Timestamp */}
        <div className="flex justify-end">
          <span className="text-xs text-gray-400">{timestamp}</span>
        </div>
      </div>
    </div>
  );
}