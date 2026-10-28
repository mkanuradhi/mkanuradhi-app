import { SUPPORTED_LOCALES } from '@/types/locale.types';
import type { MetadataRoute } from 'next';

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://mkanuradhi.com').replace(/\/$/, '');

type PageDef = {
  path: string;          // '' for the homepage
  lastModified: string;  // update when the page content really changes
};

const PAGES: PageDef[] = [
  { path: '',             lastModified: '2026-09-11' },
  { path: '/research',    lastModified: '2026-09-21' },
  { path: '/publications',lastModified: '2026-08-17' },
  { path: '/books',       lastModified: '2026-07-12' },
  { path: '/teaching',    lastModified: '2026-10-07' },
  { path: '/blog',        lastModified: '2026-10-16' },
  { path: '/contact',     lastModified: '2025-10-21' },
  { path: '/awards',      lastModified: '2025-09-11' },
  { path: '/experience',  lastModified: '2025-10-17' },
  { path: '/policy',      lastModified: '2025-11-17' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, lastModified }) => {
    const languages = Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [locale, `${BASE_URL}/${locale}${path}`])
    );

    // One <url> per language, each listing all alternates
    return SUPPORTED_LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(lastModified),
      alternates: { languages },
    }));
  });
}