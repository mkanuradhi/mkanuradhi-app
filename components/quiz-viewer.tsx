"use client";
import React, { useState } from 'react';
import { Breadcrumb, Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Quiz from '@/interfaces/i-quiz';
import Mcq from '@/interfaces/i-mcq';
import { useCourseViewByPathQuery } from '@/hooks/use-courses';
import { useActiveMcqsQuery } from '@/hooks/use-mcqs';
import LoadingContainer from './loading-container';
import { capitalizeLang } from '@/utils/common-utils';
import { AnimatePresence, motion } from 'framer-motion';
import MathRenderer from './math-renderer';
import ScrollToTopButton from './scroll-to-top-button';
import './quiz-viewer.scss';


const baseTPath = 'components.QuizViewer';

interface QuizViewerProps {
  coursePath: string;
  quiz: Quiz;
}

const QuizViewer: React.FC<QuizViewerProps> = ({ coursePath, quiz }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, number[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const langSuffix = capitalizeLang(locale);
  const title = quiz[`title${langSuffix}` as keyof Quiz] as string;

  const { data: courseView, isPending: isPendingCourse, isError: isCourseError, isFetching: isFetchingCourse, error: courseError } = useCourseViewByPathQuery(locale, coursePath);
  const { data: mcqsPaginatedResult, isPending: isPendingMcqs, isError: isMcqsError, isFetching: isFetchingMcqs, error: mcqsError } = useActiveMcqsQuery(quiz.id);
  const mcqs: Mcq[] = mcqsPaginatedResult?.items ?? [];

  if (isPendingCourse || isFetchingCourse || isPendingMcqs || isFetchingMcqs) {
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

  if (isMcqsError && mcqsError) {
    return (
      <Row>
        <Col>
          <h5>{t('failMcqs')}</h5>
          <p>{mcqsError.message}</p>
        </Col>
      </Row>
    );
  }

  const fCode = courseView.code ? `${courseView.code} ` : '';
  const formattedCredits = courseView.credits ? courseView.credits.toFixed(1) : '';
  const formattedCourseTitle = `${courseView.year} ${fCode} ${formattedCredits} ${courseView.title}`;

  const handleNext = () => {
    if (currentIndex < mcqs.length - 1) setCurrentIndex(prev => prev + 1);
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    console.log("Quiz submitted!", selectedChoices);
  };

  const handleToggleChoice = (mcqIndex: number, choiceIndex: number) => {
    setSelectedChoices(prev => {
      const current = prev[mcqIndex] ?? [];
      const alreadySelected = current.includes(choiceIndex);
      const updated = alreadySelected
        ? current.filter(i => i !== choiceIndex)
        : [...current, choiceIndex];
      return { ...prev, [mcqIndex]: updated };
    });
  };

  const totalQuestions = mcqs.length;

  const attemptedQuestions = Object.keys(selectedChoices).filter((key) => {
    const index = parseInt(key, 10);
    return selectedChoices[index]?.length > 0;
  }).length;

  let correctQuestions = 0;
  let partiallyCorrectQuestions = 0;
  let incorrectQuestions = 0;

  mcqs.forEach((mcq, index) => {
    const correctIndexes = mcq.choices
      .map((c, i) => (c.isCorrect ? i : -1))
      .filter((i) => i !== -1);
  
    const selected = selectedChoices[index] ?? [];
  
    if (selected.length === 0) {
      // Unattempted
      return;
    }
  
    const selectedCorrect = selected.filter(i => correctIndexes.includes(i));
  
    const allCorrectSelected = correctIndexes.every(i => selected.includes(i));
    const onlyCorrectSelected = selected.every(i => correctIndexes.includes(i));
  
    if (allCorrectSelected && onlyCorrectSelected) {
      correctQuestions++;
    } else if (selectedCorrect.length > 0) {
      partiallyCorrectQuestions++;
    } else {
      incorrectQuestions++;
    }
  });

  const notAttemptedQuestions = totalQuestions - attemptedQuestions;
  const scorePercentage = Math.round((correctQuestions / totalQuestions) * 100);

  return (
    <>
      <Container fluid="md" className="quiz-viewer">
        {!started && (
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
                <Button variant="primary" className="mb-3" onClick={() => setStarted(true)}>
                  {t('start')} <i className="bi bi-chevron-double-right"></i>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        )}
        {started && !submitted && (/* quize */
          <>
            <Row className="my-4">
              <Col>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div>
                      <p className="fs-6 text-muted mb-2">
                        {t('questionProgress', { current: currentIndex + 1, total: mcqs.length })}
                      </p>
                    </div>
                    <div className="fs-4 fw-medium mb-4">
                      <MathRenderer html={mcqs[currentIndex].question} />
                    </div>
                    <ul className="list-unstyled">
                      {mcqs[currentIndex].choices.map((choice, index) => {
                        const isChecked = selectedChoices[currentIndex]?.includes(index) ?? false;
                        return (
                          <li key={index} className="mb-2">
                            <Card>
                              <Card.Body>
                                <label className="d-flex align-items-center gap-2">
                                  {mcqs[currentIndex].isMultiSelect && (
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleToggleChoice(currentIndex, index)}
                                    />
                                  )}
                                  {!mcqs[currentIndex].isMultiSelect && (
                                    <input
                                      type="radio"
                                      name={`question-${currentIndex}`}
                                      checked={selectedChoices[currentIndex]?.[0] === index}
                                      onChange={() => setSelectedChoices(prev => ({
                                        ...prev,
                                        [currentIndex]: [index]
                                      }))}
                                    />
                                  )}
                                  <MathRenderer html={choice.text} />
                                </label>
                              </Card.Body>
                            </Card>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </Col>
            </Row>
            <Row className="my-4">
              <Col className="text-start">
                {currentIndex > 0 && (
                  <Button onClick={handlePrev} variant="secondary">
                    <i className="bi bi-chevron-left"></i> {t('prev')}
                  </Button>
                )}
              </Col>
              <Col className="text-end">
                {currentIndex === mcqs.length - 1 ? (
                  <Button variant="success" onClick={() => setShowConfirmModal(true)}>
                    {t('submit')} <i className="bi bi-check"></i>
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    {t('next')} <i className="bi bi-chevron-right"></i>
                  </Button>
                )}
              </Col>
            </Row>
          </>
        )}
        {started && submitted && ( /* results */
          <>
            <Row className="my-4">
              <Col>
                <h1 className="mb-4">{t('resultTitle')}</h1>
                {/* result summary */}
                <Card className="mb-4 shadow-sm border-primary">
                  <Card.Body>
                    <h4 className="mb-3">
                      <i className="bi bi-bar-chart-fill me-2"></i> {t('resultSummaryTitle')}
                    </h4>
                    <Row className="fs-5 fw-medium">
                      <Col md={6} lg={4} className="mb-2">
                        <span>
                          <i className="bi bi-list-ol me-2 text-secondary"></i>
                          {t('totalQuestions')}: {totalQuestions}
                        </span>
                      </Col>

                      {attemptedQuestions < totalQuestions && (
                        <Col md={6} lg={4} className="mb-2">
                          <span className="text-warning">
                            <i className="bi bi-pencil-square me-2"></i>
                            {t('attemptedQuestions')}: {attemptedQuestions}
                          </span>
                        </Col>
                      )}

                      {notAttemptedQuestions > 0 && (
                        <Col md={6} lg={4} className="mb-2">
                          <span className="text-secondary">
                            <i className="bi bi-slash-circle me-2"></i>
                            {t('notAttemptedQuestions')}: {notAttemptedQuestions}
                          </span>
                        </Col>
                      )}

                      <Col md={6} lg={4} className="mb-2">
                        <span className="text-danger">
                          <i className="bi bi-x-circle me-2"></i>
                          {t('incorrectAnswers')}: {incorrectQuestions}
                        </span>
                      </Col>

                      {partiallyCorrectQuestions > 0 && (
                        <Col md={6} lg={4} className="mb-2">
                          <span className="text-info">
                            <i className="bi bi-hand-thumbs-up me-2"></i>
                            {t('partialCorrectAnswers')}: {partiallyCorrectQuestions}
                          </span>
                        </Col>
                      )}

                      <Col md={6} lg={4} className="mb-2">
                        <span className="text-success">
                          <i className="bi bi-check2-circle me-2"></i>
                          {t('correctAnswers')}: {correctQuestions}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p className="fs-5 text-primary fw-bold">
                          <i className="bi bi-star-fill me-2"></i>
                          {t('finalScore')}: {scorePercentage}%
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card> {/* result summary end */}
                {mcqs.map((mcq, mcqIndex) => {
                  const selected = selectedChoices[mcqIndex] ?? [];

                  const correctIndexes = mcq.choices
                    .map((c, i) => (c.isCorrect ? i : -1))
                    .filter((i) => i !== -1);

                  const selectedCorrect = selected.filter(i => correctIndexes.includes(i));
                  const allCorrectSelected = correctIndexes.every(i => selected.includes(i));
                  const onlyCorrectSelected = selected.every(i => correctIndexes.includes(i));

                  let badgeLabel: React.ReactNode;
                  let badgeVariant = '';

                  if (selected.length === 0) {
                    badgeLabel = (
                      <>
                        <i className="bi bi-slash-circle me-1"></i> {t('notAttempted')}
                      </>
                    );
                    badgeVariant = 'secondary';
                  } else if (allCorrectSelected && onlyCorrectSelected) {
                    badgeLabel = (
                      <>
                        <i className="bi bi-check-circle me-1"></i> {t('correct')}
                      </>
                    );
                    badgeVariant = 'success';
                  } else if (selectedCorrect.length > 0) {
                    badgeLabel = (
                      <>
                        <i className="bi bi-hand-thumbs-up me-1"></i> {t('partiallyCorrect')}
                      </>
                    );
                    badgeVariant = 'info';
                  } else {
                    badgeLabel = (
                      <>
                        <i className="bi bi-x-circle me-1"></i> {t('incorrect')}
                      </>
                    );
                    badgeVariant = 'danger';
                  }

                  return (
                    <div key={mcqIndex} className="mb-5">
                      <p className="fs-6 text-muted mb-2 d-flex align-items-center gap-2">
                        {t('question', { num: mcqIndex + 1 })}
                        <span className={`badge bg-${badgeVariant}`}>
                          {badgeLabel}
                        </span>
                      </p>
                      <div className="fw-semibold mb-4">
                        <MathRenderer html={mcq.question} />
                      </div>
                      <ul className="list-unstyled">
                        {mcq.choices.map((choice, choiceIndex) => {
                          const isSelected = selected.includes(choiceIndex);
                          const isCorrect = choice.isCorrect;

                          let icon = null;
                          if (isCorrect && isSelected) {
                            icon = <i className="bi bi-check-circle-fill text-success fs-5"></i>;
                          } else if (!isCorrect && isSelected) {
                            icon = <i className="bi bi-x-circle-fill text-danger fs-5"></i>;
                          } else if (isCorrect && !isSelected) {
                            icon = <i className="bi bi-exclamation-circle-fill text-primary fs-5"></i>;
                          }

                          const labelClass = `d-flex align-items-center gap-2 m-0 w-100 ${
                            isCorrect && isSelected
                              ? 'text-success'
                              : !isCorrect && isSelected
                              ? 'text-danger'
                              : isCorrect && !isSelected
                              ? 'text-primary'
                              : ''
                          }`;

                          return (
                            <li key={choiceIndex} className="mb-2">
                              <Card>
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                  <label className={labelClass}>
                                    <input
                                      type={mcq.isMultiSelect ? 'checkbox' : 'radio'}
                                      disabled
                                      checked={isSelected}
                                      readOnly
                                    />
                                    <MathRenderer html={choice.text} />
                                  </label>
                                  {icon}
                                </Card.Body>
                              </Card>
                            </li>
                          );
                        })}
                      </ul>
                      {mcq.solutionExplanation && (
                        <div className="mb-4">
                          <MathRenderer html={mcq.solutionExplanation} />
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Floating Scroll to Top Button */}
                <ScrollToTopButton
                  threshold={200}
                  bottom="5rem"
                  right="1rem"
                  ariaLabel={t('scrollTop')}
                  title={t('scrollTop')}
                />
              </Col>
            </Row>
          </>
        )}
      </Container>
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('confirmSubmitTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('confirmSubmitMessage')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            {t('cancel')}
          </Button>
          <Button variant="success" onClick={() => {
            setShowConfirmModal(false);
            handleSubmit();
          }}>
            {t('confirm')} <i className="bi bi-check"></i>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default QuizViewer;