import UpdateCourseFormsContainer from '@/components/update-course-forms-container';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

const baseTPath = 'pages.Dashboard.Courses.Edit';

interface EditCoursePageProps {
  params: {
    courseId: string;
  };
}

const EditCoursePage: React.FC<EditCoursePageProps> = async ({ params }) => {
  const t = await getTranslations(baseTPath);
  const { courseId } = params;

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <UpdateCourseFormsContainer id={courseId} />
    </>
  )
}

export default EditCoursePage;