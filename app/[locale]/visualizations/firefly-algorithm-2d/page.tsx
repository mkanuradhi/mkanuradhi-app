import React from 'react';
import { getTranslations } from 'next-intl/server';
import Ffy2DContainer from './components/ffy-2d-container';

const baseTPath = 'pages.Visualizations.ffy2d';
export const revalidate = 604800; // cache for 1 week

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    keywords: t('pageKeywords'),
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      type: 'website',
      images: [
        {
          url: '/images/mkanuradhi.png',
          width: 1200,
          height: 630,
          alt: 'MKA',
        },
      ],
    }
  };
};

const VisualizationsPage = async () => {
  return (
    <Ffy2DContainer />
  )
}

export default VisualizationsPage;