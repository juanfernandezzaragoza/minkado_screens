// src/components/shared/MarkdownViewer.jsx
"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownViewer({ content, className = "" }) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-gray-800 mb-3" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-bold text-gray-800 mb-2 mt-4" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-base font-bold text-gray-800 mb-2 mt-3" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-700 mb-2 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 text-gray-700" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 text-gray-700" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />,
          code: ({node, ...props}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3" {...props} />
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}

