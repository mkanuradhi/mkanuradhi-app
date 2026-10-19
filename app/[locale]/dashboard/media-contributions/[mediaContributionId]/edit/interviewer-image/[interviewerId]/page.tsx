import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import UpdateMediaContributionInterviewerImageForm from '@/components/update-media-contribution-interviewer-image-form';

const baseTPath = 'pages.Dashboard.MediaContributions.EditInterviewerImage';

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

interface EditMediaContributionInterviewerImagePageProps {
  params: {
    locale: string;
    mediaContributionId: string;
    interviewerId: string;
  };
}

const EditMediaContributionInterviewerImagePage = async ({ params }: EditMediaContributionInterviewerImagePageProps) => {
  const { locale, mediaContributionId, interviewerId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateMediaContributionInterviewerImageForm mediaContributionId={mediaContributionId} interviewerId={interviewerId} />
    </>
  );
};

export default EditMediaContributionInterviewerImagePage;