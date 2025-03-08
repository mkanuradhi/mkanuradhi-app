"use client";
import Link from "next/link";
import { Alert, Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useLocale, useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader, faEye, faEyeSlash, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useActivateCourseMutation, useDeactivateCourseMutation, useDeleteCourseMutation } from "@/hooks/use-courses";
import DocumentStatus from "@/enums/document-status";
import Course from "@/interfaces/i-course";
import "./course-options-card.scss";


const baseTPath = 'components.CourseOptionsCard';

interface CourseOptionsCardProps {
  course: Course;
}

const CourseOptionsCard: React.FC<CourseOptionsCardProps> = ({course}) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const [show, setShow] = useState(false);

  const selectedTitle = locale === "si" ? `'${course.titleSi}'` : `'${course.titleEn}'`;

  const { mutate: deleteCourseMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteCourseMutation();
  const { mutate: activateCourseMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivateCourseMutation();
  const { mutate: deactivateCourseMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateCourseMutation();

  const handleDeleteCourse = async () => {
    deleteCourseMutation(course.id);
    handleClose();
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleActivate = () => {
    activateCourseMutation(course.id);
  }

  const handleDeativate = () => {
    deactivateCourseMutation(course.id);
  }

  return (
    <>
      <Card className="my-3 shadow blog-post-options-card">
        <Row className="g-0 flex-column flex-md-row">
          {/* Right Column for the Content */}
          <Col>
            <Card.Body>
              <Card.Subtitle>
                { course.year && `${course.year} ` }
              </Card.Subtitle>
              <Card.Title>
                { course.code && `${course.code} ` }
                { course.credits && `${course.credits} ` }
                { course.titleEn && `${course.titleEn} ` }
                { course.subtitleEn && `(${course.subtitleEn})` }
              </Card.Title>
              <Card.Title>
                { course.code && `${course.code} ` }
                { course.credits && `${course.credits} ` }
                { course.titleSi && `${course.titleSi} ` }
                { course.subtitleSi && `(${course.subtitleSi})` }
              </Card.Title>
              <hr className="divider" />
              <Card.Text>
                { course.locationEn }
              </Card.Text>
              <Card.Text>
                { course.locationSi }
              </Card.Text>
              <Link href={`courses/${course.id}`}>
                <Button className="me-2 my-1">
                  <FontAwesomeIcon icon={faBookOpenReader} className="me-1" /> { t('read') }
                </Button>
              </Link>
              <Link href={`courses/${course.id}/edit`}>
                <Button variant="secondary" className="me-2 my-1">
                  <FontAwesomeIcon icon={faPen} className="me-1" /> { t('edit') }
                </Button>
              </Link>
              <Button
                variant={course.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                className="me-2 my-1"
                onClick={course.status === DocumentStatus.ACTIVE ? handleDeativate : handleActivate}
                disabled={isPendingActivate || isPendingDeactivate}
              >
                <FontAwesomeIcon
                  icon={course.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                  className="me-1"
                />{" "}
                {course.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
              </Button>
              <Button
                variant="danger"
                className="me-2 my-1"
                onClick={handleShow}
                disabled={isPendingDelete}
              >
                <FontAwesomeIcon icon={faTrash} className="me-1" /> { t('delete') }
              </Button>
              {isActivateError && activateError && (
                <Alert variant="danger" className="my-2" dismissible>
                  <Alert.Heading>{t('activateErrorTitle')}</Alert.Heading>
                  <p>{activateError.message}</p>
                </Alert>
              )}
              {isDeactivateError && deactivateError && (
                <Alert variant="danger" className="my-2" dismissible>
                  <Alert.Heading>{t('deactivateErrorTitle')}</Alert.Heading>
                  <p>{deactivateError.message}</p>
                </Alert>
              )}
              {isDeleteError && deleteError && (
                <Alert variant="danger" className="my-2" dismissible>
                  <Alert.Heading>{t('deleteErrorTitle')}</Alert.Heading>
                  <p>{deleteError.message}</p>
                </Alert>
              )}
            </Card.Body>
          </Col>
        </Row>
        
        <div>
          <Modal show={show} onHide={handleClose}>
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
      </Card>
    </>
  )
}

export default CourseOptionsCard;