import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import NewMediaContributionFormContainer from '@/components/new-media-contribution-form-container';

const baseTPath = 'pages.Dashboard.MediaContributions.New';

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

interface NewMediaContributionPageProps {
  params: { locale: string };
}

const NewMediaContributionPage = async ({ params }: NewMediaContributionPageProps) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <NewMediaContributionFormContainer />
    </>
  )
}

export default NewMediaContributionPage;