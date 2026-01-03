import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow loading from image CDN, i.ibb.co
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
    ],
    // For automatic conversion
    formats: ['image/avif', 'image/webp'],
  },

  // Cache-Control Headers
  async headers() {
    return [
      // IMPORTANT: Order matters - 'no-store' rules before the public cache

      // 1) Never cache auth/protected areas
      {
        source: '/:locale(en|si)/dashboard/:path*',
        headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
      },
      {
        source: '/:locale(en|si)/sign-in',
        headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
      },
      {
        source: '/:locale(en|si)/sign-in/:path*',
        headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
      },
      {
        source: '/:locale(en|si)/sign-up',
        headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
      },
      {
        source: '/:locale(en|si)/sign-up/:path*',
        headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
      },

      // 2) Cache Next.js static assets - safe to cache long
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },

      // 2.5) Next.js image optimization
      {
        source: '/_next/image',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' }],
      },

      // 3) my own public static folders
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' }],
      },
      {
        source: '/icons/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' }],
      },

      // 4) Cache all public pages
      {
        source: '/:locale(en|si)',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }],
      },
      {
        source: '/:locale(en|si)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
