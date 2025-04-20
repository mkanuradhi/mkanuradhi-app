import React from 'react';
import UpdateQuizFormsContainer from '@/components/update-quiz-forms-container';
import { getTranslations } from 'next-intl/server';
import { Col, Row } from 'react-bootstrap';


const baseTPath = 'pages.Dashboard.Courses.Quizzes.Edit';

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