import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateMediaContributionForm from '@/components/update-media-contribution-form';

const baseTPath = 'pages.Dashboard.MediaContributions.Edit';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('title'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

interface EditMediaContributionPageProps {
  params: {
    locale: string;
    mediaContributionId: string;
  };
}

const EditMediaContributionPage = async ({ params }: EditMediaContributionPageProps) => {
  const { locale, mediaContributionId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateMediaContributionForm mediaContributionId={mediaContributionId} />
    </>
  );
};

export default EditMediaContributionPage;