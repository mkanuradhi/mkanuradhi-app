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
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
    // For automatic conversion
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(nextConfig);
