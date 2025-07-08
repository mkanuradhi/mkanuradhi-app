"use client";
import { useRouter } from '@/i18n/routing';
import { Alert, Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { useLocale, useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader, faEye, faEyeSlash, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useActivateCourseMutation, useDeactivateCourseMutation, useDeleteCourseMutation } from "@/hooks/use-courses";
import DocumentStatus from "@/enums/document-status";
import Course from "@/interfaces/i-course";
import DeleteModal from './delete-modal';
import "./course-options-card.scss";


const baseTPath = 'components.CourseOptionsCard';

interface CourseOptionsCardProps {
  course: Course;
}

const CourseOptionsCard: React.FC<CourseOptionsCardProps> = ({course}) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const formattedCredits = course.credits ? course.credits.toFixed(1) : course.credits;

  const selectedTitle = locale === "si" ? `${course.year} '${course.titleSi}'` : `${course.year} '${course.titleEn}'`;

  const { mutate: deleteCourseMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteCourseMutation();
  const { mutate: activateCourseMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivateCourseMutation();
  const { mutate: deactivateCourseMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateCourseMutation();

  const handleDeleteCourse = async () => {
    deleteCourseMutation(course.id);
    setDeleteModalShow(false)
  }

  const handleActivate = () => {
    activateCourseMutation(course.id);
  }

  const handleDeativate = () => {
    deactivateCourseMutation(course.id);
  }

  return (
    <>
      <Card className="my-3 shadow course-options-card">
        <Row className="g-0 flex-column flex-md-row">
          {/* Right Column for the Content */}
          <Col>
            <Card.Body>
              <Card.Subtitle>
                { course.year && `${course.year} ` }
                { course.degreeType && ` - ${t(`degreeType.${course.degreeType}`)}` }
              </Card.Subtitle>
              <Card.Title>
                { course.code && `${course.code} ` }
                { course.credits && `${formattedCredits} ` }
                { course.titleEn && `${course.titleEn} ` }
                { course.subtitleEn && `(${course.subtitleEn})` }
              </Card.Title>
              <Card.Title>
                { course.code && `${course.code} ` }
                { course.credits && `${formattedCredits} ` }
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
              <Row className="align-items-center">
                <Col className="mb-2">
                  <ButtonGroup>
                    <Button
                      variant="primary"
                      aria-label={t('read')}
                      onClick={() => router.push(`courses/${course.id}`)}
                    >
                      <FontAwesomeIcon icon={faBookOpenReader} className="me-1" />
                      <span className="d-none d-sm-inline">{t('read')}</span>
                    </Button>
                    <Button
                      variant="secondary"
                      aria-label={t('edit')}
                      onClick={() => router.push(`courses/${course.id}/edit`)}
                    >
                      <FontAwesomeIcon icon={faPen} className="me-1" />
                      <span className="d-none d-sm-inline">{t('edit')}</span>
                    </Button>
                    <Button
                      variant={course.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                      aria-label={course.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
                      onClick={course.status === DocumentStatus.ACTIVE ? handleDeativate : handleActivate}
                      disabled={isPendingActivate || isPendingDeactivate}
                    >
                      <FontAwesomeIcon
                        icon={course.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                        className="me-1"
                      />
                      <span className="d-none d-sm-inline">
                        {course.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
                      </span>
                    </Button>
                  </ButtonGroup>
                </Col>
                <Col xs="auto" className="mb-2">
                  <Button
                    variant="danger"
                    aria-label={t('delete')}
                    className="me-2 my-1"
                    onClick={() => setDeleteModalShow(true)}
                    disabled={isPendingDelete}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    <span className="d-none d-sm-inline">{t('delete')}</span>
                  </Button>
                </Col>
              </Row>
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
      </Card>
      <DeleteModal
        title={t('deleteModalTitle')}
        description={
          t.rich('deleteModalMessage', {
            strong: () => <strong>{selectedTitle}</strong>,
          })
        }
        cancelText={t('deleteModalCancel')}
        confirmText={t('deleteModalAccept')}
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        onConfirm={handleDeleteCourse}
      />
    </>
  )
}

export default CourseOptionsCard;