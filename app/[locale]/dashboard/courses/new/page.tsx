import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getTranslations } from 'next-intl/server';
import NewCourseFormsContainer from '@/components/new-course-forms-container';

const baseTPath = 'pages.Dashboard.Courses.New';

const NewCoursePage = async () => {
  const t = await getTranslations(baseTPath);

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <NewCourseFormsContainer />
    </>
  )
}

export default NewCoursePage;