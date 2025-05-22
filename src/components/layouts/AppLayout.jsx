import React from 'react';
import Header from '../ui/Header';

export default function AppLayout({ children, showBackButton = false }) {
  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen overflow-auto font-sans text-black">
      <Header showBackButton={showBackButton} />
      <main className="pb-20">
        {children}
      </main>
    </div>
  );
}
