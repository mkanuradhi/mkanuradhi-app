import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import NewQuizFormsContainer from '@/components/new-quiz-forms-container';


const baseTPath = 'pages.Dashboard.Courses.Quizzes.New';

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

interface NewQuizPageProps {
  params: {
    courseId: string;
  };
}

const NewQuizPage: React.FC<NewQuizPageProps> = async ({params}) => {
  const t = await getTranslations(baseTPath);
  const { courseId } = params;

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <NewQuizFormsContainer courseId={courseId} />
    </>
  )
}

export default NewQuizPage;