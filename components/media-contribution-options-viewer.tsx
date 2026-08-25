"use client";
import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
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
import SanitizedHtml from './sanitized-html';
import Badge from 'react-bootstrap/Badge';
import EditableImage from './editable-image';
import EditableImagePlaceholder from './editable-image-placeholder';
import { MediaContributionAuthor, MediaContributionInterviewer } from '@/interfaces/i-media-contribution';
import { useActivateMediaContributionMutation, useDeactivateMediaContributionMutation, useDeleteMediaContributionMutation, useMediaContributionByIdQuery } from '@/hooks/use-media-contributions';

const baseTPath = 'components.MediaContributionOptionsViewer';

interface MediaContributionOptionsViewerProps {
  mediaContributionId: string;
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

const getAuthorName = (author: MediaContributionAuthor|MediaContributionInterviewer, isSi: boolean): string => {
  if (isSi) return author.name.si || author.name.en || '';
  return author.name.en || author.name.si || '';
};

// Sub-component: Author list

interface AuthorListProps {
  mediaContributionId: string;
  authors: MediaContributionAuthor[];
  isSi: boolean;
}

const AuthorList: React.FC<AuthorListProps> = ({mediaContributionId, authors, isSi}) => (
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
              editHref={`/dashboard/media-contributions/${mediaContributionId}/edit/author-image/${author.id}`}
              width={40}
              height={40}
              borderRadius='100%'
            />
          ) : (
            <EditableImagePlaceholder
              editHref={`/dashboard/media-contributions/${mediaContributionId}/edit/author-image/${author.id}`}
              width={40}
              height={40}
              borderRadius='100%'
            />
          )}
          <div className="flex-grow-1">
            <span>{name}</span>
          </div>
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

interface InterviewerListProps {
  mediaContributionId: string;
  interviewers: MediaContributionInterviewer[];
  isSi: boolean;
}

