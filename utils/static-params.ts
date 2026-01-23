import { AVAILABLE_LANGS } from "@/constants/common-vars";

/**
 * Generate static params for locale-only routes
 * Use this for pages like /[locale]/policy, /[locale]/contact, etc.
 */
export const generateLocaleParams = () => 
  AVAILABLE_LANGS.map(locale => ({ locale }));


/**
 * Generate static params for routes with locale + slug
 * Use this for pages like /[locale]/blog/[slug], /[locale]/courses/[slug]
 * 
 * @param slugs - Array of slug values to generate
 * @returns Array of { locale, slug } combinations
 * 
 * @example
 * ```typescript
 * const posts = await getAllBlogPosts();
 * return generateLocaleSlugParams(posts.map(p => p.slug));
 * ```
 */
export const generateLocaleSlugParams = (slugs: string[]) =>
  AVAILABLE_LANGS.flatMap(locale =>
    slugs.map(slug => ({ locale, slug }))
  );