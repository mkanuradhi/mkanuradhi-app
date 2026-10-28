import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateMediaContributionAuthorImageForm from '@/components/update-media-contribution-author-image-form';

const baseTPath = 'pages.Dashboard.MediaContributions.EditAuthorImage';

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

interface EditMediaContributionAuthorImagePageProps {
  params: {
    locale: string;
    mediaContributionId: string;
    authorId: string;
  };
}

const EditMediaContributionAuthorImagePage = async ({ params }: EditMediaContributionAuthorImagePageProps) => {
  const { locale, mediaContributionId, authorId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateMediaContributionAuthorImageForm mediaContributionId={mediaContributionId} authorId={authorId} />
    </>
  );
};

export default EditMediaContributionAuthorImagePage;