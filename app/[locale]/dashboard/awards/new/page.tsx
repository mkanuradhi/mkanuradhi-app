import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import NewAwardFormsContainer from '@/components/new-award-forms-container';

const baseTPath = 'pages.Dashboard.Awards.New';

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

const NewAwardPage = async () => {
  const t = await getTranslations(baseTPath);

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <NewAwardFormsContainer />
    </>
  )
}

export default NewAwardPage;