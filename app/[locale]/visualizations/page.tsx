import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import VisualizationsContainer from '@/components/visualizations-container';

const baseTPath = 'pages.Visualizations';
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
  const t = await getTranslations(baseTPath);

  const visuals = [
    {
      id: 1,
      title: t('visuals.ffy2d.title'),
      description: t('visuals.ffy2d.description'),
      path: '/visualizations/firefly-algorithm-2d',
      image: 'firefly-2d.jpg',
    },
    // {
    //   id: 2,
    //   title: t('visuals.bat2d.title'),
    //   description: t('visuals.bat2d.description'),
    //   path: '/visualizations/bat-algorithm-2d',
    //   image: 'bat-alg.jpg',
    // },
    // {
    //   id: 3,
    //   title: t('visuals.vis3.title'),
    //   description: t('visuals.vis3.description'),
    //   path: '/visualizations/visualization-3',
    //   image: '',
    // },
  ];

  return (
    <div className="visualizations">
      <section className='hero my-4'>
        <Container fluid="xl">
          <h1 className="display-1 mb-4">{t('title')}</h1>
          <p className="lead">{t('description')}</p>
        </Container>
      </section>
      <Row>
        <Col>
          <VisualizationsContainer visuals={visuals} />
        </Col>
      </Row>
    </div>
  )
}

export default VisualizationsPage;