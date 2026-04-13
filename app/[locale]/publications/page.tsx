import React from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import PublicationsViewer from '@/components/publications-viewer';

const baseTPath = 'pages.Publications';
export const revalidate = 86400; // cache for 1 day

export async function generateMetadata ({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
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

const PublicationsPage = async ({ params }: { params: Promise<{locale: string}> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <div className="publications">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
            </Col>
          </Row>
          <PublicationsViewer />
        </Container>
      </div>
    </>
  )
}

export default PublicationsPage;