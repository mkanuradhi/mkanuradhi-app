import React from 'react';
import "./globals.scss";

export async function generateMetadata () {

  return {
    title: {
      template: `%s - M K A Ariyaratne`,
      default: `M K A Ariyaratne`,
    },
    description: '',
    keywords: '',
    openGraph: {
      title: 'M K A Ariyaratne',
      description: '',
      url: "https://www.mkanuradhi.com",
      siteName: 'mkanuradhi',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/images/mkanuradhi.png',
          width: 1200,
          height: 630,
          alt: 'MKA',
        },
        {
          url: '/images/anuradha.png',
          width: 500,
          height: 500,
          alt: 'MKA',
        },
      ],
    }
  };
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