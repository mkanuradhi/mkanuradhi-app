"use client";
import React, { FC, useState } from 'react';
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
import { useCreateMediaContributionMutation } from '@/hooks/use-media-contributions';
import { CreateMediaContributionDto } from '@/dtos/media-contribution-dto';
import { getNewMediaContributionSchema } from '@/schemas/new-media-contribution-schema';
import RequiredFormLabel from './required-form-label';
import MediaContribution from '@/interfaces/i-media-contribution';
import { MAX_MEDIA_CONTRIBUTION_CONTENT_LENGTH, MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH } from '@/constants/validation-vars';
import { MEDIA_CONTRIBUTION_LANGUAGES, MEDIA_CONTRIBUTION_ROLES, MEDIA_CONTRIBUTION_TYPES, MediaContributionLanguage, MediaContributionRole, MediaContributionType } from "@/enums/media-contribution-enums";

const baseTPath = 'components.NewMediaContributionForm';

// ---- Initial values -------------------------------------------------------

const initialValues = {
  title:       { en: '', si: '' },
  titleOriginal: '',
  subtitle:    { en: '', si: '' },
  subtitleOriginal: '',
  description: { en: '', si: '' },
  content:     { en: '', si: '' },

  type: 'newspaper_article' as MediaContributionType,
  role: 'author' as MediaContributionRole,

  topics: [] as { en: string; si: string }[],
  authors:     [{
    name: { en: '', si: '' },
    isMe: false,
    profileUrl: ''
  }],
  language: 'en' as MediaContributionLanguage,
  interviewers: [] as {name: { en: '', si: '' }, profileUrl: ''}[],

  outlet:   { 
    name:    { en: '', si: '' }, 
    webUrl:  ''
  },
  publishedDate: new Date(),
  durationSeconds: undefined,
  highlightQuote: { en: '', si: '' },

  sourceUrl:     '',
  featured:      false,
  displayOrder:  '',
};

// ---- Props ------------------------------------------------

interface NewMediaContributionFormProps {
  onSuccess: (mediaContribution: MediaContribution) => void;
}

// Safe error message — only renders string errors, ignores nested objects
  const SafeErrorMessage = ({ name }: { name: string }) => (
    <ErrorMessage name={name}>
      {(msg) =>
        typeof msg === 'string' ? (
          <p className="text-danger mt-1">{msg}</p>
        ) : null
      }
    </ErrorMessage>
  );

// ---- Component ------------------------------------------------

