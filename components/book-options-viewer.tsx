"use client";
import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import {
  useBookByIdQuery,
  useActivateBookMutation,
  useDeactivateBookMutation,
  useDeleteBookMutation,
} from '@/hooks/use-books';
import LoadingContainer from './loading-container';
import { Alert, Breadcrumb, Button, ButtonGroup, Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faPen,
  faStar,
  faTrash,
  faArrowUpRightFromSquare,
  faPlus,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';
import DocumentStatus from '@/enums/document-status';
import DeleteModal from './delete-modal';
import { LANG_SI } from '@/constants/common-vars';
import RecordMetadata from './record-metadata';
import GlowLink from './GlowLink';
import { BookAuthor, BookPrice } from '@/interfaces/i-book';
import { BookLanguage } from '@/enums/book-enums';
import SanitizedHtml from './sanitized-html';
import Badge from 'react-bootstrap/Badge';
import EditableImage from './editable-image';
import EditableImagePlaceholder from './editable-image-placeholder';

const baseTPath = 'components.BookOptionsViewer';

interface BookOptionsViewerProps {
  bookId: string;
}

// Helper: author initials

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// Helper: locale-aware author name

const getAuthorName = (author: BookAuthor, isSi: boolean): string => {
  if (isSi) return author.name.si || author.name.en || '';
  return author.name.en || author.name.si || '';
};

// Sub-component: Author list

interface AuthorListProps {
  bookId: string;
  authors: BookAuthor[];
  isSi: boolean;
  authorRoleLabel: (role: string) => string;
}

const AuthorList: React.FC<AuthorListProps> = ({bookId, authors, isSi, authorRoleLabel }) => (
  <div>
    {authors.map((author, index) => {
      const name = getAuthorName(author, isSi);
      return (
        <div
          key={index}
          className="d-flex align-items-center gap-2 py-2"
          style={{ borderBottom: index < authors.length - 1 ? '0.5px solid var(--bs-border-color)' : 'none' }}
        >
          {author.imageUrl ? (
            <EditableImage
              src={author.imageUrl}
              alt={getInitials(name)}
              editHref={`/dashboard/books/${bookId}/edit/author-image/${author.id}`}
              width={40}
              height={40}
              borderRadius='100%'
            />
          ) : (
            <EditableImagePlaceholder
              editHref={`/dashboard/books/${bookId}/edit/author-image/${author.id}`}
              width={40}
              height={40}
              borderRadius='100%'
            />
          )}
          <div className="flex-grow-1">
            <span>{name}</span>
          </div>
          <Badge pill bg="secondary">
            {authorRoleLabel(author.role)}
          </Badge>
          {author.profileUrl && (
            <a href={author.profileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--bs-info)' }}>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          )}
        </div>
      );
    })}
  </div>
);

const OptionalLink: React.FC<{ href?: string; children: React.ReactNode; className?: string }> = ({ href, children, className }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <>{children}</>
  );

// Sub-component: Metadata grid

interface MetaItem {
  label: string;
  value: string | number | undefined | null;
}

const MetaGrid: React.FC<{ items: MetaItem[] }> = ({ items }) => {
  const available = items.filter(item => item.value !== undefined && item.value !== null && item.value !== '');
  if (available.length === 0) return null;

  return (
    <div className="d-flex flex-wrap gap-2 my-3">
      {available.map((item, index) => (
        <div
          key={index}
          style={{ background: 'var(--bs-secondary-bg)', borderRadius: 6, padding: '8px 12px', minWidth: 100 }}
        >
          <div style={{ fontSize: 11, color: 'var(--bs-secondary-color)', marginBottom: 2 }}>{item.label}</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
};

// Sub-component: Subject chips

interface SubjectChipsProps {
  subjects: { en?: string; si?: string }[];
  isSi: boolean;
  label: string;
}

const SubjectChips: React.FC<SubjectChipsProps> = ({ subjects, isSi, label }) => {
  const visible = subjects
    .map(s => (isSi ? s.si || s.en : s.en || s.si) || '')
    .filter(Boolean);

  if (visible.length === 0) return null;

  return (
    <div className="mb-3">
      <h4 className="h5 mt-2">{label}</h4>
      <div>
        {visible.map((s, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 12,
              padding: '4px 12px',
              borderRadius: 999,
              background: 'var(--bs-info-bg-subtle)',
              color: 'var(--bs-info)',
              margin: 3,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

// Sub-component: Tag chips

const TagList: React.FC<{ tags: string[]; label: string }> = ({ tags, label }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="mb-3">
      <h4 className="mb-2">{label}</h4>
      <div>
        {tags.map((tag, i) => (
          <Badge key={i} bg="secondary" className="me-2 mb-2">{tag}</Badge>
        ))}
      </div>
    </div>
  );
};

// Main component

const BookOptionsViewer: React.FC<BookOptionsViewerProps> = ({ bookId }) => {
  const t = useTranslations(baseTPath);
  const lang = useLocale();
  const isSi = lang === LANG_SI;
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const { data: book, isPending, isError, isFetching, error: bookError } = useBookByIdQuery(bookId);
  const { mutate: deleteBookMutation,    isPending: isPendingDelete,     isError: isDeleteError,     error: deleteError }     = useDeleteBookMutation();
  const { mutate: activateBookMutation,  isPending: isPendingActivate,   isError: isActivateError,   error: activateError }   = useActivateBookMutation();
  const { mutate: deactivateBookMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateBookMutation();

  if (isPending || isFetching) return <LoadingContainer />;

  if (isError && bookError) {
    return (
      <Row><Col>
        <h5>{t('failBook')}</h5>
        <p>{bookError.message}</p>
      </Col></Row>
    );
  }

  const selectedTitle = isSi
    ? `'${book.title.si || book.title.en}'`
    : `'${book.title.en}'`;

  const handleDelete = () => {
    deleteBookMutation(book.id);
    setDeleteModalShow(false);
    router.replace('/dashboard/books');
  };

  const writtenLangLabel = book.writtenLang === BookLanguage.SINHALA
    ? t('langSinhala')
    : t('langEnglish');

  const getPriceWithCurrency = (price?: BookPrice) => {
    if (!price) return null;
    const amount = (price.amount / 100).toFixed(2);
    return `${t(`priceCurrency.${price.currency}`)} ${amount}`;
  }

  // Locale section renderer

  const renderSection = (isSin: boolean) => {
    const title       = isSin ? book.title.si       : book.title.en;
    const subtitle    = isSin ? book.subtitle?.si    : book.subtitle?.en;
    const description = isSin ? book.description.si  : book.description.en;
    const content     = isSin ? book.content.si      : book.content.en;

    const metaItems: MetaItem[] = [
      { label: t('publishedYear'), value: book.publishedYear },
      { label: t('writtenLang'),   value: writtenLangLabel   },
      { label: t('edition'),       value: book.edition       },
      { label: t('pages'),         value: book.pages         },
      { label: t('price'),         value: getPriceWithCurrency(book.price)},
      { label: t('displayOrder'),  value: book.displayOrder  },
    ];

    return (
      <div>

        {/* Cover + title block */}
        <div className="d-flex gap-3 align-items-start mb-3">
          {book.coverImage ? (
            <EditableImage
              src={book.coverImage}
              alt={title || ''}
              editHref={`/dashboard/books/${book.id}/edit/cover-image`}
              width={90}
              height={126}
              borderRadius='6px'
            />
          ) : (
            <EditableImagePlaceholder
              editHref={`/dashboard/books/${book.id}/edit/cover-image`}
              width={90}
              height={126}
              borderRadius='6px'
            />
          )}
          <div className="flex-grow-1">
            <h1 className="mb-1 d-flex align-items-center gap-2 flex-wrap">
              {title || <span className="text-muted fst-italic">{t('noTitle')}</span>}
              {book.featured && (
                <FontAwesomeIcon icon={faStar} style={{ color: '#BA7517', fontSize: 16 }} title={t('featured')} />
              )}
            </h1>
            {subtitle && <h2 className="h4 text-secondary mb-2">{subtitle}</h2>}
            <span className={`badge ${book.status === DocumentStatus.ACTIVE ? 'bg-success' : 'bg-warning text-dark'}`}>
              {book.status === DocumentStatus.ACTIVE ? t('active') : t('inactive')}
            </span>
            <p className="font-monospace text-muted mt-2 mb-0">
              path: {book.path}
            </p>
          </div>
        </div>

        <hr />

        {/* Metadata grid — only shows available fields */}
        <MetaGrid items={metaItems} />

        <hr />

        {book.isbns && (
          <Row className='my-4'>
            {book.isbns.map((isbn, index) => (
              <Col md={4} key={index}>
                <Card border="secondary" className='w-100'>
                  <Card.Body>
                    <Card.Title className='text-center'>{t('isbnValue', {value: isbn.value})}</Card.Title>
                    <Card.Text className='text-center'>{t(`isbnFormat.${isbn.format}`)}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Subjects */}
        <SubjectChips
          subjects={book.subject}
          isSi={isSin}
          label={t('subjects')}
        />

        <hr />

        {/* Authors */}
        <div className="mb-3">
          <h4 className="mb-2">{t('authors')}</h4>
          <AuthorList
            bookId={book.id}
            authors={book.authors}
            isSi={isSin}
            authorRoleLabel={(role) => t(`authorRole.${role}`)}
          />
        </div>

        <hr />

        {/* Description */}
        {description && (
          <Row>
            <Col>
              <h4 className="mb-2">{t('description')}</h4>
              <SanitizedHtml html={description} />
            </Col>
          </Row>
        )}

        <hr />

        {/* Content */}
        {content && (
          <Row>
            <Col>
              <SanitizedHtml html={content} />
            </Col>
          </Row>
        )}

        <hr />

        {/* Publisher */}
        {book.publisher && (
          <>
            <Row className="mb-3">
              <Col>
                <h4 className="mb-2">{t('publisher')}</h4>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <div className="d-flex align-items-center gap-3">
                  {book.publisher.imageUrl ? (
                    <EditableImage
                      src={book.publisher.imageUrl}
                      alt={`${book.publisher.name.en} logo`}
                      editHref={`/dashboard/books/${bookId}/edit/publisher-image`}
                      width={40}
                      height={40}
                      borderRadius='100%'
                    />
                  ) : (
                    <EditableImagePlaceholder
                      editHref={`/dashboard/books/${bookId}/edit/publisher-image`}
                      width={40}
                      height={40}
                      borderRadius='100%'
                    />
                  )}

                  <div>
                    <h6 className="mb-0">
                      <OptionalLink href={book.publisher.webUrl} className="text-decoration-none">
                        {isSin ? book.publisher.name.si : book.publisher.name.en}
                      </OptionalLink>
                    </h6>
                    <div className="text-muted small">
                      {isSin ? book.publisher.address.si : book.publisher.address.en}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}

        <hr />

        {/* Tags */}
        <TagList tags={book.tags} label={t('tags')} />

        {/* Buy Link */}
        { book.buyLink && (
          <Row className="mb-3">
            <Col>
              <h4 className="mb-2">{t('links')}</h4>
              <div className="mb-1">
                <GlowLink href={book.buyLink} newTab withArrow>{book.buyLink}</GlowLink>
              </div>
            </Col>
          </Row>
        )}

        <Row className="mb-3">
          <Col md={12}>
            <h4 className="mb-2">{t('sampleFile')}</h4>
          </Col>
          {book.pdfTeaser && (
          <Col xs={12} md={9}>
            <div className="mb-1">
              <GlowLink href={book.pdfTeaser} newTab withArrow>{book.pdfTeaser}</GlowLink>
            </div>
          </Col>
          )}
          <Col xs={12} md={3}>
            <Link href={`/dashboard/books/${book.id}/edit/sample-file`}>
              <Button variant="outline-primary">
                <FontAwesomeIcon icon={faPencil} className="me-1" /> {t('addSampleFile')}
              </Button>
            </Link>
          </Col>
        </Row>

        {/* Preview Images */}
        <Row className='my-4'>
          <Col>
            <h4>{t('previewImages')}</h4>

            {book.previewImages && book.previewImages.length > 0 && (
              <Row className='mb-4 g-4'>
                {[...book.previewImages]
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((pi) => {
                    const caption = isSin ? pi.caption?.si : pi.caption?.en;
                    return (
                      <Col xs={12} sm={6} md={6} xl={4} xxl={3} key={pi.id}>
                        <Card className='w-100'>
                          <Card.Img variant="top" src={pi.url} className={!caption ? "rounded-bottom" : undefined} />
                          
                          {caption && (
                            <Card.Body>
                              <Card.Text className='text-center mb-0'>{caption}</Card.Text>
                            </Card.Body>
                          )}
                        </Card>
                      </Col>
                    );
                })}
              </Row>
            )}
            <Link href={`/dashboard/books/${book.id}/edit/preview-images`}>
              <Button variant="outline-primary">
                <FontAwesomeIcon icon={faPlus} className="me-1" /> {t('addPreviewImages')}
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    );
  };

  // Render

  return (
    <div>
      {/* Breadcrumb */}
      <Row>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs="span">
              <Link href="/dashboard">{t('dashboard')}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs="span">
              <Link href="/dashboard/books">{t('books')}</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {/* English section */}
      {renderSection(false)}

      {/* Thick divider */}
      <div className='p-5' />

      {/* Sinhala section */}
      {renderSection(true)}

      {/* Record metadata */}
      <RecordMetadata
        createdAt={book.createdAt}
        createdBy={book.createdBy}
        updatedAt={book.updatedAt}
        updatedBy={book.updatedBy}
      />

      {/* Action bar */}
      <Row className="align-items-center mb-4">
        <Col>
          <ButtonGroup>
            <Button variant="secondary" onClick={() => router.push(`/dashboard/books/${book.id}/edit`)}>
              <FontAwesomeIcon icon={faPen} className="me-1" /> {t('edit')}
            </Button>
            <Button
              variant={book.status === DocumentStatus.ACTIVE ? 'warning' : 'success'}
              onClick={book.status === DocumentStatus.ACTIVE
                ? () => deactivateBookMutation(book.id)
                : () => activateBookMutation(book.id)
              }
              disabled={isPendingActivate || isPendingDeactivate}
            >
              <FontAwesomeIcon icon={book.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye} className="me-1" />
              {book.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
            </Button>
          </ButtonGroup>
        </Col>
        <Col xs="auto">
          <Button variant="danger" onClick={() => setDeleteModalShow(true)} disabled={isPendingDelete}>
            <FontAwesomeIcon icon={faTrash} className="me-1" /> {t('delete')}
          </Button>
        </Col>
      </Row>

      {/* Error alerts */}
      {isActivateError && activateError && (
        <Row className="my-3"><Col>
          <Alert variant="danger" dismissible>
            <Alert.Heading>{t('activateErrorTitle')}</Alert.Heading>
            <p>{activateError.message}</p>
          </Alert>
        </Col></Row>
      )}
      {isDeactivateError && deactivateError && (
        <Row className="my-3"><Col>
          <Alert variant="danger" dismissible>
            <Alert.Heading>{t('deactivateErrorTitle')}</Alert.Heading>
            <p>{deactivateError.message}</p>
          </Alert>
        </Col></Row>
      )}
      {isDeleteError && deleteError && (
        <Row className="my-3"><Col>
          <Alert variant="danger" dismissible>
            <Alert.Heading>{t('deleteErrorTitle')}</Alert.Heading>
            <p>{deleteError.message}</p>
          </Alert>
        </Col></Row>
      )}

      {/* Delete modal */}
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
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BookOptionsViewer;