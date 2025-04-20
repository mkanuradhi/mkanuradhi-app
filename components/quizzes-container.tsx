"use client";
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import { Link } from '@/i18n/routing';
import Quiz from '@/interfaces/i-quiz';
import QuizCard from './quiz-card';
import { useCourseViewByPathQuery } from '@/hooks/use-courses';
import LoadingContainer from './loading-container';
import "./quizzes-container.scss";


const baseTPath = 'components.QuizzesContainer';

interface QuizzesContainerProps {
  coursePath: string,
  quizzes: Quiz[]
}

const QuizzesContainer: React.FC<QuizzesContainerProps> = ({ coursePath, quizzes }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();

  const { data: courseView, isPending: isPendingCourse, isError: isCourseError, isFetching: isFetchingCourse, error: courseError } = useCourseViewByPathQuery(locale, coursePath);

  if (isPendingCourse || isFetchingCourse ) {
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

  const fCode = courseView.code ? `${courseView.code} ` : '';
  const formattedCredits = courseView.credits ? courseView.credits.toFixed(1) : '';
  const formattedCourseTitle = `${courseView.year} ${fCode} ${formattedCredits} ${courseView.title}`;

  return (
    <>
      <Container className="quizzes-container">
        <Row className="mt-4">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item linkAs="span">
                <Link href="/">{t('home')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href="/teaching">{t('teaching')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href="/teaching/courses">{t('courses')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href={`/teaching/courses/${courseView.path}`}>{formattedCourseTitle}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>{t('title')}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            { quizzes.length > 0 && quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default QuizzesContainer;