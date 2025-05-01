"use client";
import React, { useState } from 'react';
import { useCourseByIdQuery } from '@/hooks/use-courses';
import { useLocale, useTranslations } from 'next-intl';
import { Breadcrumb, Button, Col, Container, Row } from 'react-bootstrap';
import LoadingContainer from './loading-container';
import { Link } from '@/i18n/routing';
import { useQuizByIdQuery } from '@/hooks/use-quizzes';
import { getFormattedDateTime } from '@/utils/common-utils';
import { LANG_SI, LOCALE_EN, LOCALE_SI } from '@/constants/common-vars';
import McqOptionsCard from './mcq-options-card';
import { useMcqsQuery } from '@/hooks/use-mcqs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import NewMcqModal from './new-mcq-modal';
import "./quiz-options-viewer.scss";
import SanitizedHtml from './sanitized-html';


const baseTPath = 'components.QuizOptionsViewer';

interface QuizOptionsViewerProps {
  courseId: string;
  quizId: string;
}

const QuizOptionsViewer: React.FC<QuizOptionsViewerProps> = ({ courseId, quizId }) => {
  const t = useTranslations(baseTPath);
  const lang = useLocale();
  const [newModalShow, setNewModalShow] = useState(false);

  const { data: course, isPending: isPendingCourse, isError: isCourseError, isFetching: isFetchingCourse, error: courseError } = useCourseByIdQuery(courseId);
  const { data: quiz, isPending: isPendingQuiz, isError: isQuizError, isFetching: isFetchingQuiz, error: quizError } = useQuizByIdQuery(courseId, quizId);
  const { data: mcqsPaginatedResult, isPending: isPendingMcqs, isError: isMcqsError, isFetching: isFetchingMcqs, error: mcqsError } = useMcqsQuery(quizId);

  const mcqs = mcqsPaginatedResult?.items ?? [];
  
  if (isPendingCourse || isFetchingCourse || isPendingQuiz || isFetchingQuiz || isPendingMcqs || isFetchingMcqs ) {
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

  if (isMcqsError && isMcqsError) {
    return (
      <Row>
        <Col>
          <h5>{t('failMcqs')}</h5>
          <p>{mcqsError.message}</p>
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

  const handleAddNewMcq = () => {
    setNewModalShow(false);
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
        <Row className="my-3">
          <Col>
            <SanitizedHtml html={quiz.descriptionEn} />
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <SanitizedHtml html={quiz.descriptionSi} />
          </Col>
        </Row>
        <Row>
          <Col>
            {quiz.duration && (
              <p>
                <b className="me-2">{t('duration')}:</b>{ t.rich('numMinutes', {mins: quiz.duration}) }
              </p>
            )}
            {formattedAvailable && (
              <p>{formattedAvailable}</p>
            )}
            {mcqs && (
              <p><b className="me-2">{t('allQuestions')}:</b>{mcqs.length}</p>
            )}
            {quiz.mcqs && (
              <p><b className="me-2">{t('activeQuestions')}:</b>{quiz.mcqs.length}</p>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            {mcqs.map(mcq => (
              <div key={mcq.id}>
                <McqOptionsCard quizId={quizId} mcqId={mcq.id} />
              </div>
            ))}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              onClick={() => setNewModalShow(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" aria-hidden="true" />{ t('addNew') }
            </Button>  
          </Col>
        </Row>
      </Container>
      <NewMcqModal
        quizId={quizId}
        show={newModalShow}
        onHide={() => setNewModalShow(false)}
        onConfirm={handleAddNewMcq}
      />
    </>
  );
}

export default QuizOptionsViewer;
