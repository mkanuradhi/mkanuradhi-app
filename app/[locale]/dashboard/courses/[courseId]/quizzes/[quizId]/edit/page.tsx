import React from 'react';
import UpdateQuizFormsContainer from '@/components/update-quiz-forms-container';
import { getTranslations } from 'next-intl/server';
import { Col, Row } from 'react-bootstrap';


const baseTPath = 'pages.Dashboard.Courses.Quizzes.Edit';

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('title'),
    openGraph: {
      title: t('title'),
      type: 'website',
      images: [
        {
          url: '/images/mkanuradhi.png',
          width: 1200,
          height: 630,
          alt: 'MKA',
        },
        {
          url: '/images/mkanuradhis.png',
          width: 600,
          height: 314,
          alt: 'MKA',
        },
      ],
    }
  };
};

interface EditQuizPageProps {
  params: {
    courseId: string;
    quizId: string;
  };
}

const EditQuizPage: React.FC<EditQuizPageProps> = async ({ params }) => {
  const t = await getTranslations(baseTPath);
  const { courseId, quizId } = params;

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateQuizFormsContainer courseId={courseId} quizId={quizId} />
    </>
  )
}

export default EditQuizPage;