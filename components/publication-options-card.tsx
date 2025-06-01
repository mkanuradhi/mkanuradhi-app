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
          <div className="mb-3">
            {publication.authors.map((author, index) => (
              <span key={index} className="me-1">
                <span className={author.isMe ? 'fw-bold' : ''}>
                  {author.name}
                </span>
                {author.corresponding && (
                  <sup className="text-muted" title={t('correspondingAuthor')}>
                    <i className="bi bi-asterisk" style={{ fontSize: '0.65rem' }}></i>
                  </sup>
                )}
                {index < publication.authors.length - 1 && <span>,</span>}
              </span>
            ))}
          </div>
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
                  onClick={() => router.push(`publications/${publication.id}`)}
                >
                  <FontAwesomeIcon icon={faBookOpenReader} className="me-1" /> { t('read') }
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push(`publications/${publication.id}/edit`)}
                >
                  <FontAwesomeIcon icon={faPen} className="me-1" /> { t('edit') }
                </Button>
                <Button
                  variant={publication.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                  onClick={publication.status === DocumentStatus.ACTIVE ? handleDeativate : handleActivate}
                  disabled={isPendingActivate || isPendingDeactivate}
                >
                  <FontAwesomeIcon
                    icon={publication.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                    className="me-1"
                  />{" "}
                  {publication.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
                </Button>
              </ButtonGroup>
            </Col>
            <Col xs="auto" className="mb-2">
              <Button
                variant="danger"
                className="me-2 my-1"
                onClick={() => setDeleteModalShow(true)}
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