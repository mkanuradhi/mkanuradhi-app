"use client";
import { useRouter } from '@/i18n/routing';
import { Alert, Badge, Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faBookOpenReader, faEye, faEyeSlash, faMicrophone, faNewspaper, faPen, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useActivatePublicationMutation, useDeactivatePublicationMutation, useDeletePublicationMutation } from '@/hooks/use-publications';
import DocumentStatus from "@/enums/document-status";
import Publication from '@/interfaces/i-publication';
import DeleteModal from './delete-modal';
import PublicationType from '@/enums/publication-type';
import GlowLink from './GlowLink';
import PublicationStatus from '@/enums/publication-status';
import PublicationAuthors from './publication-authors';


const baseTPath = 'components.PublicationOptionsCard';

interface PublicationOptionsCardProps {
  publication: Publication;
}

const PublicationOptionsCard: React.FC<PublicationOptionsCardProps> = ({publication}) => {
  const t = useTranslations(baseTPath);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const { mutate: deletePublicationMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeletePublicationMutation();
  const { mutate: activatePublicationMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivatePublicationMutation();
  const { mutate: deactivatePublicationMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivatePublicationMutation();

  const handleDeletePublication = async () => {
    deletePublicationMutation(publication.id);
    setDeleteModalShow(false)
  }

  const handleActivate = () => {
    activatePublicationMutation(publication.id);
  }

  const handleDeativate = () => {
    deactivatePublicationMutation(publication.id);
  }

  const getTypeIcon = () => {
    switch (publication.type) {
      case PublicationType.JOURNAL_ARTICLE:
        return <FontAwesomeIcon icon={faNewspaper} className="text-primary" />;
      case PublicationType.BOOK_CHAPTER:
        return <FontAwesomeIcon icon={faBook} className="text-success" />;
      case PublicationType.CONFERENCE_PROCEEDING:
        return <FontAwesomeIcon icon={faMicrophone} className="text-warning" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="my-3 shadow publication-options-card">
        <Card.Body>
          <Card.Subtitle className="my-2">
            <Row className="align-items-center">
              <Col>
                <span>{publication.year}</span>
              </Col>
              <Col xs="auto">
                <span className="me-2">{t(publication.type.toLowerCase())}</span>
                {getTypeIcon()}
              </Col>
            </Row>
          </Card.Subtitle>
          <Card.Title>
            { publication.title }
          </Card.Title>
          {publication.publicationStatus !== PublicationStatus.PUBLISHED && (
            <div className="text-muted fst-italic small mt-1">
              {t(publication.publicationStatus.toLowerCase())}
            </div>
          )}
          <hr />
          <Card.Text>
            { publication.source }
          </Card.Text>
          <PublicationAuthors authors={publication.authors} />
          <div className="mb-3">
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
          </div>
          <div className="mb-3">
            { publication.tags && publication.tags.length > 0 && (
              <p>
                <label className="fw-semibold me-1">{t('tags')}:</label>
                { publication.tags.map((tag, index) => (
                  <Badge key={index} pill bg="success" className="me-1">
                    {tag}
                  </Badge>
                ))}
              </p>
            ) }
          </div>
          <Row className="align-items-center">
            <Col className="mb-2">
              <ButtonGroup>
                <Button
                  variant="primary"
                  aria-label={t('read')}
                  onClick={() => router.push(`publications/${publication.id}`)}
                >
                  <FontAwesomeIcon icon={faBookOpenReader} className="me-1" />
                  <span className="d-none d-sm-inline">{t('read')}</span>
                </Button>
                <Button
                  variant="secondary"
                  aria-label={t('edit')}
                  onClick={() => router.push(`publications/${publication.id}/edit`)}
                >
                  <FontAwesomeIcon icon={faPen} className="me-1" />
                  <span className="d-none d-sm-inline">{t('edit')}</span>
                </Button>
                <Button
                  variant={publication.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                  aria-label={publication.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
                  onClick={publication.status === DocumentStatus.ACTIVE ? handleDeativate : handleActivate}
                  disabled={isPendingActivate || isPendingDeactivate}
                >
                  <FontAwesomeIcon
                    icon={publication.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                    className="me-1"
                  />
                  <span className="d-none d-sm-inline">
                    {publication.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
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
            strong: () => <strong>{publication.title}</strong>,
          })
        }
        cancelText={t('deleteModalCancel')}
        confirmText={t('deleteModalAccept')}
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        onConfirm={handleDeletePublication}
      />
    </>
  )
}

export default PublicationOptionsCard;