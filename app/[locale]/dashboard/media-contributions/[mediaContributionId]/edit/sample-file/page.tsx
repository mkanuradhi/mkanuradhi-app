import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateMediaContributionSampleFileForm from '@/components/update-media-contribution-sample-file-form';

const baseTPath = 'pages.Dashboard.Books.EditSampleFile';

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

interface EditSampleFilePageProps {
  params: {
    locale: string;
    mediaContributionId: string;
  };
}

const EditSampleFilePage = async ({ params }: EditSampleFilePageProps) => {
  const { locale, mediaContributionId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateMediaContributionSampleFileForm mediaContributionId={mediaContributionId} />
    </>
  );
};

export default EditSampleFilePage;