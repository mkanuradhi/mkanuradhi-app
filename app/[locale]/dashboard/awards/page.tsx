import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Button, Col, Row } from 'react-bootstrap';
import AwardsTable from '@/components/awards-table';
import { getAwards } from '@/services/award-service';
import { Link } from '@/i18n/routing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const baseTPath = 'pages.Dashboard.Awards';

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('pageTitle'),
    openGraph: {
      title: t('pageTitle'),
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

const AwardsPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  const initialPaginatedResult = await getAwards(0, 10);

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link href={`/dashboard/awards/new`}>
            <Button>
              <FontAwesomeIcon icon={faPlus} className="me-2" aria-hidden="true" />{ t('addNew') }
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <AwardsTable initialAwards={initialPaginatedResult} />
        </Col>
      </Row>
    </>
  )
}

export default AwardsPage;