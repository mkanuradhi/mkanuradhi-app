"use client";
import { useCourseByIdQuery } from '@/hooks/use-courses';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import LoadingContainer from './loading-container';
import { Link } from '@/i18n/routing';
import { useQuizByIdQuery } from '@/hooks/use-quizzes';
import "./quiz-options-viewer.scss";
import { capitalizeLang, getFormattedDateTime } from '@/utils/common-utils';
import { LANG_EN, LANG_SI, LOCALE_EN, LOCALE_SI } from '@/constants/common-vars';

const baseTPath = 'components.QuizOptionsViewer';

interface QuizOptionsViewerProps {
  courseId: string;
  quizId: string;
}

const QuizOptionsViewer: React.FC<QuizOptionsViewerProps> = ({ courseId, quizId }) => {
  const t = useTranslations(baseTPath);
  const lang = useLocale();

  const { data: course, isPending: isPendingCourse, isError: isCourseError, isFetching: isFetchingCourse, error: courseError } = useCourseByIdQuery(courseId);
  const { data: quiz, isPending: isPendingQuiz, isError: isQuizError, isFetching: isFetchingQuiz, error: quizError } = useQuizByIdQuery(courseId, quizId);

  if (isPendingCourse || isFetchingCourse || isPendingQuiz || isFetchingQuiz ) {
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

  if (isQuizError && quizError) {
    return (
      <Row>
        <Col>
          <h5>{t('failQuiz')}</h5>
          <p>{quizError.message}</p>
        </Col>
      </Row>
    );
  }

  const fCode = course.code ? `${course.code} ` : '';
  const formattedCredits = course.credits ? course.credits.toFixed(1) : '';
  const titleKey = (lang === LANG_SI ? `titleSi` : `titleEn` );
  const formattedCourseTitle = `${course.year} ${fCode} ${formattedCredits} ${course[titleKey]}`;

  const locale = lang === LANG_SI ? LOCALE_SI : LOCALE_EN;
  const formattedAvailableFrom = quiz.availableFrom ? getFormattedDateTime(locale, quiz.availableFrom) : undefined;
  const formattedAvailableUntil = quiz.availableUntil ? getFormattedDateTime(locale, quiz.availableUntil) : undefined;
  
  let formattedAvailable = undefined;
  if (quiz.availableFrom && quiz.availableUntil) {
    formattedAvailable = t.rich('availableFromUntil', 
      {
        strong: (chunks) => <strong>{chunks}</strong>,
        from: formattedAvailableFrom,
        until: formattedAvailableUntil
      }
    );
  } else if (quiz.availableFrom) {
    formattedAvailable = t.rich('availableFrom', 
      {
        strong: (chunks) => <strong>{chunks}</strong>,
        from: formattedAvailableFrom
      }
    );
  } else if (quiz.availableUntil) {
    formattedAvailable = t.rich('availableUntil',
      {
        strong: (chunks) => <strong>{chunks}</strong>,
        until: formattedAvailableUntil
      }
    );
  }

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
              <Breadcrumb.Item linkAs="span">
                <Link href={`/dashboard/courses/${courseId}/quizzes`}>{t('quizzes')}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>{ quiz.titleEn } | { quiz.titleSi }</h1>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col>
            {quiz.duration && (
              <p>
                <b>{t('duration')}:</b>{" "}{ t.rich('numMinutes', {mins: quiz.duration}) }
              </p>
            )}
            {formattedAvailable && (
              <p>{formattedAvailable}</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default QuizOptionsViewer;
