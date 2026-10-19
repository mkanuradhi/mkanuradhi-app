import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateMediaContributionPreviewImagesForm from '@/components/update-media-contribution-preview-images-form';

const baseTPath = 'pages.Dashboard.MediaContributions.EditPreviewImages';

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

interface EditPreviewImagesPageProps {
  params: {
    locale: string;
    mediaContributionId: string;
  };
}

const EditPreviewImagesPage = async ({ params }: EditPreviewImagesPageProps) => {
  const { locale, mediaContributionId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateMediaContributionPreviewImagesForm mediaContributionId={mediaContributionId} />
    </>
  );
};

export default EditPreviewImagesPage;