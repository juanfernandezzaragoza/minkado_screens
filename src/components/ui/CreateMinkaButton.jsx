import React from 'react';
import { Plus } from 'lucide-react';

export default function CreateMinkaButton({ label, onClick }) {
  return (
    <div 
      className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-blue-300 cursor-pointer"
      onClick={onClick}
    >
      <Plus size={20} className="text-gray-500 mr-2" />
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
  );
}