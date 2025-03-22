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
import QuizOptionsCard from './quiz-options-card';
import { useQuizzesQuery } from '@/hooks/use-quizzes';
import "./quizzes-table.scss";

const baseTPath = 'components.QuizzesTable';

interface QuizzesTableProps {
  courseId: string;
}

const QuizzesTable: React.FC<QuizzesTableProps> = ({ courseId }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();

  const { data: course, isPending: isPendingCourse, isError: isCourseError, isFetching: isFetchingCourse, error: courseError } = useCourseByIdQuery(courseId);
  const { data: quizzesPaginatedResult, isPending: isPendingQuizzes, isError: isQuizzesError, isFetching: isFetchingQuizzes, error: quizzesError } = useQuizzesQuery(courseId);

  const quizzes = quizzesPaginatedResult?.items ?? [];

  if (isPendingCourse || isFetchingCourse || isPendingQuizzes || isFetchingQuizzes) {
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

  if (isQuizzesError && quizzesError) {
    return (
      <Row>
        <Col>
          <h5>{t('failQuizzes')}</h5>
          <p>{quizzesError.message}</p>
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
      <Container fluid="md" className="quizzes-table">
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
        <Row className="">
          <Col>
            <h1>{t('title')}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link href={`/dashboard/courses/${courseId}/quizzes/new`}>
              <Button>
                <FontAwesomeIcon icon={faPlus} className="me-2" aria-hidden="true" />{ t('addNew') }
              </Button>
            </Link>
          </Col>
        </Row>
        {quizzes && quizzes.length > 0 ? (
          quizzes.map((quiz, index) => (
            <Row key={index}>
              <Col>
                <QuizOptionsCard courseId={courseId} quizId={quiz.id} />
              </Col>
            </Row>
          ))
        ) : (
          <Row>
            <Col>{t('noQuizzes')}</Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default QuizzesTable;
