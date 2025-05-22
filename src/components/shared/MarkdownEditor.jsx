// src/components/shared/MarkdownEditor.jsx
"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }
);

export default function MarkdownEditor({ value, onChange, placeholder, height = 200 }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50" style={{ height }}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="markdown-editor">
      <MDEditor
        value={value}
        onChange={onChange}
        preview="edit"
        hideToolbar={false}
        textareaProps={{
          placeholder: placeholder || 'Escribí tu contenido en markdown...',
          style: { fontSize: 14, lineHeight: 1.5 }
        }}
        height={height}
      />
    </div>
  );
}

