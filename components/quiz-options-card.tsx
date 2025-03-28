"use client";
import { useRouter } from '@/i18n/routing';
import { Alert, Button, ButtonGroup, Card, Col, Modal, Row } from "react-bootstrap";
import { useLocale, useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader, faEye, faEyeSlash, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import DocumentStatus from "@/enums/document-status";
import { useActivateQuizMutation, useDeactivateQuizMutation, useDeleteQuizMutation, useQuizByIdQuery } from '@/hooks/use-quizzes';
import LoadingContainer from './loading-container';
import { LANG_SI, LOCALE_EN, LOCALE_SI } from '@/constants/common-vars';
import { getFormattedDateTime } from '@/utils/common-utils';

const baseTPath = 'components.QuizOptionsCard';

interface QuizOptionsCardProps {
  courseId: string;
  quizId: string;
}

const QuizOptionsCard: React.FC<QuizOptionsCardProps> = ({courseId, quizId}) => {
  const t = useTranslations(baseTPath);
  const lang = useLocale();
  const [show, setShow] = useState(false);
  const router = useRouter();

  const { data: quiz, isPending: isPendingQuiz, isError: isQuizError, isFetching: isFetchingQuiz, error: quizError } = useQuizByIdQuery(courseId, quizId);
  const { mutate: deleteQuizMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteQuizMutation(courseId);
  const { mutate: activateQuizMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivateQuizMutation(courseId);
  const { mutate: deactivateQuizMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateQuizMutation(courseId);

  if ( isPendingQuiz || isFetchingQuiz ) {
    return (<LoadingContainer />);
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

  const selectedTitle = lang === "si" ? `'${quiz.titleSi}'` : `'${quiz.titleEn}'`;

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

  const handleDeleteCourse = async () => {
    deleteQuizMutation({courseId, quizId});
    handleClose();
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleActivate = () => {
    activateQuizMutation({courseId, quizId});
  }

  const handleDeativate = () => {
    deactivateQuizMutation({courseId, quizId});
  }

  return (
    <>
      <Card className="my-3 shadow quiz-options-card">
        <Row className="g-0 flex-column flex-md-row">
          <Col>
            <Card.Body>
              <Card.Title>
                { quiz.titleEn && `${quiz.titleEn} ` }
                { quiz.titleSi && ` | ${quiz.titleSi}` }
              </Card.Title>
              <hr />
              <Card.Text>
                <b>{t('duration')}:</b>{" "}{ t.rich('numMinutes', {mins: quiz.duration}) }
              </Card.Text>
              {formattedAvailable && (
                <Card.Text>{formattedAvailable}</Card.Text>
              )}
              <Row className="align-items-center">
                <Col className="mb-2">
                  <ButtonGroup>
                    <Button
                      variant="primary"
                      onClick={() => router.push(`quizzes/${quiz.id}`)}
                    >
                      <FontAwesomeIcon icon={faBookOpenReader} className="me-1" /> { t('read') }
                    </Button>
                    <Button
                      variant={quiz.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                      onClick={quiz.status === DocumentStatus.ACTIVE ? handleDeativate : handleActivate}
                      disabled={isPendingActivate || isPendingDeactivate}
                    >
                      <FontAwesomeIcon
                        icon={quiz.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                        className="me-1"
                      />{" "}
                      {quiz.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
                    </Button>
                  </ButtonGroup>
                </Col>
                <Col xs="auto" className="mb-2">
                  <Button
                    variant="danger"
                    className="me-2 my-1"
                    onClick={handleShow}
                    disabled={isPendingDelete}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" /> { t('delete') }
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
      </Card>
    </>
  )
}

export default QuizOptionsCard;