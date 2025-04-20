"use client";
import { useMemo } from 'react';
import { sanitizeHtml } from '@/utils/sanitize-html';


export function useSanitizedHtml(html: string): string {
  return useMemo(() => sanitizeHtml(html), [html]);
}
