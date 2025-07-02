import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Button, Col, Row } from 'react-bootstrap';
import { getPublications } from '@/services/publication-service';
import ResearchTable from '@/components/research-table';
import { Link } from '@/i18n/routing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getResearches } from '@/services/research-service';

const baseTPath = 'pages.Dashboard.Research';

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

const ResearchPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  const initialPaginatedResult = await getResearches(0, 10);

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link href={`/dashboard/research/new`}>
            <Button>
              <FontAwesomeIcon icon={faPlus} className="me-2" aria-hidden="true" />{ t('addNew') }
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <ResearchTable initialResearch={initialPaginatedResult} />
        </Col>
      </Row>
    </>
  )
}

export default ResearchPage;