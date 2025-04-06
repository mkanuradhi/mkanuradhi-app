"use client";
import React from 'react';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { useSanitizedHtml } from '@/hooks/use-sanitized-html';

const config = {
  tex: {
    packages: ['base', 'ams'],
  },
  options: {
    renderActions: {
      addMenu: [],
    },
  },
};

interface MathRendererProps {
  html: string;
};

const MathRenderer: React.FC<MathRendererProps> = ({ html }) => {
  const sanitizedHtml = useSanitizedHtml(html);

  return (
    <MathJaxContext config={config}>
      <MathJax dynamic>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </MathJax>
    </MathJaxContext>
  );
}

export default MathRenderer