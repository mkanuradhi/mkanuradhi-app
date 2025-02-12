import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import { auth } from '@clerk/nextjs/server';

const baseTPath = 'pages.Dashboard';

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
        {
          url: '/images/mkanuradhis.png',
          width: 600,
          height: 314,
          alt: 'MKA',
        },
      ],
    }
  };
};

const DashboardPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });
  const { userId } = await auth();

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1>{t('title')}</h1>
            <p>{t('pageDescription')}</p>
            <p>User id: { userId }</p>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default DashboardPage;