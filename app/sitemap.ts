import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
  return [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date('2024-09-11'),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          si: `${baseUrl}/si`,
        },
      },
    },
    {
      url: `${baseUrl}/en/teaching`,
      lastModified: new Date('2025-01-07'),
      changeFrequency: 'yearly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/teaching`,
          si: `${baseUrl}/si/teaching`,
        },
      },
    },
    {
      url: `${baseUrl}/en/research`,
      lastModified: new Date('2024-09-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/research`,
          si: `${baseUrl}/si/research`,
        },
      },
    },
    {
      url: `${baseUrl}/en/publications`,
      lastModified: new Date('2024-12-17'),
      changeFrequency: 'yearly',
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/en/publications`,
          si: `${baseUrl}/si/publications`,
        },
      },
    },
    {
      url: `${baseUrl}/en/awards`,
      lastModified: new Date('2024-09-11'),
      changeFrequency: 'yearly',
      priority: 0.4,
      alternates: {
        languages: {
          en: `${baseUrl}/en/awards`,
          si: `${baseUrl}/si/awards`,
        },
      },
    },
    {
      url: `${baseUrl}/en/experience`,
      lastModified: new Date('2025-01-07'),
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/en/experience`,
          si: `${baseUrl}/si/experience`,
        },
      },
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: new Date('2024-09-29'),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/en/contact`,
          si: `${baseUrl}/si/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/en/policy`,
      lastModified: new Date('2024-09-26'),
      changeFrequency: 'yearly',
      priority: 0.2,
      alternates: {
        languages: {
          en: `${baseUrl}/en/policy`,
          si: `${baseUrl}/si/policy`,
        },
      },
    },
  ]
}