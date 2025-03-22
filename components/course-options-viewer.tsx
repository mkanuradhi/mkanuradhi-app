"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Alert, Breadcrumb, Button, ButtonGroup, Col, Container, Modal, Row } from 'react-bootstrap';
import { Link, useRouter } from '@/i18n/routing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faListUl, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useActivateCourseMutation, useCourseByIdQuery, useDeactivateCourseMutation, useDeleteCourseMutation } from '@/hooks/use-courses';
import LoadingContainer from './loading-container';
import DocumentStatus from '@/enums/document-status';
import SanitizedHtml from './sanitized-html';
import 'react-quill/dist/quill.snow.css';
import "./course-options-viewer.scss";

const baseTPath = 'components.CourseOptionsViewer';

interface CourseOptionsViewerProps {
  courseId: string;
}

const CourseOptionsViewer: React.FC<CourseOptionsViewerProps> = ({ courseId }) => {
  const t = useTranslations(baseTPath);
  const [show, setShow] = useState(false);
  const router = useRouter();

  const { data: course, isPending, isError, isFetching, error: courseError } = useCourseByIdQuery(courseId);
  const { mutate: deleteCourseMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteCourseMutation();
  const { mutate: activateCourseMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivateCourseMutation();
  const { mutate: deactivateCourseMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateCourseMutation();

  if (isPending || isFetching) {
    return (<LoadingContainer />);
  }

  if (isError && courseError) {
    return (
      <Row>
        <Col>
          <h5>{t('failCourse')}</h5>
          <p>{courseError.message}</p>
        </Col>
      </Row>
    );
  }

  const selectedTitle = `${course.year} '${course.titleEn}' | '${course.titleSi}'`;
  const formattedCredits = course.credits ? course.credits.toFixed(1) : course.credits;

  const handleDeleteCourse = async () => {
    deleteCourseMutation(course.id);
    handleClose();
    router.replace('/dashboard/courses');
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleActivate = () => {
    activateCourseMutation(course.id);
  }

  const handleDeactivate = () => {
    deactivateCourseMutation(course.id);
  }

  return (
    <>
      <Container fluid="md" className="course-options-viewer">
        <Row>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard">{t('dashboard')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard/courses">{t('courses')}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <Row>
              <Col>
                <h3>{course.year}</h3>
                <h1>
                  { course.code && `${course.code} ` }
                  { course.credits && `${formattedCredits} ` }
                  { course.titleEn && `${course.titleEn} ` }
                  { course.subtitleEn && `(${course.subtitleEn})` }
                </h1>
                <hr className="divider" />
              </Col>
            </Row>
            <Row>
              <Col>
                <div>{course.locationEn}</div>
              </Col>
            </Row>
            {course.descriptionEn && (
              <Row>
                <Col>
                  <SanitizedHtml html={course.descriptionEn} className="ql-editor" />
                </Col>
              </Row>
            )}
            {course.quizzes && course.quizzes.length > 0 && (
              <Row>
                <Col>
                  <h2 className="my-3">{t('quizzesEn')}</h2>
                  <ol>
                    {course.quizzes.map((quiz) => (
                      <li key={quiz.id}>
                        <Link href={`/dashboard/courses/${course.id}/quizzes/${quiz.id}`}>{quiz.titleEn}</Link>
                      </li>
                    ))}
                  </ol>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        {/* ----------------- Si ----------------- */}
        <Row className="my-4">
          <Col>
            <Row>
              <Col>
                <h3>{course.year}</h3>
                <h1>
                { course.code && `${course.code} ` }
                { course.credits && `${formattedCredits} ` }
                { course.titleSi && `${course.titleSi} ` }
                { course.subtitleSi && `(${course.subtitleSi})` }
                </h1>
                <hr className="divider" />
              </Col>
            </Row>
            <Row>
              <Col>
                <div>{course.locationSi}</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <SanitizedHtml html={course.descriptionSi} className="ql-editor" />
              </Col>
            </Row>
            {course.quizzes && course.quizzes.length > 0 && (
              <Row>
                <Col>
                  <h2 className="my-3">{t('quizzesSi')}</h2>
                  <ol>
                    {course.quizzes.map((quiz) => (
                      <li key={quiz.id}>
                        <Link href={`/dashboard/courses/${course.id}/quizzes/${quiz.id}`}>{quiz.titleSi}</Link>
                      </li>
                    ))}
                  </ol>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col className="mb-2">
            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() => router.push(`/dashboard/courses/${course.id}/edit`)}
              >
                <FontAwesomeIcon icon={faPen} className="me-1" /> { t('edit') }
              </Button>
              <Button
                variant={course.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                onClick={course.status === DocumentStatus.ACTIVE ? handleDeactivate : handleActivate}
                disabled={isPendingActivate || isPendingDeactivate}
              >
                <FontAwesomeIcon
                  icon={course.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                  className="list-icon"
                />{" "}
                {course.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
              </Button>
              <Button
                variant="info"
                onClick={() => router.push(`/dashboard/courses/${course.id}/quizzes`)}
              >
                <FontAwesomeIcon icon={faListUl} className="me-1" /> { t('quizzes') }
              </Button>
            </ButtonGroup>
          </Col>
          <Col xs="auto" className="mb-2">
            <Button variant="danger" className="me-2" onClick={handleShow} disabled={isPendingDelete}>
              <FontAwesomeIcon icon={faTrash} className="list-icon" /> { t('delete') }
            </Button>
          </Col>
        </Row>
        {isActivateError && activateError && (
          <Row className="my-3">
            <Col>
              <Alert variant="danger" dismissible>
                <Alert.Heading>{t('activateErrorTitle')}</Alert.Heading>
                <p>{activateError.message}</p>
              </Alert>
            </Col>
          </Row>
        )}
        {isDeactivateError && deactivateError && (
          <Row className="my-3">
            <Col>
              <Alert variant="danger" dismissible>
                <Alert.Heading>{t('deactivateErrorTitle')}</Alert.Heading>
                <p>{deactivateError.message}</p>
              </Alert>
            </Col>
          </Row>
        )}
        {isDeleteError && deleteError && (
          <Row className="my-3">
            <Col>
              <Alert variant="danger" dismissible>
                <Alert.Heading>{t('deleteErrorTitle')}</Alert.Heading>
                <p>{deleteError.message}</p>
              </Alert>
            </Col>
          </Row>
        )}
        <div>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>{t('deleteModalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                t.rich('deleteModalMessage', {
                  strong: () => <strong>{selectedTitle}</strong>,
                })
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t('deleteModalCancel')}
              </Button>
              <Button variant="danger" onClick={handleDeleteCourse}>
                {t('deleteModalAccept')}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Container>
    </>
  )
}

export default CourseOptionsViewer;