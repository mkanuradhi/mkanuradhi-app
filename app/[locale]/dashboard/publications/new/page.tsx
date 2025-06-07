import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import NewPublicationFormsContainer from '@/components/new-publication-forms-container';

const baseTPath = 'pages.Dashboard.Publications.New';

const NewPublicationPage = async () => {
  const t = await getTranslations(baseTPath);

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <NewPublicationFormsContainer />
    </>
  )
}

export default NewPublicationPage;