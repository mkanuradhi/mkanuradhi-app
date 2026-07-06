import { routing } from '@/i18n/routing';

export const getBookRoutes = (path?: string): string[] => {
  return routing.locales.map((locale) => {
    return path ? `/${locale}/books/${path}` : `/${locale}/books`;
  });
};