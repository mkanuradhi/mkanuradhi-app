import React from 'react';
import UpdateResearchFormsContainer from '@/components/update-research-forms-container';
import { getTranslations } from 'next-intl/server';
import { Col, Row } from 'react-bootstrap';

const baseTPath = 'pages.Dashboard.Research.Edit';

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

interface EditResearchPageProps {
  params: {
    researchId: string;
  };
}

const EditResearchPage: React.FC<EditResearchPageProps> = async ({ params }) => {
  const t = await getTranslations(baseTPath);
  const { researchId } = params;

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateResearchFormsContainer researchId={researchId} />
    </>
  )
}

export default EditResearchPage;