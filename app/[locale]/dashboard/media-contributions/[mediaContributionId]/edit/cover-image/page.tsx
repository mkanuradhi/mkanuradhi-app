import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateMediaContributionCoverImageForm from '@/components/update-media-contribution-cover-image-form';

const baseTPath = 'pages.Dashboard.MediaContributions.EditCoverImage';

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

interface EditCoverImagePageProps {
  params: {
    locale: string;
    mediaContributionId: string;
  };
}

const EditCoverImagePage = async ({ params }: EditCoverImagePageProps) => {
  const { locale, mediaContributionId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateMediaContributionCoverImageForm mediaContributionId={mediaContributionId} />
    </>
  );
};

export default EditCoverImagePage;