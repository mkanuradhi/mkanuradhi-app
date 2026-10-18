"use client";
import React, { useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray, FieldProps } from 'formik';
import { Col, Row, Form as BootstrapForm, Button, Nav, Card } from 'react-bootstrap';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleNotch,
  faMinus,
  faPaperPlane,
  faPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from '@/i18n/routing';
import { getUpdateMediaContributionSchema } from '@/schemas/update-media-contribution-schema';
import RequiredFormLabel from './required-form-label';
import LoadingContainer from './loading-container';
import { Link } from '@/i18n/routing';
import { MAX_MEDIA_CONTRIBUTION_CONTENT_LENGTH, MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH } from '@/constants/validation-vars';
import { useMediaContributionByIdQuery, useUpdateMediaContributionMutation } from '@/hooks/use-media-contributions';
import { updateMediaContributionDto } from '@/dtos/media-contribution-dto';
import { MEDIA_CONTRIBUTION_LANGUAGES, MEDIA_CONTRIBUTION_ROLES, MEDIA_CONTRIBUTION_TYPES } from '@/enums/media-contribution-enums';

// intentionally use NewMediaContributionForm translation namespace for UpdateMediaContributionForm, since the fields are the same
const baseTPath = 'components.NewMediaContributionForm';

// Safe error message

const SafeErrorMessage = ({ name }: { name: string }) => (
  <ErrorMessage name={name}>
    {(msg) =>
      typeof msg === 'string' ? (
        <p className="text-danger mt-1">{msg}</p>
      ) : null
    }
  </ErrorMessage>
);

const movePreviewImage = (
  images: { id: string; url: string; caption: { en?: string; si?: string }; displayOrder: number }[] | undefined,
  fromIndex: number,
  toIndex: number
) => {
  if (!images) return images;
  const updated = [...images];
  // swap the two items directly
  [updated[fromIndex], updated[toIndex]] = [updated[toIndex], updated[fromIndex]];
  return updated.map((img, i) => ({ ...img, displayOrder: i + 1 }));
};

// Props

interface UpdateMediaContributionFormProps {
  mediaContributionId: string;
}

// Component

