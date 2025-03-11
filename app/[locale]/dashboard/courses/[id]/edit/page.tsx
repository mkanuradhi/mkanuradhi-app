import UpdateCourseFormsContainer from '@/components/update-course-forms-container';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

const baseTPath = 'pages.Dashboard.Courses.Edit';

interface EditCoursePageProps {
  params: {
    id: string;
  };
}

const EditCoursePage: React.FC<EditCoursePageProps> = async ({ params }) => {
  const t = await getTranslations(baseTPath);
  const { id } = params;

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateCourseFormsContainer id={id} />
    </>
  )
}

export default EditCoursePage;