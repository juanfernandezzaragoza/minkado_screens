"use client";

import React from 'react';
import { Menu, HelpCircle, Bell, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { theme } from '@/styles/theme';

export default function Header({ showBackButton = false }) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className={`${theme.gradients.primary} text-white shadow-md`}>
      <div className="flex justify-between items-center p-4">
        {showBackButton ? (
          <ArrowLeft size={24} onClick={handleBackClick} className="cursor-pointer" />
        ) : (
          <Menu size={24} />
        )}
        <div className="flex items-center">
          <div 
            className="font-bold text-xl cursor-pointer" 
            onClick={() => router.push('/')}
          >
            Minkado
          </div>
        </div>
        <div className="flex items-center">
          <HelpCircle size={20} className="mr-3 opacity-80" />
          <div className="relative">
            <Bell size={20} className="opacity-80" />
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}