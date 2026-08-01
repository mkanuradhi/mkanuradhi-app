import UpdateAwardFormsContainer from '@/components/update-award-forms-container';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

const baseTPath = 'pages.Dashboard.Awards.Edit';

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

interface EditAwardPageProps {
  params: {
    awardId: string;
  };
}

const EditAwardPage: React.FC<EditAwardPageProps> = async ({ params }) => {
  const t = await getTranslations(baseTPath);
  const { awardId } = params;

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateAwardFormsContainer id={awardId} />
    </>
  )
}

export default EditAwardPage;