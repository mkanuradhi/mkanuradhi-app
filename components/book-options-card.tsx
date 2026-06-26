"use client";
import { useRouter } from '@/i18n/routing';
import { Alert, Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { useLocale, useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader, faEye, faEyeSlash, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import DocumentStatus from "@/enums/document-status";
import DeleteModal from './delete-modal';
import { useActivateBookMutation, useDeactivateBookMutation, useDeleteBookMutation } from '@/hooks/use-books';
import SanitizedHtml from './sanitized-html';
import Book from '@/interfaces/i-book';

const baseTPath = 'components.BookOptionsCard';

interface BookOptionsCardProps {
  book: Book;
}

const BookOptionsCard: React.FC<BookOptionsCardProps> = ({book}) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const selectedTitle = locale === "si" ? `${book.publishedYear} '${book.title.si}'` : `${book.publishedYear} '${book.title.en}'`;

  const { mutate: deleteBookMutation, isPending: isPendingDelete, isError: isDeleteError, error: deleteError } = useDeleteBookMutation();
  const { mutate: activateBookMutation, isPending: isPendingActivate, isError: isActivateError, error: activateError } = useActivateBookMutation();
  const { mutate: deactivateBookMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateBookMutation();

  const handleDeleteBook = async () => {
    deleteBookMutation(book.id);
    setDeleteModalShow(false)
  }

  const handleActivate = () => {
    activateBookMutation(book.id);
  }

  const handleDeactivate = () => {
    deactivateBookMutation(book.id);
  }

  const hasImage = !!book.coverImage;

  return (
    <>
      <Card className="my-3 shadow book-options-card">
        <Row className="g-0">
          {hasImage && (
            <>
            {/* Mobile */}
              <Col xs={12} className="d-md-none">
                <Card.Img
                  src={book.coverImage}
                  className="rounded-top rounded-bottom-0 object-fit-cover w-100"
                  style={{ maxHeight: "24rem", minHeight: "16rem" }}
                />
              </Col>
              {/* Desktop */}
              <Col md={4} className="d-none d-md-flex">
                <div className="position-relative w-100 overflow-hidden">
                  <Card.Img 
                    src={book.coverImage} 
                    className="position-absolute rounded-start rounded-end-0 object-fit-cover w-100 h-100"
                    style={{ inset: 0 }}
                  />
                </div>
              </Col>
            </>
          )}
          <Col xs={12} md={hasImage ? 8 : 12}>
            <Card.Body>
              <Card.Subtitle className="my-2">
                <Row className="align-items-center">
                  <Col>
                    <span>{book.publishedYear}</span>
                  </Col>
                </Row>
              </Card.Subtitle>
              <Card.Title>
                { book.title.en && `${book.title.en} ` }
              </Card.Title>
              <Card.Title>
                { book.title.si && `${book.title.si} ` }
              </Card.Title>
              <hr />
              {book.description.en && (
                <Row className='mb-3'>
                  <Col>
                    <SanitizedHtml html={book.description.en} />
                  </Col>
                </Row>
              )}
              {book.description.si && (
                <Row className='mb-3'>
                  <Col>
                    <SanitizedHtml html={book.description.si} />
                  </Col>
                </Row>
              )}
              <Row className="align-items-center">
                <Col className="mb-2">
                  <ButtonGroup>
                    <Button
                      variant="primary"
                      aria-label={t('read')}
                      onClick={() => router.push(`books/${book.id}`)}
                    >
                      <FontAwesomeIcon icon={faBookOpenReader} className="me-sm-1" />
                      <span className="d-none d-sm-inline">{t('read')}</span>
                    </Button>
                    <Button
                      variant="secondary"
                      aria-label={t('edit')}
                      onClick={() => router.push(`books/${book.id}/edit`)}
                    >
                      <FontAwesomeIcon icon={faPen} className="me-sm-1" />
                      <span className="d-none d-sm-inline">{t('edit')}</span>
                    </Button>
                    <Button
                      variant={book.status === DocumentStatus.ACTIVE ? `warning` : `success`}
                      aria-label={book.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
                      onClick={book.status === DocumentStatus.ACTIVE ? handleDeactivate : handleActivate}
                      disabled={isPendingActivate || isPendingDeactivate}
                    >
                      <FontAwesomeIcon
                        icon={book.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye}
                        className="me-sm-1"
                      />
                      <span className="d-none d-sm-inline">
                        {book.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
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
                    <FontAwesomeIcon icon={faTrash} className="me-sm-1" />
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
        onConfirm={handleDeleteBook}
      />
    </>
  )
}

export default BookOptionsCard;