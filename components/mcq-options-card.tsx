"use client";
import { Alert, Button, ButtonGroup, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import DocumentStatus from "@/enums/document-status";
import { useActivateMcqMutation, useDeactivateMcqMutation, useDeleteMcqMutation, useMcqByIdQuery } from '@/hooks/use-mcqs';
import LoadingContainer from './loading-container';
import DeleteModal from './delete-modal';
import UpdateMcqModal from "./update-mcq-modal";
import MathRenderer from "./math-renderer";

const baseTPath = 'components.McqOptionsCard';

interface McqOptionsCardProps {
  quizId: string;
  mcqId: string;
}

const McqOptionsCard: React.FC<McqOptionsCardProps> = ({quizId, mcqId}) => {
  const t = useTranslations(baseTPath);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);

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
    setDeleteModalShow(false);
  }

  const handleActivate = () => {
    activateMcqMutation({quizId, mcqId});
  }

  const handleDeativate = () => {
    deactivateMcqMutation({quizId, mcqId});
  }

  const handleUpdateMcq = () => {
    setUpdateModalShow(false);
  }

  return (
    <>
      <Card className="my-3 shadow quiz-options-card">
        <Row className="g-0 flex-column flex-md-row">
          <Col>
            <Card.Body>
              <div className="fs-5 fw-medium">
                <MathRenderer html={mcq.question} />
              </div>
              <div>
                <ol type="a" className="choice-list">
                  {mcq.choices.map((choice, index) => (
                    <li key={index}>
                      <Row>
                        <Col xs="auto" className={choice.isCorrect && choice.isCorrect === true ? 'text-success': ''}>
                          <MathRenderer html={choice.text} />
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
              {mcq.solutionExplanation && mcq.solutionExplanation.length > 0 && (
                <Row>
                  <Col>
                    <h6>{t('solutionExplanation')}</h6>
                    <div className="solution-explaination">
                      <MathRenderer html={mcq.solutionExplanation} /> 
                    </div>
                  </Col>
                </Row>
              )}
              <Row className="align-items-center mt-3">
                <Col className="mb-2">
                  <ButtonGroup>
                    <Button
                      variant="secondary"
                      aria-label={t('edit')}
                      onClick={() => setUpdateModalShow(true)}
                    >
                      <FontAwesomeIcon icon={faPen} className="me-1" />
                      <span className="d-none d-sm-inline">{t('edit')}</span>
                    </Button>
                    <Button
                      variant={mcq.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                      aria-label={mcq.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
                      onClick={mcq.status === DocumentStatus.ACTIVE ? handleDeativate : handleActivate}
                      disabled={isPendingActivate || isPendingDeactivate}
                    >
                      <FontAwesomeIcon
                        icon={mcq.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                        className="me-1"
                      />
                      <span className="d-none d-sm-inline">
                        {mcq.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
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
                    <FontAwesomeIcon icon={faTrash} />
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
            strong: () => <strong>{mcq.question}</strong>,
          })
        }
        cancelText={t('deleteModalCancel')}
        confirmText={t('deleteModalAccept')}
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        onConfirm={handleDeleteMcq}
      />
      <UpdateMcqModal
        quizId={quizId}
        mcqId={mcqId}
        show={updateModalShow}
        onHide={() => setUpdateModalShow(false)}
        onConfirm={handleUpdateMcq}
      />
    </>
  )
}

export default McqOptionsCard;