"use client";
import React, { useMemo } from 'react';
import createDOMPurify from 'dompurify';

interface SanitizedHtmlProps {
  html: string;
  className?: string;
}

const SanitizedHtml: React.FC<SanitizedHtmlProps> = ({ html, className }) => {
  const sanitizedHtml = useMemo(() => {
    // Only create DOMPurify instance if window is available
    if (typeof window !== 'undefined') {
      const DOMPurify = createDOMPurify(window);
      // Set up hook for links
      DOMPurify.addHook('afterSanitizeAttributes', (node) => {
        if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
          node.setAttribute('rel', 'noopener noreferrer');
        }
      });
      const clean = DOMPurify.sanitize(html, {
        ALLOWED_ATTR: ['target', 'href', 'rel', 'src', 'alt', 'style', 'class'],
      });
      // Remove all hooks to avoid side effects
      DOMPurify.removeAllHooks();
      return clean;
    }
    return html;
  }, [html]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default SanitizedHtml;
