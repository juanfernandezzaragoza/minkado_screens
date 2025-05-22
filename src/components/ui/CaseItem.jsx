
import React from 'react';

export default function CaseItem({ name, time, date, value, isPositive = true }) {
  const valueColor = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <div className="font-medium text-gray-800">{name}</div>
        <div className="text-xs text-gray-500">{time} {date}</div>
      </div>
      <div className={`font-medium ${valueColor}`}>
        {isPositive ? '+' : '-'}{value}
      </div>
    </div>
  );
}