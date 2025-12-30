import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import { getAwards } from '@/services/award-service';
import AwardsTimeline from '@/components/awards-timeline';

const baseTPath = 'pages.Awards';
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

const AwardsPage = async () => {
  const t = await getTranslations(baseTPath);
  const awards = await getAwards(0, 100);

  return (
    <>
      <div className="awards">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <section>
                <h1>{t('title')}</h1>
                <p>{t('description')}</p>
              </section>
              <section>
                <AwardsTimeline awards={awards.items} />
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default AwardsPage;