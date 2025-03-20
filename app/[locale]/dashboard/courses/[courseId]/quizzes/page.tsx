import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from '@/i18n/routing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getCourseById } from '@/services/course-service';

const baseTPath = 'pages.Dashboard.Courses.Quizzes';

const QuizzesPage = async ({ params }: { params: { locale: string, courseId: string } }) => {
  const { locale, courseId } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  const course = await getCourseById(courseId);
  const formattedCredits = course.credits ? course.credits.toFixed(1) : course.credits;

  return (
    <>
      <Row>
        <Col>
          <h5>{course.year}</h5>
          <h4>
            { course.code && `${course.code} ` }
            { course.credits && `${formattedCredits} ` }
          </h4>
          <h1>{course.titleEn}</h1>
          <h2>{course.titleSi}</h2>
          <hr />
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <h3>{t('title')}</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link href={`/dashboard/courses/${courseId}/quizzes/new`}>
            <Button>
              <FontAwesomeIcon icon={faPlus} className="me-1" aria-hidden="true" />{ t('addNew') }
            </Button>
          </Link>
        </Col>
      </Row>
      { course.quizzes && course.quizzes.length > 0 && (
        <Row className="my-4">
          <Col>
            <ol>
              {course.quizzes.map((quiz) => (
                <li key={quiz.id}>
                  <Link href={`/dashboard/courses/${courseId}/quizzes/${quiz.id}`} className="text-decoration-none">
                    {quiz.titleEn} {" | "}{quiz.titleSi}
                  </Link>
                </li>
              ))}
            </ol>
          </Col>
        </Row>
      )}
    </>
  )
}

export default QuizzesPage;