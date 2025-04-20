"use client";
import createDOMPurify from 'dompurify';


export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;

  const DOMPurify = createDOMPurify(window);

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ['target', 'href', 'rel', 'src', 'alt', 'style', 'class'],
  });

  DOMPurify.removeAllHooks();
  return clean;
}