"use client";
import { useRouter } from '@/i18n/routing';
import { Alert, Badge, Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader, faCheckCircle, faEye, faEyeSlash, faHourglassHalf, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useActivateResearchMutation, useDeactivateResearchMutation, useDeleteResearchMutation } from '@/hooks/use-research';
import DocumentStatus from "@/enums/document-status";
import Research from '@/interfaces/i-research';
import DeleteModal from './delete-modal';
import GlowLink from './GlowLink';
import ResearchSupervisors from './research-supervisors';
import { getFormattedDate } from '@/utils/common-utils';
import { LOCALE_EN } from '@/constants/common-vars';
import SupervisionStatus from '@/enums/supervision-status';

const baseTPath = 'components.ResearchOptionsCard';

interface ResearchOptionsCardProps {
  research: Research;
}

const ResearchOptionsCard: React.FC<ResearchOptionsCardProps> = ({research}) => {
  const t = useTranslations(baseTPath);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const { mutate: deleteResearchMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteResearchMutation();
  const { mutate: activateResearchMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivateResearchMutation();
  const { mutate: deactivateResearchMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateResearchMutation();

  const handleDeleteResearch = async () => {
    deleteResearchMutation(research.id);
    setDeleteModalShow(false)
  }

  const handleActivate = () => {
    activateResearchMutation(research.id);
  }

  const handleDeativate = () => {
    deactivateResearchMutation(research.id);
  }

  const getSupervisionStatusIcon = () => {
    switch (research.supervisionStatus) {
      case SupervisionStatus.IN_PROGRESS:
        return <FontAwesomeIcon icon={faHourglassHalf} className="text-primary" />;
      case SupervisionStatus.COMPLETED:
        return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="my-3 shadow research-options-card">
        <Card.Body>
          <Card.Subtitle className="my-2">
            <Row className="align-items-center mb-2">
              <Col>
                {research.isMine && (
                  <Badge bg="success" className="me-2">{t('mine')}</Badge>
                )}
                {research.completedYear && (
                  <span>{research.completedYear} - </span>
                )}
                <span className="me-2">{t(research.type.toLowerCase())}</span>
              </Col>
              <Col xs="auto">
                <span className="me-2">{t(research.supervisionStatus.toLowerCase())}</span>
                {getSupervisionStatusIcon()}
              </Col>
            </Row>
          </Card.Subtitle>
          <Card.Title>
            { research.title }
          </Card.Title>
          <hr />
          <Card.Text>
            { research.location }
          </Card.Text>
          <ResearchSupervisors supervisors={research.supervisors} />
          <div className="mb-3">
            {research.thesisUrl && (
              <p>
                <label className="fw-semibold me-1">{t('thesisUrl')}:</label>
                <GlowLink href={research.thesisUrl} newTab={true} withArrow={true}>{research.thesisUrl}</GlowLink>
              </p>
            )}
            {research.githubUrl && (
              <p>
                <label className="fw-semibold me-1">{t('githubUrl')}:</label>
                <GlowLink href={research.githubUrl} newTab={true} withArrow={true}>{research.githubUrl}</GlowLink>
              </p>
            )}
            {research.slidesUrl && (
              <p>
                <label className="fw-semibold me-1">{t('slidesUrl')}:</label>
                <GlowLink href={research.slidesUrl} newTab={true} withArrow={true}>{research.slidesUrl}</GlowLink>
              </p>
            )}
          </div>
          {research.startedDate && (
            <Row>
              <Col>
                <p>
                  <label className="fw-semibold me-1">{t('startedDate')}:</label>
                  <span>{ getFormattedDate(LOCALE_EN, research.startedDate) }</span>
                </p>
              </Col>
            </Row>
          )}
          {research.completedDate && (
            <Row>
              <Col>
                <p>
                  <label className="fw-semibold me-1">{t('completedDate')}:</label>
                  <span>{ getFormattedDate(LOCALE_EN, research.completedDate) }</span>
                </p>
              </Col>
            </Row>
          )}
          <Row className="align-items-center">
            <Col className="mb-2">
              <ButtonGroup>
                <Button
                  variant="primary"
                  aria-label={t('read')}
                  onClick={() => router.push(`research/${research.id}`)}
                >
                  <FontAwesomeIcon icon={faBookOpenReader} className="me-1" />
                  <span className="d-none d-sm-inline">{t('read')}</span>
                </Button>
                <Button
                  variant="secondary"
                  aria-label={t('edit')}
                  onClick={() => router.push(`research/${research.id}/edit`)}
                >
                  <FontAwesomeIcon icon={faPen} className="me-1" />
                  <span className="d-none d-sm-inline">{t('edit')}</span>
                </Button>
                <Button
                  variant={research.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                  aria-label={research.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
                  onClick={research.status === DocumentStatus.ACTIVE ? handleDeativate : handleActivate}
                  disabled={isPendingActivate || isPendingDeactivate}
                >
                  <FontAwesomeIcon
                    icon={research.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                    className="me-1"
                  />
                  <span className="d-none d-sm-inline">
                    {research.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
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
      </Card>
      <DeleteModal
        title={t('deleteModalTitle')}
        description={
          t.rich('deleteModalMessage', {
            strong: () => <strong>{research.title}</strong>,
          })
        }
        cancelText={t('deleteModalCancel')}
        confirmText={t('deleteModalAccept')}
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        onConfirm={handleDeleteResearch}
      />
    </>
  )
}

export default ResearchOptionsCard;