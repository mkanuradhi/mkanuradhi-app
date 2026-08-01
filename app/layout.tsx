import React from 'react';
import { Metadata } from 'next';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import "./globals.scss";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mkanuradhi.com';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s - M K A Ariyaratne`,
      default: `M K A Ariyaratne`,
    },
    description: '',
    keywords: '',
    openGraph: {
      title: 'M K A Ariyaratne',
      description: '',
      url: '/',
      siteName: 'mkanuradhi',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/images/og/mka.png',
          width: 1200,
          height: 630,
          alt: 'M.K.A. Ariyaratne, Senior Lecturer in Computer Science',
          type: 'image/png',
        },
        {
          url: '/images/og/mka-600.png',
          width: 600,
          height: 315,
          alt: 'M.K.A. Ariyaratne, Senior Lecturer in Computer Science',
          type: 'image/png',
        },
      ],
    }
};
 
export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <>
      {children}
    </>
  );
}