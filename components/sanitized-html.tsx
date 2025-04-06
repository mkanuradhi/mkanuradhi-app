"use client";
import React from 'react';
import { useSanitizedHtml } from '@/hooks/use-sanitized-html';


interface SanitizedHtmlProps {
  html: string;
  className?: string;
}

const SanitizedHtml: React.FC<SanitizedHtmlProps> = ({ html, className }) => {
  const sanitizedHtml = useSanitizedHtml(html);

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default SanitizedHtml;
