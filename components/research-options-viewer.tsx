"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useActivateResearchMutation, useDeactivateResearchMutation, useDeleteResearchMutation, useResearchByIdQuery } from '@/hooks/use-research';
import LoadingContainer from './loading-container';
import { Alert, Badge, Breadcrumb, Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faCheckCircle, faEye, faEyeSlash, faHourglassHalf, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import GlowLink from './GlowLink';
import DocumentStatus from '@/enums/document-status';
import DeleteModal from './delete-modal';
import ResearchSupervisors from './research-supervisors';
import { getFormattedDate } from '@/utils/common-utils';
import { LOCALE_EN } from '@/constants/common-vars';
import SupervisionStatus from '@/enums/supervision-status';
import "./research-options-viewer.scss";


const baseTPath = 'components.ResearchOptionsViewer';

interface ResearchOptionsViewerProps {
  researchId: string;
}

const ResearchOptionsViewer: React.FC<ResearchOptionsViewerProps> = ({ researchId }) => {
  const t = useTranslations(baseTPath);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const { data: research, isPending, isError, isFetching, error: researchError } = useResearchByIdQuery(researchId);
  const { mutate: deleteResearchMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteResearchMutation();
  const { mutate: activateResearchMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivateResearchMutation();
  const { mutate: deactivateResearchMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateResearchMutation();

  if (isPending || isFetching) {
    return (<LoadingContainer />);
  }

  if (isError && researchError) {
    return (
      <Row>
        <Col>
          <h5>{t('failResearch')}</h5>
          <p>{researchError.message}</p>
        </Col>
      </Row>
    );
  }

  const handleDelete = async () => {
    deleteResearchMutation(research.id);
    setDeleteModalShow(false);
    router.replace('/dashboard/research');
  }

  const handleActivate = () => {
    activateResearchMutation(research.id);
  }

  const handleDeactivate = () => {
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
      <Container fluid="md" className="research-options-viewer">
        <Row>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard">{t('dashboard')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard/research">{t('research')}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            {research.isMine && (
              <FontAwesomeIcon icon={faCertificate} className="text-success me-2" title={t('mine')} />
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
        <Row>
          <Col>
            <h1>{ research.title }</h1>
            <hr />
          </Col>
        </Row>
        {research.degree && (
          <Row>
            <Col>
              <p>
                <label className="fw-semibold me-1">{t('degree')}:</label>
                <span>{ research.degree }</span>
              </p>
            </Col>
          </Row>
        )}
        {research.location && (
          <Row>
            <Col>
              <p>
                <label className="fw-semibold me-1">{t('location')}:</label>
                <span>{ research.location }</span>
              </p>
            </Col>
          </Row>
        )}
        {research.studentName && (
          <Row>
            <Col>
              <p>
                <label className="fw-semibold me-1">{t('studentName')}:</label>
                <span>{ research.studentName }</span>
              </p>
            </Col>
          </Row>
        )}
        <Row className="my-3">
          <Col>
            <h5 className="mb-2">{t('supervisors')}</h5>
            <ResearchSupervisors supervisors={research.supervisors} />
          </Col>
        </Row>
        <Row>
          <Col>
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
          </Col>
        </Row>
        { research.keywords && research.keywords.length > 0 && (
          <Row>
            <Col>
              <p>
                <label className="fw-semibold me-1">{t('keywords')}:</label>
                { research.keywords.map((keyword, index) => (
                  <Badge key={index} pill bg="info" className="me-1">
                    {keyword}
                  </Badge>
                ))}
              </p>
            </Col>
          </Row>
        ) }
        { research.abstract && (
          <Row>
            <Col>
              <div className="my-3">
                <label className="fw-semibold">{t('abstract')}</label>
                <pre className="p-3 rounded bg-body-secondary text-body fw-normal lh-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  <code>{research.abstract}</code>
                </pre>
              </div>
            </Col>
          </Row>
        )}
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
        {research.registrationNumber && (
          <Row>
            <Col>
              <p>
                <label className="fw-semibold me-1">{t('registrationNumber')}:</label>
                <span>{ research.registrationNumber }</span>
              </p>
            </Col>
          </Row>
        )}
        <Row className="align-items-center">
          <Col className="mb-2">
            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() => router.push(`/dashboard/research/${research.id}/edit`)}
              >
                <FontAwesomeIcon icon={faPen} className="me-1" /> { t('edit') }
              </Button>
              <Button
                variant={research.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                onClick={research.status === DocumentStatus.ACTIVE ? handleDeactivate : handleActivate}
                disabled={isPendingActivate || isPendingDeactivate}
              >
                <FontAwesomeIcon
                  icon={research.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                  className="list-icon"
                />{" "}
                {research.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
              </Button>
            </ButtonGroup>
          </Col>
          <Col xs="auto" className="mb-2">
            <Button
              variant="danger"
              className="me-2"
              onClick={() => setDeleteModalShow(true)}
              disabled={isPendingDelete}
            >
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
          onConfirm={handleDelete}
        />
      </Container>
    </>
  );
}

export default ResearchOptionsViewer;