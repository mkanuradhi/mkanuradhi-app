import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateMediaContributionOutletImageForm from '@/components/update-media-contribution-outlet-image-form';

const baseTPath = 'pages.Dashboard.MediaContributions.EditOutletImage';

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

interface EditOutletImagePageProps {
  params: {
    locale: string;
    mediaContributionId: string;
  };
}

const EditOutletImagePage = async ({ params }: EditOutletImagePageProps) => {
  const { locale, mediaContributionId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateMediaContributionOutletImageForm mediaContributionId={mediaContributionId} />
    </>
  );
};

export default EditOutletImagePage;