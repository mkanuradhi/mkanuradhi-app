"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useActivatePublicationMutation, useDeactivatePublicationMutation, useDeletePublicationMutation, usePublicationByIdQuery } from '@/hooks/use-publications';
import LoadingContainer from './loading-container';
import { Alert, Badge, Breadcrumb, Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import PublicationType from '@/enums/publication-type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faEye, faEyeSlash, faMicrophone, faNewspaper, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import PublicationStatus from '@/enums/publication-status';
import GlowLink from './GlowLink';
import DocumentStatus from '@/enums/document-status';
import DeleteModal from './delete-modal';
import PublicationAuthors from './publication-authors';
import { getFormattedDate } from '@/utils/common-utils';
import { LOCALE_EN } from '@/constants/common-vars';
import "./publication-options-viewer.scss";
import PublicationTagBadge from './publication-tag-badge';


const baseTPath = 'components.PublicationOptionsViewer';

interface PublicationOptionsViewerProps {
  publicationId: string;
}

const PublicationOptionsViewer: React.FC<PublicationOptionsViewerProps> = ({ publicationId }) => {
  const t = useTranslations(baseTPath);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const { data: publication, isPending, isError, isFetching, error: publicationError } = usePublicationByIdQuery(publicationId);
  const { mutate: deletePublicationMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeletePublicationMutation();
  const { mutate: activatePublicationMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivatePublicationMutation();
  const { mutate: deactivatePublicationMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivatePublicationMutation();

  if (isPending || isFetching) {
    return (<LoadingContainer />);
  }

  if (isError && publicationError) {
    return (
      <Row>
        <Col>
          <h5>{t('failPublication')}</h5>
          <p>{publicationError.message}</p>
        </Col>
      </Row>
    );
  }

  const handleDeletePublication = async () => {
    deletePublicationMutation(publication.id);
    setDeleteModalShow(false);
    router.replace('/dashboard/publications');
  }

  const handleActivate = () => {
    activatePublicationMutation(publication.id);
  }

  const handleDeactivate = () => {
    deactivatePublicationMutation(publication.id);
  }

  return (
    <>
      <Container fluid="md" className="publication-options-viewer">
        <Row>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard">{t('dashboard')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs="span">
                <Link href="/dashboard/publications">{t('publications')}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <span>{publication.year}</span>
          </Col>
          <Col xs="auto">
            {publication.type === PublicationType.JOURNAL_ARTICLE && (
              <>
                <span className="me-2">{t('article')}</span>
                <FontAwesomeIcon icon={faNewspaper} className="text-primary" />
              </>
            )}
            {publication.type === PublicationType.BOOK_CHAPTER && (
              <>
                <span className="me-2">{t('chapter')}</span>
                <FontAwesomeIcon icon={faBook} className="text-success" />
              </>
            )}
            {publication.type === PublicationType.CONFERENCE_PROCEEDING && (
              <>
                <span className="me-2">{t('proceeding')}</span>
                <FontAwesomeIcon icon={faMicrophone} className="text-warning" />
              </>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>{ publication.title }</h1>
            {publication.publicationStatus !== PublicationStatus.PUBLISHED && (
              <div className="text-muted fst-italic small mt-1">
                {t(publication.publicationStatus.toLowerCase())}
              </div>
            )}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col>
            { publication.source }
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <PublicationAuthors authors={publication.authors} />
          </Col>
        </Row>
        <Row>
          <Col>
            {publication.publicationUrl && (
              <p>
                <label className="fw-semibold me-1">{t('publicationUrl')}:</label>
                <GlowLink href={publication.publicationUrl} newTab={true} withArrow={true}>{publication.publicationUrl}</GlowLink>
              </p>
            )}
            {publication.pdfUrl && (
              <p>
                <label className="fw-semibold me-1">{t('pdfUrl')}:</label>
                <GlowLink href={publication.pdfUrl} newTab={true} withArrow={true}>{publication.pdfUrl}</GlowLink>
              </p>
            )}
            {publication.doiUrl && (
              <p>
                <label className="fw-semibold me-1">{t('doiUrl')}:</label>
                <GlowLink href={publication.doiUrl} newTab={true} withArrow={true}>{publication.doiUrl}</GlowLink>
              </p>
            )}
            {publication.preprintUrl && (
              <p>
                <label className="fw-semibold me-1">{t('preprintUrl')}:</label>
                <GlowLink href={publication.preprintUrl} newTab={true} withArrow={true}>{publication.preprintUrl}</GlowLink>
              </p>
            )}
            {publication.slidesUrl && (
              <p>
                <label className="fw-semibold me-1">{t('slidesUrl')}:</label>
                <GlowLink href={publication.slidesUrl} newTab={true} withArrow={true}>{publication.slidesUrl}</GlowLink>
              </p>
            )}
          </Col>
        </Row>
        { publication.tags && publication.tags.length > 0 && (
          <Row>
            <Col>
              <p>
                <label className="fw-semibold me-1">{t('tags')}:</label>
                { publication.tags.map((tag, index) => (
                  <PublicationTagBadge key={index} tag={tag} />
                ))}
              </p>
            </Col>
          </Row>
        ) }
        { publication.keywords && publication.keywords.length > 0 && (
          <Row>
            <Col>
              <p>
                <label className="fw-semibold me-1">{t('keywords')}:</label>
                { publication.keywords.map((keyword, index) => (
                  <Badge key={index} pill bg="info" className="me-1">
                    {keyword}
                  </Badge>
                ))}
              </p>
            </Col>
          </Row>
        ) }
        { publication.abstract && (
          <Row>
            <Col>
              <div className="my-3">
                <label className="fw-semibold">{t('abstract')}</label>
                <pre className="p-3 rounded bg-body-secondary text-body fw-normal lh-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  <code>{publication.abstract}</code>
                </pre>
              </div>
            </Col>
          </Row>
        )}
        { publication.bibtex && (
          <Row>
            <Col>
              <div className="my-3">
                <label className="fw-semibold">{t('bibtex')}</label>
                <pre className="p-3 rounded bg-body-secondary text-body fw-normal lh-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  <code>{publication.bibtex}</code>
                </pre>
              </div>
            </Col>
          </Row>
        )}
        { publication.ris && (
          <Row>
            <Col>
              <div className="my-3">
                <label className="fw-semibold">{t('ris')}</label>
                <pre className="p-3 rounded bg-body-secondary text-body fw-normal lh-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  <code>{publication.ris}</code>
                </pre>
              </div>
            </Col>
          </Row>
        )}
        {publication.publishedDate && (
          <Row>
            <Col>
              <p>
                <label className="fw-semibold me-1">{t('publishedDate')}:</label>
                <span>{ getFormattedDate(LOCALE_EN, publication.publishedDate) }</span>
              </p>
            </Col>
          </Row>
        )}
        <Row className="align-items-center">
          <Col className="mb-2">
            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() => router.push(`/dashboard/publications/${publication.id}/edit`)}
              >
                <FontAwesomeIcon icon={faPen} className="me-1" /> { t('edit') }
              </Button>
              <Button
                variant={publication.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                onClick={publication.status === DocumentStatus.ACTIVE ? handleDeactivate : handleActivate}
                disabled={isPendingActivate || isPendingDeactivate}
              >
                <FontAwesomeIcon
                  icon={publication.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                  className="list-icon"
                />{" "}
                {publication.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
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
              strong: () => <strong>{publication.title}</strong>,
            })
          }
          cancelText={t('deleteModalCancel')}
          confirmText={t('deleteModalAccept')}
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)}
          onConfirm={handleDeletePublication}
        />
      </Container>
    </>
  );
}

export default PublicationOptionsViewer;