const UpdateMediaContributionForm: React.FC<UpdateMediaContributionFormProps> = ({ mediaContributionId }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<'en' | 'si'>('en');

  const { data: mediaContribution, isPending, isError, isFetching, error } = useMediaContributionByIdQuery(mediaContributionId);
  const { mutateAsync: updateMediaContributionMutation, isPending: isPendingUpdate } = useUpdateMediaContributionMutation();

  // ── Pre-populate from fetched media contribution ───────────────────────────────────────────

  const initialValues = useMemo(() => {
    if (!mediaContribution) return null;
    return {
      title:         { en: mediaContribution.title.en       ?? '', si: mediaContribution.title.si       ?? '' },
      titleOriginal: mediaContribution.titleOriginal ?? '',
      subtitle:      { en: mediaContribution.subtitle?.en   ?? '', si: mediaContribution.subtitle?.si   ?? '' },
      subtitleOriginal: mediaContribution.subtitleOriginal ?? '',
      description:   { en: mediaContribution.description.en ?? '', si: mediaContribution.description.si ?? '' },
      content:       { en: mediaContribution.content?.en ?? '', si: mediaContribution.content?.si ?? '' },
      type:        mediaContribution.type,
      role:        mediaContribution.role,
      topics:      mediaContribution.topics.map(s => ({ en: s.en ?? '', si: s.si ?? '' })),
      authors:     mediaContribution.authors?.map(a => ({
        id:         a.id,
        name:       { en: a.name.en ?? '', si: a.name.si ?? '' },
        isMe:       a.isMe,
        profileUrl: a.profileUrl ?? '',
        imageUrl:   a.imageUrl ?? '',
      })),
      language:     mediaContribution.language,
      interviewers: mediaContribution.interviewers?.map(a => ({
        id:         a.id,
        name:       { en: a.name.en ?? '', si: a.name.si ?? '' },
        profileUrl: a.profileUrl ?? '',
        imageUrl:   a.imageUrl ?? '',
      })),
      outlet:     {
        name:    { en: mediaContribution.outlet?.name.en ?? '', si: mediaContribution.outlet?.name.si ?? '' },
        webUrl:  mediaContribution.outlet?.webUrl ?? '',
      },
      publishedDate: mediaContribution.publishedDate ? new Date(mediaContribution.publishedDate).toISOString().slice(0, 10) : '',
      durationSeconds: mediaContribution.durationSeconds ?? '',
      highlightQuote: { en: mediaContribution.highlightQuote?.en ?? '', si: mediaContribution.highlightQuote?.si ?? '' },
      
      sourceUrl:     mediaContribution.sourceUrl ?? '',
      featured:      mediaContribution.featured,
      displayOrder:  mediaContribution.displayOrder ?? '',
      previewImages: mediaContribution.previewImages?.map(pi => ({
        id: pi.id,
        url: pi.url,
        caption: {en: pi.caption?.en ?? '', si: pi.caption?.si ?? ''},
        displayOrder: pi.displayOrder,
      })),
      tagInput:      '',
      v:             mediaContribution.v,
    };
  }, [mediaContribution]);

  // Submit

  const handleSubmit = async (
    values: NonNullable<typeof initialValues>,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const mediaContributionDto: updateMediaContributionDto = {
      title:       { en: values.title.en.trim(),       si: values.title.si.trim()       || undefined },
      titleOriginal: values.titleOriginal,
      subtitle: values.subtitle.en || values.subtitle.si
                  ? { en: values.subtitle.en.trim() || undefined, si: values.subtitle.si.trim() || undefined }
                  : undefined,
      subtitleOriginal: values.subtitleOriginal ? values.subtitleOriginal : undefined,
      description: { en: values.description.en.trim(), si: values.description.si.trim() || undefined },
      content:     { en: values.content.en.trim(),     si: values.content.si.trim()     || undefined },
      type:   values.type,
      role:   values.role,
      topics: values.topics
                .filter(s => s.en.trim() || s.si.trim())
                .map(s => ({ en: s.en.trim() || undefined, si: s.si.trim() || undefined })),
      authors: values.authors?.map(a => ({
        id:         a.id,
        name:       { en: a.name.en.trim(), si: a.name.si.trim() || undefined },
        isMe:       a.isMe,
        profileUrl: a.profileUrl?.trim() || undefined,
      })),
      language:   values.language,
      interviewers: values.interviewers?.map(a => ({
        id:         a.id,
        name:       { en: a.name.en.trim(), si: a.name.si.trim() || undefined },
        profileUrl: a.profileUrl?.trim() || undefined,
      })),
      outlet:   {
        name:    { en: values.outlet.name.en.trim(), si: values.outlet.name.si.trim() || undefined },
        webUrl:  values.outlet.webUrl?.trim() || undefined,
      },
      publishedDate: values.publishedDate,
      durationSeconds: values.durationSeconds ? Number(values.durationSeconds) : null,
      highlightQuote: { en: values.highlightQuote.en.trim(), si: values.highlightQuote.si.trim() || undefined },
      previewImages: values.previewImages?.map(pi => ({
        id: pi.id,
        caption: { 
          en: pi.caption?.en || undefined,
          si: pi.caption?.si || undefined },
        displayOrder: pi.displayOrder
      })),
      sourceUrl:    values.sourceUrl?.trim() || null,
      featured:     values.featured,
      displayOrder: values.displayOrder ? Number(values.displayOrder) : null,
      v:            values.v,
    };

    try {
      await updateMediaContributionMutation({ id: mediaContributionId, mediaContributionDto });
      router.push(`/dashboard/media-contributions/${mediaContributionId}`);
    } catch (error: any) {
      actions.setStatus({ error: error.message || 'Failed to update media contribution.' });
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Loading / error states

  if (isPending || isFetching) return <LoadingContainer />;

  if (isError && error) {
    return (
      <Row><Col>
        <p className="text-danger">{error.message}</p>
      </Col></Row>
    );
  }

  if (!mediaContribution || !initialValues) return null;

  // Render

  return (
    <Row className="my-3">
      <Col>
        <Formik
          initialValues={initialValues}
          validationSchema={getUpdateMediaContributionSchema(t)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting, status }) => (
            <Form>
              <fieldset disabled={isSubmitting}>

                {/* ── Locale tabs ─────────────────────────────────────────── */}
                <Nav
                  variant="tabs"
                  className="mb-4"
                  activeKey={activeLocale}
                  onSelect={(key) => setActiveLocale(key as 'en' | 'si')}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="en">{t('localeTabEnTitle')}</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="si">{t('localeTabSiTitle')}</Nav.Link>
                  </Nav.Item>
                </Nav>

                {/* ── Title ───────────────────────────────────────────────── */}
                {activeLocale === 'en' && (
                  <BootstrapForm.Group className="mb-4" controlId="formTitleEn">
                    <RequiredFormLabel>{t('titleEnLabel')}</RequiredFormLabel>
                    <Field name="title.en" type="text" placeholder={t('titleEnPlaceholder')} className="form-control" />
                    <ErrorMessage name="title.en" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}
                {activeLocale === 'si' && (
                  <BootstrapForm.Group className="mb-4" controlId="formTitleSi">
                    <BootstrapForm.Label>{t('titleSiLabel')}</BootstrapForm.Label>
                    <Field name="title.si" type="text" placeholder={t('titleSiPlaceholder')} className="form-control" />
                    <ErrorMessage name="title.si" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}

                {/* ── Subtitle ────────────────────────────────────────────── */}
                {activeLocale === 'en' && (
                  <BootstrapForm.Group className="mb-4" controlId="formSubtitleEn">
                    <BootstrapForm.Label>{t('subtitleEnLabel')}</BootstrapForm.Label>
                    <Field name="subtitle.en" type="text" placeholder={t('subtitleEnPlaceholder')} className="form-control" />
                    <ErrorMessage name="subtitle.en" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}
                {activeLocale === 'si' && (
                  <BootstrapForm.Group className="mb-4" controlId="formSubtitleSi">
                    <BootstrapForm.Label>{t('subtitleSiLabel')}</BootstrapForm.Label>
                    <Field name="subtitle.si" type="text" placeholder={t('subtitleSiPlaceholder')} className="form-control" />
                    <ErrorMessage name="subtitle.si" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}

                {/* ── Description ─────────────────────────────────────────── */}
                {activeLocale === 'en' && (
                  <BootstrapForm.Group className="mb-4" controlId="formDescriptionEn">
                    <RequiredFormLabel>{t('descriptionEnLabel')}</RequiredFormLabel>
                    <Field name="description.en" as="textarea" rows={3} placeholder={t('descriptionEnPlaceholder')} className="form-control auto-grow" />
                    <BootstrapForm.Text className="text-muted">{t('descriptionEnHelp', { max: MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="description.en" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}
                {activeLocale === 'si' && (
                  <BootstrapForm.Group className="mb-4" controlId="formDescriptionSi">
                    <BootstrapForm.Label>{t('descriptionSiLabel')}</BootstrapForm.Label>
                    <Field name="description.si" as="textarea" rows={3} placeholder={t('descriptionSiPlaceholder')} className="form-control auto-grow" />
                    <BootstrapForm.Text className="text-muted">{t('descriptionSiHelp', { max: MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="description.si" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}

                {/* ── Content ─────────────────────────────────────────────── */}
                {activeLocale === 'en' && (
                  <BootstrapForm.Group className="mb-4" controlId="formContentEn">
                    <RequiredFormLabel>{t('contentEnLabel')}</RequiredFormLabel>
                    <Field name="content.en" as="textarea" rows={6} placeholder={t('contentEnPlaceholder')} className="form-control auto-grow" />
                    <BootstrapForm.Text className="text-muted">{t('contentEnHelp', { max: MAX_MEDIA_CONTRIBUTION_CONTENT_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="content.en" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}
                {activeLocale === 'si' && (
                  <BootstrapForm.Group className="mb-4" controlId="formContentSi">
                    <BootstrapForm.Label>{t('contentSiLabel')}</BootstrapForm.Label>
                    <Field name="content.si" as="textarea" rows={6} placeholder={t('contentSiPlaceholder')} className="form-control auto-grow" />
                    <BootstrapForm.Text className="text-muted">{t('contentSiHelp', { max: MAX_MEDIA_CONTRIBUTION_CONTENT_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="content.si" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}

                <hr />
                {/* ---- Original Title ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formTitleOriginal">
                  <RequiredFormLabel>{t('titleOriginalLabel')}</RequiredFormLabel>
                  <Field name="titleOriginal" type="text" placeholder={t('titleOriginalPlaceholder')} className="form-control" />
                  <BootstrapForm.Text className="text-muted">{t('titleOriginalHelp')}</BootstrapForm.Text>
                  <ErrorMessage name="titleOriginal" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ---- Original Subtitle ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formSubtitleOriginal">
                  <BootstrapForm.Label>{t('subtitleOriginalLabel')}</BootstrapForm.Label>
                  <Field name="subtitleOriginal" type="text" placeholder={t('subtitleOriginalPlaceholder')} className="form-control" />
                  <BootstrapForm.Text className="text-muted">{t('subtitleOriginalHelp')}</BootstrapForm.Text>
                  <ErrorMessage name="subtitleOriginal" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ── Outlet ───────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4" controlId="formOutlet">
                  <RequiredFormLabel>{t('outletLabel')}</RequiredFormLabel>
                  <Card className="shadow mb-3">
                    <Row className='g-0'>
                      {mediaContribution.outlet?.imageUrl && (
                      <Col xs={12} className="d-md-none">{/* Mobile */}
                        <Card.Img
                          src={mediaContribution.outlet?.imageUrl}
                          className="rounded-top rounded-bottom-0 object-fit-cover w-100"
                          style={{ maxHeight: "16rem", minHeight: "12rem" }}
                        />
                      </Col>
                      )}
                      {mediaContribution.outlet?.imageUrl && (
                      <Col md={3} className="d-none d-md-flex">{/* Desktop */}
                        <div className="position-relative w-100 overflow-hidden">
                          <Card.Img 
                            src={mediaContribution.outlet?.imageUrl} 
                            className="position-absolute rounded-start rounded-end-0 object-fit-cover w-100 h-100"
                            style={{ inset: 0 }}
                          />
                        </div>
                      </Col>
                      )}
                      <Col xs={12} md={mediaContribution.outlet?.imageUrl ? 9 : 12}>
                        <Card.Body>
                          <Row>
                            <Col md={6}>
                              <BootstrapForm.Group className="mb-3" controlId={`formOutletNameEn`}>
                                <RequiredFormLabel>{t('outletNameEnLabel')}</RequiredFormLabel>
                                <Field name={`outlet.name.en`} type="text" placeholder={t('outletNameEnPlaceholder')} className="form-control" />
                                <SafeErrorMessage name={`outlet.name.en`} />
                              </BootstrapForm.Group>
                            </Col>
                            <Col md={6}>
                              <BootstrapForm.Group className="mb-3" controlId={`formOutletNameSi`}>
                                <RequiredFormLabel>{t('outletNameSiLabel')}</RequiredFormLabel>
                                <Field name={`outlet.name.si`} type="text" placeholder={t('outletNameSiPlaceholder')} className="form-control" />
                                <SafeErrorMessage name={`outlet.name.si`} />
                              </BootstrapForm.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <BootstrapForm.Group className="mb-3" controlId={`formOutletWebUrl`}>
                                <BootstrapForm.Label>{t('outletWebUrlLabel')}</BootstrapForm.Label>
                                <Field name={`outlet.webUrl`} type="url" placeholder={t('outletWebUrlPlaceholder')} className="form-control" />
                                <SafeErrorMessage name={`outlet.webUrl`} />
                              </BootstrapForm.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </BootstrapForm.Group>

                {/* ── Type ───────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-3" controlId={`formType`}>
                  <RequiredFormLabel>{t('typeLabel')}</RequiredFormLabel>
                  <Field as="select" name={`type`} className="form-select">
                    {MEDIA_CONTRIBUTION_TYPES.map(type => (
                      <option key={type} value={type}>
                        {String(t(`mediaContributionType.${type}`))}
                      </option>
                    ))}
                  </Field>
                  <SafeErrorMessage name={`type`} />
                </BootstrapForm.Group>

                {/* ── Role ───────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-3" controlId={`formRole`}>
                  <RequiredFormLabel>{t('roleLabel')}</RequiredFormLabel>
                  <Field as="select" name={`role`} className="form-select">
                    {MEDIA_CONTRIBUTION_ROLES.map(role => (
                      <option key={role} value={role}>
                        {String(t(`mediaContributionRole.${role}`))}
                      </option>
                    ))}
                  </Field>
                  <SafeErrorMessage name={`role`} />
                </BootstrapForm.Group>

                {/* ── Authors ─────────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4">
                  <RequiredFormLabel>{t('authorsLabel')}</RequiredFormLabel>
                  <FieldArray name="authors">
                    {({ push, remove }) => (
                      <div>
                        {values.authors?.map((au, index) => (
                          <Card key={index} className="shadow mb-3">
                            <Row className='g-0'>
                              {au.imageUrl && (
                              <Col xs={12} className="d-md-none">{/* Mobile */}
                                <Card.Img
                                  src={au.imageUrl}
                                  className="rounded-top rounded-bottom-0 object-fit-cover w-100"
                                  style={{ maxHeight: "16rem", minHeight: "12rem" }}
                                />
                              </Col>
                              )}
                              {au.imageUrl && (
                              <Col md={4} className="d-none d-md-flex">{/* Desktop */}
                                <div className="position-relative w-100 overflow-hidden">
                                  <Card.Img 
                                    src={au.imageUrl} 
                                    className="position-absolute rounded-start rounded-end-0 object-fit-cover w-100 h-100"
                                    style={{ inset: 0 }}
                                  />
                                </div>
                              </Col>
                              )}
                              <Col xs={12} md={au.imageUrl ? 8 : 12}>
                                <Card.Body>
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <strong>{t('authorLabel', { number: index + 1 })}</strong>
                                    {values.authors && values.authors.length > 1 && (
                                      <Button variant="danger" size="sm" type="button" onClick={() => remove(index)}>
                                        <FontAwesomeIcon icon={faMinus} /> {t('removeAuthor')}
                                      </Button>
                                    )}
                                  </div>
                                  {/* Author name — EN and SI side by side */}
                                  <Row>
                                    <Col md={6}>
                                      <BootstrapForm.Group className="mb-3" controlId={`formAuthorNameEn${index}`}>
                                        <RequiredFormLabel>{t('authorNameEnLabel')}</RequiredFormLabel>
                                        <Field name={`authors.${index}.name.en`} type="text" placeholder={t('authorNameEnPlaceholder')} className="form-control" />
                                        <SafeErrorMessage name={`authors.${index}.name.en`} />
                                      </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                      <BootstrapForm.Group className="mb-3" controlId={`formAuthorNameSi${index}`}>
                                        <BootstrapForm.Label>{t('authorNameSiLabel')}</BootstrapForm.Label>
                                        <Field name={`authors.${index}.name.si`} type="text" placeholder={t('authorNameSiPlaceholder')} className="form-control" />
                                        <SafeErrorMessage name={`authors.${index}.name.si`} />
                                      </BootstrapForm.Group>
                                    </Col>
                                  </Row>

                                  {/* Is me and profile URL */}
                                  <Row>
                                    <Col md={3}>
                                      <div className="form-check">
                                        <Field name={`authors.${index}.isMe`}>
                                          {({ field, form }: FieldProps) => {
                                            const handleChange = () => {
                                              const updated = values.authors?.map((author, i) => ({
                                                ...author,
                                                isMe: i === index,
                                              }));
                                              form.setFieldValue("authors", updated);
                                            };
                                            return (
                                              <>
                                                <input
                                                  type="checkbox"
                                                  className="form-check-input"
                                                  id={`author-${index}-isMe`}
                                                  checked={field.value}
                                                  onChange={handleChange}
                                                />
                                                <label className="form-check-label" htmlFor={`author-${index}-isMe`}>
                                                  {t('authorIsMeLabel')}
                                                </label>
                                              </>
                                            );
                                          }}
                                        </Field>
                                      </div>
                                    </Col>
                                    <Col md={9}>
                                      <BootstrapForm.Group className="mb-3" controlId={`formAuthorProfileUrl${index}`}>
                                        <BootstrapForm.Label>{t('authorProfileUrlLabel')}</BootstrapForm.Label>
                                        <Field name={`authors.${index}.profileUrl`} type="url" placeholder={t('authorProfileUrlPlaceholder')} className="form-control" />
                                        <SafeErrorMessage name={`authors.${index}.profileUrl`} />
                                      </BootstrapForm.Group>
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button variant="outline-primary" type="button" onClick={() =>
                          push({ name: { en: '', si: '' }, isMe: false, profileUrl: '', imageUrl: '' })
                        }>
                          <FontAwesomeIcon icon={faPlus} className="me-1" /> {t('addAuthor')}
                        </Button>
                        <SafeErrorMessage name="authors" />
                      </div>
                    )}
                  </FieldArray>
                </BootstrapForm.Group>

                {/* ---- Topics -------------------------------------------- */}
                <BootstrapForm.Group className="mb-4">
                  <BootstrapForm.Label>{t('topicsLabel')}</BootstrapForm.Label>
                  <BootstrapForm.Text className="text-muted d-block mb-2">{t('topicsHelp')}</BootstrapForm.Text>
                  <FieldArray name="topics">
                    {({ push, remove }) => (
                      <div>
                        {values.topics.map((_, index) => (
                          <Row key={index} className="mb-2">
                            <Col md={6}>
                              <Field name={`topics.${index}.en`} type="text" placeholder={t('topicEnPlaceholder')} className="form-control" />
                              <SafeErrorMessage name={`topics.${index}.en`} />
                            </Col>
                            <Col md={5}>
                              <Field name={`topics.${index}.si`} type="text" placeholder={t('topicSiPlaceholder')} className="form-control" />
                              <SafeErrorMessage name={`topics.${index}.si`} />
                            </Col>
                            <Col md={1}>
                              <Button variant="danger" type="button" onClick={() => remove(index)}>
                                <FontAwesomeIcon icon={faMinus} />
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Button variant="outline-primary" type="button" onClick={() => push({ en: '', si: '' })}>
                          <FontAwesomeIcon icon={faPlus} className="me-1" /> {t('addTopic')}
                        </Button>
                        <SafeErrorMessage name="topics" />
                      </div>
                    )}
                  </FieldArray>
                </BootstrapForm.Group>

                {/* ── Language ────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4" controlId="formLanguage">
                  <RequiredFormLabel>{t('languageLabel')}</RequiredFormLabel>
                  <Field as="select" name="language" className="form-select">
                    {MEDIA_CONTRIBUTION_LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>
                        {String(t(`mediaContributionLanguage.${lang}`))}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="language" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ---- Interviewers ---------------------------------------- */}
                <BootstrapForm.Group className="mb-4">
                  <BootstrapForm.Label>{t('interviewersLabel')}</BootstrapForm.Label>
                  <FieldArray name="interviewers">
                    {({ push, remove }) => (
                      <div>
                        {values.interviewers?.map((au, index) => (
                          <Card key={index} className="shadow mb-3">
                            <Row className='g-0'>
                              {au.imageUrl && (
                              <Col xs={12} className="d-md-none">{/* Mobile */}
                                <Card.Img
                                  src={au.imageUrl}
                                  className="rounded-top rounded-bottom-0 object-fit-cover w-100"
                                  style={{ maxHeight: "16rem", minHeight: "12rem" }}
                                />
                              </Col>
                              )}
                              {au.imageUrl && (
                              <Col md={4} className="d-none d-md-flex">{/* Desktop */}
                                <div className="position-relative w-100 overflow-hidden">
                                  <Card.Img 
                                    src={au.imageUrl} 
                                    className="position-absolute rounded-start rounded-end-0 object-fit-cover w-100 h-100"
                                    style={{ inset: 0 }}
                                  />
                                </div>
                              </Col>
                              )}
                              <Col xs={12} md={au.imageUrl ? 8 : 12}>
                                <Card.Body>
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <strong>{t('interviewerLabel', { number: index + 1 })}</strong>
                                    <Button variant="danger" size="sm" type="button" onClick={() => remove(index)} title={t('removeInterviewer')}>
                                      <FontAwesomeIcon icon={faMinus} />
                                    </Button>
                                  </div>
                                  {/* Interviewer name — EN and SI side by side */}
                                  <Row>
                                    <Col md={6}>
                                      <BootstrapForm.Group className="mb-3" controlId={`formInterviewerNameEn${index}`}>
                                        <RequiredFormLabel>{t('interviewerNameEnLabel')}</RequiredFormLabel>
                                        <Field name={`interviewers.${index}.name.en`} type="text" placeholder={t('interviewerNameEnPlaceholder')} className="form-control" />
                                        <SafeErrorMessage name={`interviewers.${index}.name.en`} />
                                      </BootstrapForm.Group>
                                    </Col>
                                    <Col md={6}>
                                      <BootstrapForm.Group className="mb-3" controlId={`formInterviewerNameSi${index}`}>
                                        <BootstrapForm.Label>{t('interviewerNameSiLabel')}</BootstrapForm.Label>
                                        <Field name={`interviewers.${index}.name.si`} type="text" placeholder={t('interviewerNameSiPlaceholder')} className="form-control" />
                                        <SafeErrorMessage name={`interviewers.${index}.name.si`} />
                                      </BootstrapForm.Group>
                                    </Col>
                                  </Row>

                                  {/* profile URL */}
                                  <Row>
                                    <Col>
                                      <BootstrapForm.Group className="mb-3" controlId={`formInterviewerProfileUrl${index}`}>
                                        <BootstrapForm.Label>{t('interviewerProfileUrlLabel')}</BootstrapForm.Label>
                                        <Field name={`interviewers.${index}.profileUrl`} type="url" placeholder={t('interviewerProfileUrlPlaceholder')} className="form-control" />
                                        <SafeErrorMessage name={`interviewers.${index}.profileUrl`} />
                                      </BootstrapForm.Group>
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button variant="outline-primary" type="button" onClick={() =>
                          push({ name: { en: '', si: '' }, isMe: false, profileUrl: '', imageUrl: '' })
                        }>
                          <FontAwesomeIcon icon={faPlus} className="me-1" /> {t('addInterviewer')}
                        </Button>
                        <SafeErrorMessage name="interviewers" />
                      </div>
                    )}
                  </FieldArray>
                </BootstrapForm.Group>

                {/* ---- Published date ---------------------------------------- */}
                <BootstrapForm.Group className="mb-4" controlId="formPublishedDate">
                  <RequiredFormLabel>{t('publishedDateLabel')}</RequiredFormLabel>
                  <Field name="publishedDate" type="date" className="form-control" />
                  <ErrorMessage name="publishedDate" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ---- Duration Seconds` ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formDurationSeconds">
                  <BootstrapForm.Label>{t('durationSecondsLabel')}</BootstrapForm.Label>
                  <Field name="durationSeconds" type="number" placeholder={t('durationSecondsPlaceholder')} className="form-control" />
                  <ErrorMessage name="durationSeconds" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ---- Highlight Quote ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formHighlightQuote">
                  <BootstrapForm.Label>{t('highlightQuoteLabel')}</BootstrapForm.Label>
                  <Row className="mb-2">
                    <Col md={6}>
                      <Field name={`highlightQuote.en`} type="text" placeholder={t('highlightQuoteEnPlaceholder')} className="form-control" />
                      <SafeErrorMessage name={`highlightQuote.en`} />
                    </Col>
                    <Col md={6}>
                      <Field name={`highlightQuote.si`} type="text" placeholder={t('highlightQuoteSiPlaceholder')} className="form-control" />
                      <SafeErrorMessage name={`highlightQuote.si`} />
                    </Col>
                  </Row>
                  <BootstrapForm.Text className="text-muted">{t('highlightQuoteHelp')}</BootstrapForm.Text>
                  <SafeErrorMessage name="highlightQuote" />
                </BootstrapForm.Group>

                {/* ---- Source Url ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formSourceUrl">
                  <BootstrapForm.Label>{t('sourceUrlLabel')}</BootstrapForm.Label>
                  <Field name="sourceUrl" type="url" placeholder={t('sourceUrlPlaceholder')} className="form-control" />
                  <BootstrapForm.Text className="text-muted">{t('sourceUrlHelp')}</BootstrapForm.Text>
                  <ErrorMessage name="sourceUrl" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                <Row>
                {/* ---- Featured ------------------------------------------------ */}
                  <Col xs={12} md={6}>
                    <BootstrapForm.Group className="mb-4" controlId="formFeatured">
                      <BootstrapForm.Label>{t('featuredLabel')}</BootstrapForm.Label>
                      <div className="d-flex align-items-center gap-2">
                        <Field
                          name="featured"
                          type="checkbox"
                          id="formFeatured"
                          className="form-check-input"
                          checked={values.featured}
                          onChange={() => setFieldValue('featured', !values.featured)}
                        />
                        <label htmlFor="formFeatured" className="form-check-label">
                          {t('featuredCheckboxLabel')}
                        </label>
                      </div>
                      <ErrorMessage name="featured" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                  </Col>
                  {/* ---- Display order ------------------------------------------------ */}
                  <Col xs={12} md={6}>
                    <BootstrapForm.Group className="mb-4" controlId="formDisplayOrder">
                      <BootstrapForm.Label>{t('displayOrderLabel')}</BootstrapForm.Label>
                      <Field name="displayOrder" type="number" placeholder={t('displayOrderPlaceholder')} className="form-control" />
                      <BootstrapForm.Text className="text-muted">{t('displayOrderHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="displayOrder" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                  </Col>
                </Row>

                {/* ---- Preview Images ------------------------------------------------ */}
                {values.previewImages && values.previewImages.length > 0 && (
                <Row className='mb-4'>
                  <Col>
                    <h4>{t('previewImages')}</h4>
                      <div className=''>
                        {[...values.previewImages]
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map((pi, index, sortedArr) => {
                          const originalIndex = values.previewImages!.findIndex(img => img.id === pi.id);
                          return (
                          <Card key={pi.id} className='my-3 shadow'>
                            <Row className='g-0'>
                              {/* Mobile */}
                              <Col xs={12} className="d-md-none">
                                <Card.Img
                                  src={pi.url}
                                  className="rounded-top rounded-bottom-0 object-fit-cover w-100"
                                  style={{ maxHeight: "24rem", minHeight: "16rem" }}
                                />
                              </Col>
                              {/* Desktop */}
                              <Col md={4} className="d-none d-md-flex">
                                <div className="position-relative w-100 overflow-hidden">
                                  <Card.Img 
                                    src={pi.url} 
                                    className="position-absolute rounded-start rounded-end-0 object-fit-cover w-100 h-100"
                                    style={{ inset: 0 }}
                                  />
                                </div>
                              </Col>
                              <Col xs={12} md={8}>
                                <Card.Body>
                                  {/* ---- Order controls ------------------------------------------- */}
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Card.Title className="mb-0">
                                      {t('previewImageCaption')}
                                    </Card.Title>
                                    <div className="d-flex gap-1">
                                      <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        type="button"
                                        disabled={index === 0}
                                        title={t('moveUp')}
                                        onClick={() => {
                                          const prevItem = sortedArr[index - 1];
                                          const prevOriginalIndex = values.previewImages!.findIndex(img => img.id === prevItem.id);
                                          setFieldValue(
                                            'previewImages',
                                            movePreviewImage(values.previewImages, originalIndex, prevOriginalIndex)
                                          );
                                        }}
                                      >
                                        <i className="bi bi-arrow-up" aria-hidden="true" />
                                      </Button>
                                      <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        type="button"
                                        disabled={index === sortedArr.length - 1}
                                        title={t('moveDown')}
                                        onClick={() => {
                                          const originalIndex = values.previewImages!.findIndex(img => img.id === pi.id);
                                          const nextItem = sortedArr[index + 1];
                                          const nextOriginalIndex = values.previewImages!.findIndex(img => img.id === nextItem.id);
                                          setFieldValue(
                                            'previewImages',
                                            movePreviewImage(values.previewImages, originalIndex, nextOriginalIndex)
                                          );
                                        }}
                                      >
                                        <i className="bi bi-arrow-down" aria-hidden="true" />
                                      </Button>
                                      <span className="text-muted small ms-2 align-self-center">
                                        {index + 1} / {sortedArr.length}
                                      </span>
                                    </div>
                                  </div>
                                  {/* ---- Captions ------------------------------------------- */}
                                  <Row>
                                    <Col xs={12}>
                                      <BootstrapForm.Group className="mb-3" controlId={`formPreviewImageCaptionEn${originalIndex}`}>
                                        <BootstrapForm.Label>{t('previewImageCaptionEnLabel')}</BootstrapForm.Label>
                                        <Field name={`previewImages.${originalIndex}.caption.en`} type="text" placeholder={t('previewImageCaptionEnPlaceholder')} className="form-control" />
                                        <SafeErrorMessage name={`previewImages.${originalIndex}.caption.en`} />
                                      </BootstrapForm.Group>
                                    </Col>
                                    <Col>
                                      <BootstrapForm.Group className="mb-3" controlId={`formPreviewImageCaptionSi${originalIndex}`}>
                                        <BootstrapForm.Label>{t('previewImageCaptionSiLabel')}</BootstrapForm.Label>
                                        <Field name={`previewImages.${originalIndex}.caption.si`} type="text" placeholder={t('previewImageCaptionSiPlaceholder')} className="form-control" />
                                        <SafeErrorMessage name={`previewImages.${originalIndex}.caption.si`} />
                                      </BootstrapForm.Group>
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Col>
                            </Row>
                          </Card>
                        );
                        })}
                      </div>
                    
                  </Col>
                </Row>
                )}

              </fieldset>

              {/* ── Form actions ─────────────────────────────────────────── */}
              <div className="d-flex justify-content-between mt-4">
                <Link href={`/dashboard/media-contributions/${mediaContributionId}`}>
                  <Button variant="secondary" type="button">
                    <FontAwesomeIcon icon={faXmark} className="me-1" /> {t('cancel')}
                  </Button>
                </Link>
                <Button variant="success" type="submit" disabled={isSubmitting || isPendingUpdate}>
                  {isSubmitting || isPendingUpdate ? (
                    <>
                      <FontAwesomeIcon icon={faCircleNotch} className="me-1" spin /> {t('submitting')}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} className="me-1" /> {t('submit')}
                    </>
                  )}
                </Button>
              </div>

              {status?.error && (
                <div className="alert alert-danger mt-3">{status.error}</div>
              )}

            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

export default UpdateMediaContributionForm;