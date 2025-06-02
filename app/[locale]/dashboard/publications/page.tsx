import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Button, Col, Row } from 'react-bootstrap';
import { getPublications } from '@/services/publication-service';
import PublicationsTable from '@/components/publications-table';
import { Link } from '@/i18n/routing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const baseTPath = 'pages.Dashboard.Publications';

const BlogPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  const initialPaginatedResult = await getPublications(0, 10);

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link href={`/dashboard/publications/new`}>
            <Button>
              <FontAwesomeIcon icon={faPlus} className="me-2" aria-hidden="true" />{ t('addNew') }
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <PublicationsTable initialPublications={initialPaginatedResult} />
        </Col>
      </Row>
    </>
  )
}

export default BlogPage;