"use client";
import React, { useMemo, useState } from 'react';
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
import { useBookByIdQuery, useUpdateBookMutation } from '@/hooks/use-books';
import { UpdateBookDto } from '@/dtos/book-dto';
import { getUpdateBookSchema } from '@/schemas/update-book-schema';
import { BookAuthorRole, BookIsbnFormat, BookLanguage } from '@/enums/book-enums';
import RequiredFormLabel from './required-form-label';
import LoadingContainer from './loading-container';
import { Link } from '@/i18n/routing';
import { MAX_BOOK_CONTENT_LENGTH, MAX_BOOK_DESCRIPTION_LENGTH } from '@/constants/validation-vars';

// intenstionally use NewBookForm translation namespace for UpdateBookForm, since the fields are the same
const baseTPath = 'components.NewBookForm';

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

interface UpdateBookFormProps {
  bookId: string;
}

// Component

const UpdateBookForm: React.FC<UpdateBookFormProps> = ({ bookId }) => {
  const t = useTranslations(baseTPath);
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<'en' | 'si'>('en');

  const { data: book, isPending, isError, isFetching, error } = useBookByIdQuery(bookId);
  const { mutateAsync: updateBookMutation, isPending: isPendingUpdate } = useUpdateBookMutation();

  // ── Pre-populate from fetched book ───────────────────────────────────────────

  const initialValues = useMemo(() => {
    if (!book) return null;
    return {
      title:         { en: book.title.en       ?? '', si: book.title.si       ?? '' },
      subtitle:      { en: book.subtitle?.en   ?? '', si: book.subtitle?.si   ?? '' },
      description:   { en: book.description.en ?? '', si: book.description.si ?? '' },
      content:       { en: book.content.en     ?? '', si: book.content.si     ?? '' },
      publisher:     {
        name:    { en: book.publisher?.name.en ?? '', si: book.publisher?.name.si ?? '' },
        address: { en: book.publisher?.address.en ?? '', si: book.publisher?.address.si ?? '' },
        webUrl:  book.publisher?.webUrl ?? '',
      },
      subject:       book.subject.map(s => ({ en: s.en ?? '', si: s.si ?? '' })),
      authors:       book.authors.map(a => ({
        id:         a.id,
        name:       { en: a.name.en ?? '', si: a.name.si ?? '' },
        role:       a.role,
        profileUrl: a.profileUrl ?? '',
        imageUrl:   a.imageUrl ?? '',
      })),
      writtenLang:   book.writtenLang,
      publishedYear: book.publishedYear,
      edition:       book.edition       ?? '',
      isbns: book.isbns?.map(isbn => ({
        value:  isbn.value  ?? '',
        format: isbn.format ?? BookIsbnFormat.PAPERBACK,
      })) ?? [],
      pages:         book.pages         ?? '',
      tags:          book.tags          ?? [],
      buyLink:       book.buyLink       ?? '',
      featured:      book.featured,
      displayOrder:  book.displayOrder  ?? '',
      previewImages: book.previewImages?.map(pi => ({
        id: pi.id,
        url: pi.url,
        caption: {en: pi.caption?.en ?? '', si: pi.caption?.si ?? ''},
        displayOrder: pi.displayOrder,
      })),
      tagInput:      '',
      v:             book.v,
    };
  }, [book]);

  // Submit

  const handleSubmit = async (
    values: NonNullable<typeof initialValues>,
    actions: { setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const bookDto: UpdateBookDto = {
      title:       { en: values.title.en.trim(),       si: values.title.si.trim()       || undefined },
      subtitle:    values.subtitle.en || values.subtitle.si
                     ? { en: values.subtitle.en.trim() || undefined, si: values.subtitle.si.trim() || undefined }
                     : undefined,
      description: { en: values.description.en.trim(), si: values.description.si.trim() || undefined },
      content:     { en: values.content.en.trim(),     si: values.content.si.trim()     || undefined },
      publisher:   {
        name:    { en: values.publisher.name.en.trim(), si: values.publisher.name.si.trim() || undefined },
        address: { en: values.publisher.address.en.trim(), si: values.publisher.address.si.trim() || undefined },
        webUrl:  values.publisher.webUrl?.trim() || undefined,
      },
      subject:     values.subject
                     .filter(s => s.en.trim() || s.si.trim())
                     .map(s => ({ en: s.en.trim() || undefined, si: s.si.trim() || undefined })),
      authors: values.authors.map(a => ({
        id:         a.id,
        name:       { en: a.name.en.trim(), si: a.name.si.trim() || undefined },
        role:       a.role,
        profileUrl: a.profileUrl?.trim() || undefined,
      })),
      writtenLang:   values.writtenLang,
      publishedYear: Number(values.publishedYear),
      edition:       values.edition?.trim()  || undefined,
      isbns:         values.isbns.map(i => ({
        format: i.format,
        value:  i.value.trim(),
      })),
      pages:        values.pages ? Number(values.pages) : undefined,
      tags:         values.tags,
      buyLink:      values.buyLink?.trim() || undefined,
      featured:     values.featured,
      displayOrder: values.displayOrder ? Number(values.displayOrder) : undefined,
      previewImages: values.previewImages?.map(pi => ({
        id: pi.id,
        caption: { 
          en: pi.caption?.en || undefined,
          si: pi.caption?.si || undefined },
        displayOrder: pi.displayOrder
      })),
      v:            values.v,
    };

    try {
      await updateBookMutation({ id: bookId, bookDto });
      router.push(`/dashboard/books/${bookId}`);
    } catch (error: any) {
      actions.setStatus({ error: error.message || 'Failed to update book.' });
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

  if (!book || !initialValues) return null;

  // Render

  return (
    <Row className="my-3">
      <Col>
        <Formik
          initialValues={initialValues}
          validationSchema={getUpdateBookSchema(t)}
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

                {/* ── Content ─────────────────────────────────────────────── */}
                {activeLocale === 'en' && (
                  <BootstrapForm.Group className="mb-4" controlId="formContentEn">
                    <RequiredFormLabel>{t('contentEnLabel')}</RequiredFormLabel>
                    <Field name="content.en" as="textarea" rows={10} placeholder={t('contentEnPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('contentEnHelp', { max: MAX_BOOK_CONTENT_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="content.en" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}
                {activeLocale === 'si' && (
                  <BootstrapForm.Group className="mb-4" controlId="formContentSi">
                    <BootstrapForm.Label>{t('contentSiLabel')}</BootstrapForm.Label>
                    <Field name="content.si" as="textarea" rows={10} placeholder={t('contentSiPlaceholder')} className="form-control" />
                    <BootstrapForm.Text className="text-muted">{t('contentSiHelp', { max: MAX_BOOK_CONTENT_LENGTH })}</BootstrapForm.Text>
                    <ErrorMessage name="content.si" component="p" className="text-danger mt-1" />
                  </BootstrapForm.Group>
                )}

                <hr />

                {/* ── Publisher ───────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4" controlId="formPublisher">
                  <RequiredFormLabel>{t('publisherLabel')}</RequiredFormLabel>
                  <Card className="shadow mb-3">
                    <Row className='g-0'>
                      {book.publisher?.imageUrl && (
                      <Col xs={12} className="d-md-none">{/* Mobile */}
                        <Card.Img
                          src={book.publisher?.imageUrl}
                          className="rounded-top rounded-bottom-0 object-fit-cover w-100"
                          style={{ maxHeight: "16rem", minHeight: "12rem" }}
                        />
                      </Col>
                      )}
                      {book.publisher?.imageUrl && (
                      <Col md={3} className="d-none d-md-flex">{/* Desktop */}
                        <div className="position-relative w-100 overflow-hidden">
                          <Card.Img 
                            src={book.publisher?.imageUrl} 
                            className="position-absolute rounded-start rounded-end-0 object-fit-cover w-100 h-100"
                            style={{ inset: 0 }}
                          />
                        </div>
                      </Col>
                      )}
                      <Col xs={12} md={book.publisher?.imageUrl ? 9 : 12}>
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

                {/* ── Authors ─────────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4">
                  <RequiredFormLabel>{t('authorsLabel')}</RequiredFormLabel>
                  <FieldArray name="authors">
                    {({ push, remove }) => (
                      <div>
                        {values.authors.map((au, index) => (
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
                                    {values.authors.length > 1 && (
                                      <Button variant="danger" size="sm" type="button" onClick={() => remove(index)}>
                                        <FontAwesomeIcon icon={faMinus} /> {t('removeAuthor')}
                                      </Button>
                                    )}
                                  </div>
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
                                </Card.Body>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button variant="outline-primary" type="button" onClick={() =>
                          push({ name: { en: '', si: '' }, role: BookAuthorRole.AUTHOR, profileUrl: '', imageUrl: '' })
                        }>
                          <FontAwesomeIcon icon={faPlus} className="me-1" /> {t('addAuthor')}
                        </Button>
                        <SafeErrorMessage name="authors" />
                      </div>
                    )}
                  </FieldArray>
                </BootstrapForm.Group>

                {/* ── Subject ─────────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4">
                  <BootstrapForm.Label>{t('subjectLabel')}</BootstrapForm.Label>
                  <FieldArray name="subject">
                    {({ push, remove }) => (
                      <div>
                        {values.subject.map((_, index) => (
                          <Row key={index} className="mb-2">
                            <Col md={6}>
                              <Field name={`subject.${index}.en`} type="text" placeholder={t('subjectEnPlaceholder')} className="form-control" />
                              <SafeErrorMessage name={`subject.${index}.en`} />
                            </Col>
                            <Col md={5}>
                              <Field name={`subject.${index}.si`} type="text" placeholder={t('subjectSiPlaceholder')} className="form-control" />
                              <SafeErrorMessage name={`subject.${index}.si`} />
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
                  <BootstrapForm.Text className="text-muted d-block mb-2">{t('subjectHelp')}</BootstrapForm.Text>
                </BootstrapForm.Group>

                {/* ── Written language ────────────────────────────────────── */}
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

                {/* ── Published year ──────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4" controlId="formPublishedYear">
                  <RequiredFormLabel>{t('publishedYearLabel')}</RequiredFormLabel>
                  <Field name="publishedYear" type="number" placeholder={t('publishedYearPlaceholder')} className="form-control" />
                  <ErrorMessage name="publishedYear" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ── Edition ─────────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4" controlId="formEdition">
                  <BootstrapForm.Label>{t('editionLabel')}</BootstrapForm.Label>
                  <Field name="edition" type="text" placeholder={t('editionPlaceholder')} className="form-control" />
                  <ErrorMessage name="edition" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ── ISBNs ───────────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4">
                  <BootstrapForm.Label>{t('isbnsLabel')}</BootstrapForm.Label>
                  <FieldArray name="isbns">
                    {({ push, remove }) => (
                      <div>
                        {values.isbns.map((_, index) => (
                          <div key={index} className="border rounded p-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <strong>{t('isbnLabel', { number: index + 1 })}</strong>
                              <Button variant="danger" size="sm" type="button" onClick={() => remove(index)}>
                                <FontAwesomeIcon icon={faMinus} /> {t('removeIsbnLabel')}
                              </Button>
                            </div>
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

                {/* ── Pages ───────────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4" controlId="formPages">
                  <BootstrapForm.Label>{t('pagesLabel')}</BootstrapForm.Label>
                  <Field name="pages" type="number" placeholder={t('pagesPlaceholder')} className="form-control" />
                  <ErrorMessage name="pages" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                {/* ── Tags ────────────────────────────────────────────────── */}
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

                {/* ── Buy link ────────────────────────────────────────────── */}
                <BootstrapForm.Group className="mb-4" controlId="formBuyLink">
                  <BootstrapForm.Label>{t('buyLinkLabel')}</BootstrapForm.Label>
                  <Field name="buyLink" type="url" placeholder={t('buyLinkPlaceholder')} className="form-control" />
                  <BootstrapForm.Text className="text-muted">{t('buyLinkHelp')}</BootstrapForm.Text>
                  <ErrorMessage name="buyLink" component="p" className="text-danger mt-1" />
                </BootstrapForm.Group>

                <Row>
                {/* ── Featured ────────────────────────────────────────────── */}
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
                  {/* ── Display order ───────────────────────────────────────── */}
                  <Col xs={12} md={6}>
                    <BootstrapForm.Group className="mb-4" controlId="formDisplayOrder">
                      <BootstrapForm.Label>{t('displayOrderLabel')}</BootstrapForm.Label>
                      <Field name="displayOrder" type="number" placeholder={t('displayOrderPlaceholder')} className="form-control" />
                      <BootstrapForm.Text className="text-muted">{t('displayOrderHelp')}</BootstrapForm.Text>
                      <ErrorMessage name="displayOrder" component="p" className="text-danger mt-1" />
                    </BootstrapForm.Group>
                  </Col>
                </Row>

                {/* Preview Images */}
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
                <Link href={`/dashboard/books/${bookId}`}>
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

export default UpdateBookForm;