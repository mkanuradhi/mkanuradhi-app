"use client";
import React from 'react';
import { Breadcrumb, Button, Col, Container, Row } from 'react-bootstrap';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Quiz from '@/interfaces/i-quiz';
import Mcq from '@/interfaces/i-mcq';
import { useCourseViewByPathQuery } from '@/hooks/use-courses';
import { useMcqsQuery } from '@/hooks/use-mcqs';
import LoadingContainer from './loading-container';
import { capitalizeLang } from '@/utils/common-utils';
import './quiz-viewer.scss';


const baseTPath = 'components.QuizViewer';

interface QuizViewerProps {
  coursePath: string;
  quiz: Quiz;
}

const QuizViewer: React.FC<QuizViewerProps> = ({ coursePath, quiz }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();

  const langSuffix = capitalizeLang(locale);
  const title = quiz[`title${langSuffix}` as keyof Quiz] as string;

  const { data: courseView, isPending: isPendingCourse, isError: isCourseError, isFetching: isFetchingCourse, error: courseError } = useCourseViewByPathQuery(locale, coursePath);
  const { data: mcqsPaginatedResult, isPending: isPendingMcqs, isError: isMcqsError, isFetching: isFetchingMcqs, error: mcqsError } = useMcqsQuery(quiz.id);
  const mcqs: Mcq[] = mcqsPaginatedResult?.items ?? [];

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
      <Container fluid="md" className="quiz-viewer">
        <Row className="my-4">
          <Col>
            <Row>
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
                  <Breadcrumb.Item linkAs="span">
                    <Link href={`/teaching/courses/${courseView.path}/quizzes`}>{t('quizzes')}</Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
            <Row>
              <Col>
                <h1>{title}</h1>
                <hr className="divider" />
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  <b className="me-2">{t('duration')}:</b>{ t.rich('numMinutes', {mins: quiz.duration}) }
                </p>
                <p>
                  <b className="me-2">{t('numOfQuestions')}:</b>{quiz.mcqs.length}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button variant="primary" className="mb-3">
                  {t('start')} <i className="bi bi-chevron-right"></i>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default QuizViewer;