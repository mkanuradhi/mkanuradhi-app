import { routing } from '@/i18n/routing';

export const getHomeRoutes = (): string[] => {
  return routing.locales.map((locale) => `/${locale}`);
};

export const getBookRoutes = (path?: string): string[] => {
  return routing.locales.map((locale) => {
    return path ? `/${locale}/books/${path}` : `/${locale}/books`;
  });
};

export const getAwardRoutes = (path?: string): string[] => {
  return routing.locales.map((locale) => {
    return path ? `/${locale}/awards/${path}` : `/${locale}/awards`;
  });
};
