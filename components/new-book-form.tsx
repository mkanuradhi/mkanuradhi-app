"use client";
import React, { FC, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
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
import { useCreateBookMutation } from '@/hooks/use-books';
import { CreateBookDto } from '@/dtos/book-dto';
import { getNewBookSchema } from '@/schemas/new-book-schema';
import { BookAuthorRole, BookIsbnFormat, BookLanguage, BookPriceCurrency } from '@/enums/book-enums';
import RequiredFormLabel from './required-form-label';
import Book, { BookIsbn } from '@/interfaces/i-book';
import { MAX_BOOK_CONTENT_LENGTH, MAX_BOOK_DESCRIPTION_LENGTH } from '@/constants/validation-vars';

const baseTPath = 'components.NewBookForm';

// ---- Initial values -------------------------------------------------------

const initialValues = {
  title:       { en: '', si: '' },
  titleOriginal: '',
  subtitle:    { en: '', si: '' },
  subtitleOriginal: '',
  description: { en: '', si: '' },
  content:     { en: '', si: '' },
  publisher:   { 
    name:    { en: '', si: '' }, 
    address: { en: '', si: '' }, 
    webUrl:  ''
  },
  subjects:    [] as { en: string; si: string }[],
  authors:     [{
    name: { en: '', si: '' },
    role: BookAuthorRole.AUTHOR,
    profileUrl: ''
  }],
  writtenLang:   BookLanguage.ENGLISH,
  publishedYear: new Date().getFullYear(),
  edition:       '',
  isbns:         [] as BookIsbn[],
  pages:         '',
  tags:          [] as string[],
  price:         { amount: '' as number | '', currency: BookPriceCurrency.LKR.toString() },
  audiences:     [] as { en: string; si: string }[],
  dimensions:    { en: '', si: '' },
  buyLink:       '',
  featured:      false,
  displayOrder:  '',
  tagInput:      '', // local ui state — not sent to API
};

// ---- Props ------------------------------------------------

interface NewBookFormProps {
  onSuccess: (book: Book) => void;
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

const NewBookForm: FC<NewBookFormProps> = ({ onSuccess }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();
  const { mutateAsync: createBookMutation, isPending: isPendingCreateBook } = useCreateBookMutation();
  const [activeLocale, setActiveLocale] = useState<'en' | 'si'>('en');

  // ---- Submit ------------------------------------------------

  const handleSubmit = async (
    values: typeof initialValues,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const bookDto: CreateBookDto = {
      title:       { en: values.title.en.trim(),       si: values.title.si.trim()       || undefined },
      titleOriginal: values.titleOriginal,
      subtitle:    values.subtitle.en || values.subtitle.si
                     ? { en: values.subtitle.en.trim() || undefined, si: values.subtitle.si.trim() || undefined }
                     : undefined,
      subtitleOriginal: values.subtitleOriginal ? values.subtitleOriginal : undefined,
      description: { en: values.description.en.trim(), si: values.description.si.trim() || undefined },
      content:     { en: values.content.en.trim(),     si: values.content.si.trim()     || undefined },
      publisher:   {
        name:    { en: values.publisher.name.en.trim(), si: values.publisher.name.si.trim() || undefined },
        address: { en: values.publisher.address.en.trim(), si: values.publisher.address.si.trim() || undefined },
        webUrl:  values.publisher.webUrl?.trim() || undefined,
      },
      subjects:     values.subjects
                     .filter(s => s.en.trim() || s.si.trim())
                     .map(s => ({ en: s.en.trim() || undefined, si: s.si.trim() || undefined })),
      authors: values.authors.map(a => ({
        name:       { en: a.name.en.trim(), si: a.name.si.trim() || undefined },
        role:       a.role,
        profileUrl: a.profileUrl?.trim() || undefined,
      })),
      writtenLang:   values.writtenLang,
      publishedYear: Number(values.publishedYear),
      edition:       values.edition?.trim()  || undefined,
      isbns:         values.isbns.map(a => ({
        format:      a.format,
        value:       a.value.trim(),
      })),
      pages:         values.pages ? Number(values.pages) : undefined,
      tags:          values.tags,
      price:         values.price.amount === '' || Number(values.price.amount) === 0 
                      ? undefined 
                      : { 
                        amount: Math.round(Number(values.price.amount) * 100),
                        currency: values.price.currency,
                      },
      audiences:     values.audiences
                     ? values.audiences.map(a => ({ en: a.en.trim(), si: a.si.trim() }))
                     : undefined,
      dimensions:   { en: values.dimensions.en.trim(), si: values.dimensions.si.trim() },
      buyLink:       values.buyLink?.trim()     || undefined,
      featured:      values.featured,
      displayOrder:  values.displayOrder ? Number(values.displayOrder) : undefined,
    };

    try {
      const createdBook = await createBookMutation(bookDto);
      onSuccess(createdBook);
    } catch (error: any) {
      actions.setStatus({ error: error.message || 'Failed to create book.' });
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
          validationSchema={getNewBookSchema(t)}
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
                    <BootstrapForm.Text className="text-muted">{t('descriptionEnHelp', { max: MAX_BOOK_DESCRIPTION_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="description.en" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}
                {activeLocale === 'si' && (
                  <BootstrapForm.Group className="mb-4" controlId="formDescriptionSi">
                    <BootstrapForm.Label>{t('descriptionSiLabel')}</BootstrapForm.Label>
                    <Field name="description.si" as="textarea" rows={3} placeholder={t('descriptionSiPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('descriptionSiHelp', { max: MAX_BOOK_DESCRIPTION_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="description.si" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}

                {/* ---- Content ------------------------------------------------ */}
                {activeLocale === 'en' && (
                  <BootstrapForm.Group className="mb-4" controlId="formContentEn">
                    <RequiredFormLabel>{t('contentEnLabel')}</RequiredFormLabel>
                    <Field name="content.en" as="textarea" rows={6} placeholder={t('contentEnPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('contentEnHelp', { max: MAX_BOOK_CONTENT_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="content.en" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}
                {activeLocale === 'si' && (
                  <BootstrapForm.Group className="mb-4" controlId="formContentSi">
                    <BootstrapForm.Label>{t('contentSiLabel')}</BootstrapForm.Label>
                    <Field name="content.si" as="textarea" rows={6} placeholder={t('contentSiPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('contentSiHelp', { max: MAX_BOOK_CONTENT_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="content.si" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}

                <hr />

                <BootstrapForm.Group className="mb-4" controlId="formTitleOriginal">
                  <RequiredFormLabel>{t('titleOriginalLabel')}</RequiredFormLabel>
                  <Field name="titleOriginal" type="text" placeholder={t('titleOriginalPlaceholder')} className="form-control" />
                  <BootstrapForm.Text className="text-muted">{t('titleOriginalHelp')}</BootstrapForm.Text>
                  <ErrorMessage name="titleOriginal" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-4" controlId="formSubtitleOriginal">
                  <BootstrapForm.Label>{t('subtitleOriginalLabel')}</BootstrapForm.Label>
                  <Field name="subtitleOriginal" type="text" placeholder={t('subtitleOriginalPlaceholder')} className="form-control" />
                  <BootstrapForm.Text className="text-muted">{t('subtitleOriginalHelp')}</BootstrapForm.Text>
                  <ErrorMessage name="subtitleOriginal" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ── Publisher ───────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4" controlId="formPublisher">
                  <RequiredFormLabel>{t('publisherLabel')}</RequiredFormLabel>
                  <Card className="shadow mb-3">
                    <Row className='g-0'>
                      <Col xs={12}>
                        <Card.Body>
                          <Row>
                            <Col md={6}>
                              <BootstrapForm.Group className="mb-3" controlId={`formPublisherNameEn`}>
                                <RequiredFormLabel>{t('publisherNameEnLabel')}</RequiredFormLabel>
                                <Field name={`publisher.name.en`} type="text" placeholder={t('publisherNameEnPlaceholder')} className="form-control" />
                                <SafeErrorMessage name={`publisher.name.en`} />
                              </BootstrapForm.Group>
                            </Col>
                            <Col md={6}>
                              <BootstrapForm.Group className="mb-3" controlId={`formPublisherNameSi`}>
                                <RequiredFormLabel>{t('publisherNameSiLabel')}</RequiredFormLabel>
                                <Field name={`publisher.name.si`} type="text" placeholder={t('publisherNameSiPlaceholder')} className="form-control" />
                                <SafeErrorMessage name={`publisher.name.si`} />
                              </BootstrapForm.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <BootstrapForm.Group className="mb-3" controlId={`formPublisherAddressEn`}>
                                <RequiredFormLabel>{t('publisherAddressEnLabel')}</RequiredFormLabel>
                                <Field name={`publisher.address.en`} type="text" placeholder={t('publisherAddressEnPlaceholder')} className="form-control" />
                                <SafeErrorMessage name={`publisher.address.en`} />
                              </BootstrapForm.Group>
                            </Col>
                            <Col md={6}>
                              <BootstrapForm.Group className="mb-3" controlId={`formPublisherAddressSi`}>
                                <RequiredFormLabel>{t('publisherAddressSiLabel')}</RequiredFormLabel>
                                <Field name={`publisher.address.si`} type="text" placeholder={t('publisherAddressSiPlaceholder')} className="form-control" />
                                <SafeErrorMessage name={`publisher.address.si`} />
                              </BootstrapForm.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <BootstrapForm.Group className="mb-3" controlId={`formPublisherWebUrl`}>
                                <BootstrapForm.Label>{t('publisherWebUrlLabel')}</BootstrapForm.Label>
                                <Field name={`publisher.webUrl`} type="url" placeholder={t('publisherWebUrlPlaceholder')} className="form-control" />
                                <SafeErrorMessage name={`publisher.webUrl`} />
                              </BootstrapForm.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </BootstrapForm.Group>

                {/* ---- Authors ------------------------------------------------ */}
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

                            {/* Role and profile URL */}
                            <Row>
                              <Col md={6}>
                                <BootstrapForm.Group className="mb-3" controlId={`formAuthorRole${index}`}>
                                  <RequiredFormLabel>{t('authorRoleLabel')}</RequiredFormLabel>
                                  <Field as="select" name={`authors.${index}.role`} className="form-select">
                                    {Object.values(BookAuthorRole).map(role => (
                                      <option key={role} value={role}>
                                        {String(t(`authorRole.${role}`))}
                                      </option>
                                    ))}
                                  </Field>
                                  <SafeErrorMessage name={`authors.${index}.role`} />
                                </BootstrapForm.Group>
                              </Col>
                              <Col md={6}>
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
                          push({ name: { en: '', si: '' }, role: BookAuthorRole.AUTHOR, profileUrl: '' })
                        }>
                          <FontAwesomeIcon icon={faPlus} className="me-1" /> {t('addAuthor')}
                        </Button>
                        <SafeErrorMessage name="authors" />
                      </div>
                    )}
                  </FieldArray>
                </BootstrapForm.Group>

                {/* ---- Subjects ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4">
                  <BootstrapForm.Label>{t('subjectsLabel')}</BootstrapForm.Label>
                  <BootstrapForm.Text className="text-muted d-block mb-2">{t('subjectsHelp')}</BootstrapForm.Text>
                  <FieldArray name="subjects">
                    {({ push, remove }) => (
                      <div>
                        {values.subjects.map((_, index) => (
                          <Row key={index} className="mb-2">
                            <Col md={6}>
                              <Field name={`subjects.${index}.en`} type="text" placeholder={t('subjectEnPlaceholder')} className="form-control" />
                              <SafeErrorMessage name={`subjects.${index}.en`} />
                            </Col>
                            <Col md={5}>
                              <Field name={`subjects.${index}.si`} type="text" placeholder={t('subjectSiPlaceholder')} className="form-control" />
                              <SafeErrorMessage name={`subjects.${index}.si`} />
                            </Col>
                            <Col md={1}>
                              <Button variant="danger" type="button" onClick={() => remove(index)}>
                                <FontAwesomeIcon icon={faMinus} />
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Button variant="outline-primary" type="button" onClick={() => push({ en: '', si: '' })}>
                          <FontAwesomeIcon icon={faPlus} className="me-1" /> {t('addSubject')}
                        </Button>
                        <SafeErrorMessage name="subject" />
                      </div>
                    )}
                  </FieldArray>
                </BootstrapForm.Group>

                {/* ---- Written language ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formWrittenLang">
                  <RequiredFormLabel>{t('writtenLangLabel')}</RequiredFormLabel>
                  <Field as="select" name="writtenLang" className="form-select">
                    {Object.values(BookLanguage).map(lang => (
                      <option key={lang} value={lang}>
                        {String(t(`bookLanguage.${lang}`))}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="writtenLang" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ---- Published year ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formPublishedYear">
                  <RequiredFormLabel>{t('publishedYearLabel')}</RequiredFormLabel>
                  <Field name="publishedYear" type="number" placeholder={t('publishedYearPlaceholder')} className="form-control" />
                  <ErrorMessage name="publishedYear" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ---- Edition ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formEdition">
                  <BootstrapForm.Label>{t('editionLabel')}</BootstrapForm.Label>
                  <Field name="edition" type="text" placeholder={t('editionPlaceholder')} className="form-control" />
                  <ErrorMessage name="edition" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ---- ISBNs ----------------------------------------------- */}
                <BootstrapForm.Group className="mb-4">
                  <BootstrapForm.Label>{t('isbnsLabel')}</BootstrapForm.Label>
                  <FieldArray name="isbns">
                    {({ push, remove }) => (
                      <div>
                        {values.isbns.map((_, index) => (
                          <div key={index} className="border rounded p-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <strong>{t('isbnLabel', { number: index + 1 })}</strong>
                                <Button variant="danger" size="sm" type="button" onClick={() => remove(index)} title={t('removeIsbnLabel')}>
                                  <FontAwesomeIcon icon={faMinus} />
                                </Button>
                            </div>

                            {/* ISBN value and format - side by side */}
                            <Row>
                              <Col md={6}>
                                <BootstrapForm.Group className="mb-3" controlId={`formIsbnValue${index}`}>
                                  <RequiredFormLabel>{t('isbnValueLabel')}</RequiredFormLabel>
                                  <Field name={`isbns.${index}.value`} type="text" placeholder={t('isbnValuePlaceholder')} className="form-control" />
                                  <SafeErrorMessage name={`isbns.${index}.value`} />
                                </BootstrapForm.Group>
                              </Col>
                              <Col md={6}>
                                <BootstrapForm.Group className="mb-3" controlId={`formIsbnFormat${index}`}>
                                  <RequiredFormLabel>{t('isbnFormatLabel')}</RequiredFormLabel>
                                  <Field as="select" name={`isbns.${index}.format`} className="form-select">
                                    {Object.values(BookIsbnFormat).map(format => (
                                      <option key={format} value={format}>
                                        {String(t(`isbnFormat.${format}`))}
                                      </option>
                                    ))}
                                  </Field>
                                  <SafeErrorMessage name={`isbns.${index}.format`} />
                                </BootstrapForm.Group>
                              </Col>
                            </Row>
                          </div>
                        ))}
                        <Button variant="outline-primary" type="button" onClick={() =>
                          push({ value: '', format: BookIsbnFormat.PAPERBACK })
                        }>
                          <FontAwesomeIcon icon={faPlus} className="me-1" /> {t('addIsbnLabel')}
                        </Button>
                        <SafeErrorMessage name="isbns" />
                      </div>
                    )}
                  </FieldArray>
                </BootstrapForm.Group>

                {/* ---- Pages ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formPages">
                  <BootstrapForm.Label>{t('pagesLabel')}</BootstrapForm.Label>
                  <Field name="pages" type="number" placeholder={t('pagesPlaceholder')} className="form-control" />
                  <ErrorMessage name="pages" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ---- Tags ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formTags">
                  <BootstrapForm.Label>{t('tagsLabel')}</BootstrapForm.Label>
                  <BootstrapForm.Text className="text-muted d-block mb-2">{t('tagsHelp')}</BootstrapForm.Text>
                  <div className="d-flex mb-2">
                    <Field
                      name="tagInput"
                      type="text"
                      placeholder={t('tagsPlaceholder')}
                      className="form-control me-2"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const tag = values.tagInput?.trim().toLowerCase();
                          if (tag && !values.tags.includes(tag)) {
                            setFieldValue('tags', [...values.tags, tag]);
                          }
                          setFieldValue('tagInput', '');
                        }
                      }}
                    />
                    <Button
                      variant="outline-primary"
                      type="button"
                      onClick={() => {
                        const tag = values.tagInput?.trim().toLowerCase();
                        if (tag && !values.tags.includes(tag)) {
                          setFieldValue('tags', [...values.tags, tag]);
                        }
                        setFieldValue('tagInput', '');
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {values.tags.map((tag, index) => (
                      <span key={index} className="badge bg-secondary d-flex align-items-center gap-1">
                        {tag}
                        <FontAwesomeIcon
                          icon={faXmark}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setFieldValue('tags', values.tags.filter((_, i) => i !== index))}
                        />
                      </span>
                    ))}
                  </div>
                  <ErrorMessage name="tags" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ---- Price ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formPrice">
                  <BootstrapForm.Label id="formPriceLabel">{t('priceLabel')}</BootstrapForm.Label>
                  <div className="d-flex gap-4 ps-1">

                    <div>
                      <Field as="select" id="formPriceCurrency" name={`price.currency`} className="form-select" aria-label={t('priceCurrencyLabel')}>
                        {Object.values(BookPriceCurrency).map((currency) => (
                          <option key={currency} value={currency}>
                            {t(`priceCurrency.${currency}`)}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name={`price.currency`} component="p" className="text-danger mt-1" />
                    </div>

                    <div className="flex-grow-1">
                      <Field id="formPriceAmount" name="price.amount" type="text" inputMode="numeric" placeholder={t('priceAmountPlaceholder')} className="form-control" aria-label={t('priceAmountLabel')} />
                      <BootstrapForm.Text className="text-muted">{t('priceAmountHelp')}</BootstrapForm.Text>
                      <ErrorMessage name={`price.amount`} component="p" className="text-danger mt-1" />
                    </div>
                  </div>
                </BootstrapForm.Group>

                {/* ---- Audiences ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4">
                  <BootstrapForm.Label>{t('audiencesLabel')}</BootstrapForm.Label>
                  <BootstrapForm.Text className="text-muted d-block mb-2">{t('audiencesHelp')}</BootstrapForm.Text>
                  <FieldArray name="audiences">
                    {({ push, remove }) => (
                      <div>
                        {values.audiences.map((_, index) => (
                          <Row key={index} className="mb-2">
                            <Col md={6}>
                              <Field name={`audiences.${index}.en`} type="text" placeholder={t('audiencesEnPlaceholder')} className="form-control" />
                              <SafeErrorMessage name={`audiences.${index}.en`} />
                            </Col>
                            <Col md={5}>
                              <Field name={`audiences.${index}.si`} type="text" placeholder={t('audiencesSiPlaceholder')} className="form-control" />
                              <SafeErrorMessage name={`audiences.${index}.si`} />
                            </Col>
                            <Col md={1}>
                              <Button variant="danger" type="button" onClick={() => remove(index)}>
                                <FontAwesomeIcon icon={faMinus} />
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Button variant="outline-primary" type="button" onClick={() => push({ en: '', si: '' })}>
                          <FontAwesomeIcon icon={faPlus} className="me-1" /> {t('addAudience')}
                        </Button>
                        <SafeErrorMessage name="audiences" />
                      </div>
                    )}
                  </FieldArray>
                </BootstrapForm.Group>

                {/* ---- Dimensions ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formDimensions">
                  <BootstrapForm.Label>{t('dimensionsLabel')}</BootstrapForm.Label>
                  <Row>
                    <Col>
                      <Field name="dimensions.en" type="text" placeholder={t('dimensionsEnPlaceholder')} className="form-control" />
                      <ErrorMessage name="dimensions.en" component="p" className="text-danger mt-1" />
                    </Col>
                    <Col>
                      <Field name="dimensions.si" type="text" placeholder={t('dimensionsSiPlaceholder')} className="form-control" />
                      <ErrorMessage name="dimensions.si" component="p" className="text-danger mt-1" />
                    </Col>
                  </Row>
                </BootstrapForm.Group>

                {/* ---- Buy link ------------------------------------------------ */}
                <BootstrapForm.Group className="mb-4" controlId="formBuyLink">
                  <BootstrapForm.Label>{t('buyLinkLabel')}</BootstrapForm.Label>
                  <Field name="buyLink" type="url" placeholder={t('buyLinkPlaceholder')} className="form-control" />
                  <BootstrapForm.Text className="text-muted">{t('buyLinkHelp')}</BootstrapForm.Text>
                  <ErrorMessage name="buyLink" component="p" className="text-danger mt-1" />
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
                  onClick={() => router.push('/dashboard/books')}
                >
                  <FontAwesomeIcon icon={faXmark} className="me-1" /> {t('cancel')}
                </Button>
                <Button variant="success" type="submit" disabled={isSubmitting || isPendingCreateBook}>
                  {isSubmitting || isPendingCreateBook ? (
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

export default NewBookForm;