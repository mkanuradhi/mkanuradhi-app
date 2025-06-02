import React from 'react';
import UpdatePublicationFormsContainer from '@/components/update-publication-forms-container';
import { getTranslations } from 'next-intl/server';
import { Col, Row } from 'react-bootstrap';

const baseTPath = 'pages.Dashboard.Publications.Edit';

interface EditPublicationPageProps {
  params: {
    publicationId: string;
  };
}

const EditPublicationPage: React.FC<EditPublicationPageProps> = async ({ params }) => {
  const t = await getTranslations(baseTPath);
  const { publicationId } = params;

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdatePublicationFormsContainer publicationId={publicationId} />
    </>
  )
}

export default EditPublicationPage;