const InterviewerList: React.FC<InterviewerListProps> = ({mediaContributionId, interviewers, isSi}) => (
  <div>
    {interviewers.map((interviewer, index) => {
      const name = getAuthorName(interviewer, isSi);
      return (
        <div
          key={index}
          className="d-flex align-items-center gap-2 py-2"
          style={{ borderBottom: index < interviewers.length - 1 ? '0.5px solid var(--bs-border-color)' : 'none' }}
        >
          {interviewer.imageUrl ? (
            <EditableImage
              src={interviewer.imageUrl}
              alt={getInitials(name)}
              editHref={`/dashboard/media-contributions/${mediaContributionId}/edit/interviewer-image/${interviewer.id}`}
              width={40}
              height={40}
              borderRadius='100%'
            />
          ) : (
            <EditableImagePlaceholder
              editHref={`/dashboard/media-contributions/${mediaContributionId}/edit/interviewer-image/${interviewer.id}`}
              width={40}
              height={40}
              borderRadius='100%'
            />
          )}
          <div className="flex-grow-1">
            <span>{name}</span>
          </div>
          {interviewer.profileUrl && (
            <a href={interviewer.profileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--bs-info)' }}>
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

// Sub-component: Topic chips

interface TopicChipsProps {
  topics: { en?: string; si?: string }[];
  isSi: boolean;
  label: string;
}

const TopicChips: React.FC<TopicChipsProps> = ({ topics, isSi, label }) => {
  const visible = topics
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

// Main component

const MediaContributionOptionsViewer: React.FC<MediaContributionOptionsViewerProps> = ({ mediaContributionId }) => {
  const t = useTranslations(baseTPath);
  const lang = useLocale();
  const isSi = lang === LANG_SI;
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const router = useRouter();

  const { data: mediaContribution, isPending, isError, isFetching, error: mediaContributionError } = useMediaContributionByIdQuery(mediaContributionId);
  const { mutate: deleteMediaContributionMutation,    isPending: isPendingDelete,     isError: isDeleteError,     error: deleteError }     = useDeleteMediaContributionMutation();
  const { mutate: activateMediaContributionMutation,  isPending: isPendingActivate,   isError: isActivateError,   error: activateError }   = useActivateMediaContributionMutation();
  const { mutate: deactivateMediaContributionMutation, isPending: isPendingDeactivate, isError: isDeactivateError, error: deactivateError } = useDeactivateMediaContributionMutation();

  if (isPending || isFetching) return <LoadingContainer />;

  if (isError && mediaContributionError) {
    return (
      <Row><Col>
        <h5>{t('failMediaContribution')}</h5>
        <p>{mediaContributionError.message}</p>
      </Col></Row>
    );
  }

  const selectedTitle = isSi
    ? `'${mediaContribution.title.si || mediaContribution.title.en}'`
    : `'${mediaContribution.title.en}'`;

  const handleDelete = () => {
    deleteMediaContributionMutation(mediaContribution.id);
    setDeleteModalShow(false);
    router.replace('/dashboard/media-contributions');
  };
  
  const languageLabel =
    mediaContribution.language === 'si' ? t('langSinhala') :
    mediaContribution.language === 'ta' ? t('langTamil') :
    t('langEnglish'); // 'en' or fallback

  // Locale section renderer

  const renderSection = (isSin: boolean) => {
    const titleOriginal       = mediaContribution.titleOriginal;
    const subtitleOriginal    = mediaContribution.subtitleOriginal;
    const title       = isSin ? mediaContribution.title.si       : mediaContribution.title.en;
    const subtitle    = isSin ? mediaContribution.subtitle?.si   : mediaContribution.subtitle?.en;
    const description = isSin ? mediaContribution.description.si : mediaContribution.description.en;
    const content     = isSin ? mediaContribution.content?.si    : mediaContribution.content?.en;

    const metaItems: MetaItem[] = [
      { label: t('language'),   value: languageLabel   },
      { label: t('displayOrder'),  value: mediaContribution.displayOrder  },
    ];

    return (
      <div>

        {/* Cover + title block */}
        <div className="d-flex gap-3 align-items-start mb-3">
          {mediaContribution.coverImage ? (
            <EditableImage
              src={mediaContribution.coverImage}
              alt={title || ''}
              editHref={`/dashboard/media-contributions/${mediaContribution.id}/edit/cover-image`}
              width={90}
              height={126}
              borderRadius='6px'
            />
          ) : (
            <EditableImagePlaceholder
              editHref={`/dashboard/media-contributions/${mediaContribution.id}/edit/cover-image`}
              width={90}
              height={126}
              borderRadius='6px'
            />
          )}
          <div className="flex-grow-1">
            <h1 className="mb-1 d-flex align-items-center gap-2 flex-wrap">
              {titleOriginal}
              {mediaContribution.featured && (
                <FontAwesomeIcon icon={faStar} style={{ color: '#BA7517', fontSize: 16 }} title={t('featured')} />
              )}
            </h1>
            {subtitleOriginal && <h2 className="h4 text-secondary mb-2">{subtitleOriginal}</h2>}
            <span className={`badge ${mediaContribution.status === DocumentStatus.ACTIVE ? 'bg-success' : 'bg-warning text-dark'}`}>
              {mediaContribution.status === DocumentStatus.ACTIVE ? t('active') : t('inactive')}
            </span>
            <p className="font-monospace text-muted mt-2 mb-0">
              path: {mediaContribution.path}
            </p>
          </div>
        </div>
        <Row>
          <Col>
            <h5 className="mb-1">
              {title}
            </h5>
            {subtitle && <h6 className="text-secondary mb-2">{subtitle}</h6>}
          </Col>
        </Row>

        <hr />

        {/* Metadata grid — only shows available fields */}
        <MetaGrid items={metaItems} />

        <hr />

        {/* Topics */}
        <TopicChips
          topics={mediaContribution.topics}
          isSi={isSin}
          label={t('topics')}
        />

        <hr />

        {/* Authors */}
        {mediaContribution.authors && (
          <div className="mb-3">
            <h4 className="mb-2">{t('authors')}</h4>
            <AuthorList
              mediaContributionId={mediaContribution.id}
              authors={mediaContribution.authors}
              isSi={isSin}
            />
          </div>
        )}

        <hr />

        {/* Interviewers */}
        {mediaContribution.interviewers && (
          <div className="mb-3">
            <h4 className="mb-2">{t('interviewers')}</h4>
            <InterviewerList
              mediaContributionId={mediaContribution.id}
              interviewers={mediaContribution.interviewers}
              isSi={isSin}
            />
          </div>
        )}

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

        {/* Content */}
        {content && (
          <>
          <hr />
          <Row>
            <Col>
              <SanitizedHtml html={content} />
            </Col>
          </Row>
          </>
        )}

        <hr />

        {/* Publisher */}
        {mediaContribution.outlet && (
          <>
            <Row className="mb-3">
              <Col>
                <h4 className="mb-2">{t('outlet')}</h4>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <div className="d-flex align-items-center gap-3">
                  {mediaContribution.outlet.imageUrl ? (
                    <EditableImage
                      src={mediaContribution.outlet.imageUrl}
                      alt={`${mediaContribution.outlet.name.en} logo`}
                      editHref={`/dashboard/media-contributions/${mediaContributionId}/edit/outlet-image`}
                      width={40}
                      height={40}
                      borderRadius='100%'
                    />
                  ) : (
                    <EditableImagePlaceholder
                      editHref={`/dashboard/media-contributions/${mediaContributionId}/edit/outlet-image`}
                      width={40}
                      height={40}
                      borderRadius='100%'
                    />
                  )}

                  <div>
                    <h6 className="mb-0">
                      <OptionalLink href={mediaContribution.outlet.webUrl} className="text-decoration-none">
                        {isSin ? mediaContribution.outlet.name.si : mediaContribution.outlet.name.en}
                      </OptionalLink>
                    </h6>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}

        <hr />

        {/* Buy Link */}
        { mediaContribution.sourceUrl && (
          <Row className="mb-3">
            <Col>
              <h4 className="mb-2">{t('links')}</h4>
              <div className="mb-1">
                <GlowLink href={mediaContribution.sourceUrl} newTab withArrow>{mediaContribution.sourceUrl}</GlowLink>
              </div>
            </Col>
          </Row>
        )}

        <Row className="mb-3">
          <Col md={12}>
            <h4 className="mb-2">{t('sampleFile')}</h4>
          </Col>
          {mediaContribution.pdfLink && (
          <Col xs={12} md={9}>
            <div className="mb-1">
              <GlowLink href={mediaContribution.pdfLink} newTab withArrow>{mediaContribution.pdfLink}</GlowLink>
            </div>
          </Col>
          )}
          <Col xs={12} md={3}>
            <Link href={`/dashboard/media-contributions/${mediaContribution.id}/edit/sample-file`}>
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

            {mediaContribution.previewImages && mediaContribution.previewImages.length > 0 && (
              <Row className='mb-4 g-4'>
                {[...mediaContribution.previewImages]
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
            <Link href={`/dashboard/media-contributions/${mediaContribution.id}/edit/preview-images`}>
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
              <Link href="/dashboard/media-contributions">{t('mediaContributions')}</Link>
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
        createdAt={mediaContribution.createdAt}
        createdBy={mediaContribution.createdBy}
        updatedAt={mediaContribution.updatedAt}
        updatedBy={mediaContribution.updatedBy}
      />

      {/* Action bar */}
      <Row className="align-items-center mb-4">
        <Col>
          <ButtonGroup>
            <Button variant="secondary" onClick={() => router.push(`/dashboard/media-contributions/${mediaContribution.id}/edit`)}>
              <FontAwesomeIcon icon={faPen} className="me-1" /> {t('edit')}
            </Button>
            <Button
              variant={mediaContribution.status === DocumentStatus.ACTIVE ? 'warning' : 'success'}
              onClick={mediaContribution.status === DocumentStatus.ACTIVE
                ? () => deactivateMediaContributionMutation(mediaContribution.id)
                : () => activateMediaContributionMutation(mediaContribution.id)
              }
              disabled={isPendingActivate || isPendingDeactivate}
            >
              <FontAwesomeIcon icon={mediaContribution.status === DocumentStatus.ACTIVE ? faEyeSlash : faEye} className="me-1" />
              {mediaContribution.status === DocumentStatus.ACTIVE ? t('deactivate') : t('activate')}
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

export default MediaContributionOptionsViewer;