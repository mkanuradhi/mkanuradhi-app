import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import NewQuizFormsContainer from '@/components/new-quiz-forms-container';


const baseTPath = 'pages.Dashboard.Courses.Quizzes.New';

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