const NewMediaContributionForm: FC<NewMediaContributionFormProps> = ({ onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();
  const { mutateAsync: createMediaContributionMutation, isPending: isPendingCreateMediaContribution } = useCreateMediaContributionMutation();
  const [activeLocale, setActiveLocale] = useState<'en' | 'si'>('en');

  // ---- Submit ------------------------------------------------

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const mediaContributionDto: CreateMediaContributionDto = {
      title:       { en: values.title.en.trim(),       si: values.title.si.trim()       || undefined },
      titleOriginal: values.titleOriginal,
      subtitle:    values.subtitle.en || values.subtitle.si
                     ? { en: values.subtitle.en.trim() || undefined, si: values.subtitle.si.trim() || undefined }
                     : undefined,
      subtitleOriginal: values.subtitleOriginal ? values.subtitleOriginal : undefined,
      description: { en: values.description.en.trim(), si: values.description.si.trim() || undefined },
      content:     { en: values.content.en.trim(),     si: values.content.si.trim()     || undefined },
      type: values.type,
      role: values.role,
      topics:     values.topics
                     .filter(t => t.en.trim() || t.si.trim())
                     .map(t => ({ en: t.en.trim() || undefined, si: t.si.trim() || undefined })),
      authors: values.authors.map(a => ({
        name:       { en: a.name.en.trim(), si: a.name.si.trim() || undefined },
        isMe:       a.isMe,
        profileUrl: a.profileUrl?.trim() || undefined,
      })),
      language:   values.language,
      interviewers: values.interviewers ? values.interviewers.map(i => ({
        name:       { en: i.name.en.trim(), si: i.name.si.trim() || undefined },
        profileUrl: i.profileUrl?.trim() || undefined,
      })) : [],
      outlet:   {
        name:    { en: values.outlet.name.en.trim(), si: values.outlet.name.si.trim() || undefined },
        webUrl:  values.outlet.webUrl?.trim() || undefined,
      },
      publishedDate: values.publishedDate,
      durationSeconds: values.durationSeconds ? Number(values.durationSeconds) : undefined,
      highlightQuote: { en: values.highlightQuote.en.trim(), si: values.highlightQuote.si.trim() || undefined },
      sourceUrl:     values.sourceUrl?.trim() || undefined,
      featured:      values.featured,
      displayOrder:  values.displayOrder ? Number(values.displayOrder) : undefined,
    };

    try {
      const createdMediaContribution = await createMediaContributionMutation(mediaContributionDto);
      onSuccess(createdMediaContribution);
    } catch (error: any) {
      actions.setStatus({ error: error.message || 'Failed to create media contribution.' });
    } finally {
      actions.setSubmitting(false);
    }
  };

  // ---- Render ------------------------------------------------

  return (
    <Row className="my-3">
      <Col>
        <Formik
          initialValues={initialValues}
          validationSchema={getNewMediaContributionSchema(t)}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting, status }) => (
            <Form>
              <fieldset disabled={isSubmitting}>

                {/* ---- Locale tabs ------------------------------------------------ */}
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

                {/* ---- Title ------------------------------------------------ */}
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

                {/* ---- Subtitle ------------------------------------------------ */}
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

                {/* ---- Description ------------------------------------------------ */}
                {activeLocale === 'en' && (
                  <BootstrapForm.Group className="mb-4" controlId="formDescriptionEn">
                    <RequiredFormLabel>{t('descriptionEnLabel')}</RequiredFormLabel>
                    <Field name="description.en" as="textarea" rows={3} placeholder={t('descriptionEnPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('descriptionEnHelp', { max: MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="description.en" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}
                {activeLocale === 'si' && (
                  <BootstrapForm.Group className="mb-4" controlId="formDescriptionSi">
                    <BootstrapForm.Label>{t('descriptionSiLabel')}</BootstrapForm.Label>
                    <Field name="description.si" as="textarea" rows={3} placeholder={t('descriptionSiPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('descriptionSiHelp', { max: MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="description.si" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}

                {/* ---- Content ------------------------------------------------ */}
                {activeLocale === 'en' && (
                  <BootstrapForm.Group className="mb-4" controlId="formContentEn">
                    <RequiredFormLabel>{t('contentEnLabel')}</RequiredFormLabel>
                    <Field name="content.en" as="textarea" rows={6} placeholder={t('contentEnPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('contentEnHelp', { max: MAX_MEDIA_CONTRIBUTION_CONTENT_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="content.en" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}
                {activeLocale === 'si' && (
                  <BootstrapForm.Group className="mb-4" controlId="formContentSi">
                    <BootstrapForm.Label>{t('contentSiLabel')}</BootstrapForm.Label>
                    <Field name="content.si" as="textarea" rows={6} placeholder={t('contentSiPlaceholder')} className="form-control" />
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
                      <Col xs={12}>
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

                {/* ---- Authors ---------------------------------------- */}
                <BootstrapForm.Group className="mb-4">
                  <RequiredFormLabel>{t('authorsLabel')}</RequiredFormLabel>
                  <FieldArray name="authors">
                    {({ push, remove }) => (
                      <div>
                        {values.authors.map((_, index) => (
                          <div key={index} className="border rounded p-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <strong>{t('authorLabel', { number: index + 1 })}</strong>
                              {values.authors.length > 1 && (
                                <Button variant="danger" size="sm" type="button" onClick={() => remove(index)} title={t('removeAuthor')}>
                                  <FontAwesomeIcon icon={faMinus} />
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
                                        const updated = values.authors.map((author, i) => ({
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
                          </div>
                        ))}
                        <Button variant="outline-primary" type="button" onClick={() =>
                          push({ name: { en: '', si: '' }, isMe: false, profileUrl: '' })
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
                        <SafeErrorMessage name="topic" />
                      </div>
                    )}
                  </FieldArray>
                </BootstrapForm.Group>

                {/* ---- Language ----------------------------------------- */}
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
                        {values.interviewers.map((_, index) => (
                          <div key={index} className="border rounded p-3 mb-3">
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
                          </div>
                        ))}
                        <Button variant="outline-primary" type="button" onClick={() =>
                          push({ name: { en: '', si: '' }, profileUrl: '' })
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
                  <ErrorMessage name="highlightQuote" component="p" className="text-danger mt-1" />
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
              </fieldset>

              {/* ---- Form actions ------------------------------------------------ */}
              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => router.push('/dashboard/media-contributions')}
                >
                  <FontAwesomeIcon icon={faXmark} className="me-1" /> {t('cancel')}
                </Button>
                <Button variant="success" type="submit" disabled={isSubmitting || isPendingCreateMediaContribution}>
                  {isSubmitting || isPendingCreateMediaContribution ? (
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

export default NewMediaContributionForm;