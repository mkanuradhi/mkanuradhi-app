"use client";
import { useRouter } from '@/i18n/routing';
import { Alert, Button, ButtonGroup, Card, Col, Modal, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import DocumentStatus from "@/enums/document-status";
import { useActivateMcqMutation, useDeactivateMcqMutation, useDeleteMcqMutation, useMcqByIdQuery } from '@/hooks/use-mcqs';
import LoadingContainer from './loading-container';
import SanitizedHtml from './sanitized-html';

const baseTPath = 'components.McqOptionsCard';

interface McqOptionsCardProps {
  quizId: string;
  mcqId: string;
}

const McqOptionsCard: React.FC<McqOptionsCardProps> = ({quizId, mcqId}) => {
  const t = useTranslations(baseTPath);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const router = useRouter();

  const { data: mcq, isPending: isPendingMcq, isError: isMcqError, isFetching: isFetchingMcq, error: mcqError } = useMcqByIdQuery(quizId, mcqId);
  const { mutate: deleteMcqMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteMcqMutation();
  const { mutate: activateMcqMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivateMcqMutation();
  const { mutate: deactivateMcqMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateMcqMutation();

  if ( isPendingMcq || isFetchingMcq ) {
    return (<LoadingContainer />);
  }

  if (isMcqError && mcqError) {
    return (
      <Row>
        <Col>
          <h5>{t('failMcq')}</h5>
          <p>{mcqError.message}</p>
        </Col>
      </Row>
    );
  }

  const handleDeleteMcq = async () => {
    deleteMcqMutation({quizId, mcqId});
    handleDeleteModalClose();
  }

  const handleDeleteModalClose = () => setDeleteModalShow(false);
  const handleDeleteModalShow = () => setDeleteModalShow(true);

  const handleEditModalClose = () => setEditModalShow(false);
  const handleEditModalShow = () => setEditModalShow(true);

  const handleActivate = () => {
    activateMcqMutation({quizId, mcqId});
  }

  const handleDeativate = () => {
    deactivateMcqMutation({quizId, mcqId});
  }

  return (
    <>
      <Card className="my-3 shadow quiz-options-card">
        <Row className="g-0 flex-column flex-md-row">
          <Col>
            <Card.Body>
              <div className="fs-5 fw-medium">
                <SanitizedHtml html={mcq.question} />
              </div>
              <div>
                <ol type="a" className="choice-list">
                  {mcq.choices.map((choice, index) => (
                    <li key={index}>
                      <Row>
                        <Col xs="auto" className={choice.isCorrect && choice.isCorrect === true ? 'text-success': ''}>
                          {choice.text}
                        </Col>
                        {choice.isCorrect && choice.isCorrect === true && (
                          <Col className="text-success">  
                            <i className="bi bi-check-lg"></i>
                          </Col>
                        )}
                      </Row>
                    </li>
                  ))}
                </ol>
              </div>
              <Row className="align-items-center mt-3">
                <Col className="mb-2">
                  <ButtonGroup>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">{t('edit')}</Tooltip>}
                    >
                      <Button
                        variant="secondary"
                        onClick={handleEditModalShow}
                        aria-label={t('edit')}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">{mcq.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}</Tooltip>}
                    >
                      <Button
                        variant={mcq.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                        onClick={mcq.status === DocumentStatus.ACTIVE ? handleDeativate : handleActivate}
                        disabled={isPendingActivate || isPendingDeactivate}
                        aria-label={mcq.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
                      >
                        <FontAwesomeIcon
                          icon={mcq.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                        />
                      </Button>
                    </OverlayTrigger>
                  </ButtonGroup>
                </Col>
                <Col xs="auto" className="mb-2">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-delete">{t('delete')}</Tooltip>}
                  >
                    <Button
                      variant="danger"
                      className="me-2 my-1"
                      onClick={handleDeleteModalShow}
                      disabled={isPendingDelete}
                      aria-label={t('delete')}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </OverlayTrigger>
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
          <Modal show={deleteModalShow} onHide={handleDeleteModalClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>{t('deleteModalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                t.rich('deleteModalMessage', {
                  strong: () => <strong>{mcq.question}</strong>,
                })
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleDeleteModalClose}>
                {t('deleteModalCancel')}
              </Button>
              <Button variant="danger" onClick={handleDeleteMcq}>
                {t('deleteModalAccept')}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Card>
    </>
  )
}

export default McqOptionsCard;