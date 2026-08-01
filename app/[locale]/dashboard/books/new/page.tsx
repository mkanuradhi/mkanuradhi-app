import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import NewBookFormContainer from '@/components/new-book-form-container';

const baseTPath = 'pages.Dashboard.Books.New';

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('title'),
    robots: {
      index: false,
      follow: false,
    },
  };
};

interface NewBookPageProps {
  params: { locale: string };
}

const NewBookPage = async ({ params }: NewBookPageProps) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <NewBookFormContainer />
    </>
  )
}

export default NewBookPage;