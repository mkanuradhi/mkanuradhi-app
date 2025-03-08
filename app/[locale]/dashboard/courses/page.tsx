import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from '@/i18n/routing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ActiveStep from '@/enums/active-step';
import { getCourses } from '@/services/course-service';
import CoursesTable from '@/components/courses-table';

const baseTPath = 'pages.Dashboard.Courses';

const CoursesPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  const initialPaginatedResult = await getCourses(0, 10);

  return (
    <>
      <Row>
        <Col>
          <h1>{t('title')}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link href={`/dashboard/course/new?step=${ActiveStep.EN}`}>
            <Button>
              <FontAwesomeIcon icon={faPlus} className="me-1" aria-hidden="true" />{ t('addNew') }
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <CoursesTable initialCourses={initialPaginatedResult} />
        </Col>
      </Row>
    </>
  )
}

export default CoursesPage;