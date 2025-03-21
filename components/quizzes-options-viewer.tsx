"use client";
import { useCourseByIdQuery } from '@/hooks/use-courses';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { Breadcrumb, Button, Col, Container, Row } from 'react-bootstrap';
import LoadingContainer from './loading-container';
import { Link } from '@/i18n/routing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { capitalizeLang } from '@/utils/common-utils';
import "./quizzes-options-viewer.scss";

const baseTPath = 'components.QuizzesOptionsViewer';

interface QuizzesOptionsViewerProps {
  courseId: string;
}

const QuizzesOptionsViewer: React.FC<QuizzesOptionsViewerProps> = ({ courseId }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();

  const { data: course, isPending: isPendingCourse, isError: isCourseError, isFetching: isFetchingCourse, error: courseError } = useCourseByIdQuery(courseId);

  if (isPendingCourse || isFetchingCourse) {
    return (<LoadingContainer />);
  }

  if (isCourseError && courseError) {
    return (
      <Row>
        <Col>
          <h5>{t('failCourse')}</h5>
          <p>{courseError.message}</p>
        </Col>
      </Row>
    );
  }

  const fCode = course.code ? `${course.code} ` : '';
  const formattedCredits = course.credits ? course.credits.toFixed(1) : '';
  const titleKey = `title${capitalizeLang(locale)}` as `titleEn` | 'titleSi';
  const formattedCourseTitle = `${course.year} ${fCode} ${formattedCredits} ${course[titleKey]}`;

  return (
    <>
      <Container fluid="md" className="quiz-options-viewer">
        <Row>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard">{t('dashboard')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard/courses">{t('courses')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href={`/dashboard/courses/${courseId}`}>{`${formattedCourseTitle}`}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <h1>{t('title')}</h1>
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
                      {quiz.titleEn}{" | "}{quiz.titleSi}
                    </Link>
                  </li>
                ))}
              </ol>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default QuizzesOptionsViewer;
