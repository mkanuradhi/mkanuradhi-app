import * as yup from 'yup';
import {
  MAX_BOOK_AUTHOR_NAME_LENGTH,
  MAX_BOOK_AUTHORS,
  MAX_BOOK_CONTENT_LENGTH,
  MAX_BOOK_DESCRIPTION_LENGTH,
  MAX_BOOK_EDITION_LENGTH,
  MAX_BOOK_ISBN_LENGTH,
  MAX_BOOK_PUBLISHED_YEAR,
  MAX_BOOK_SUBJECT_LENGTH,
  MAX_BOOK_SUBJECTS,
  MAX_BOOK_TAG_LENGTH,
  MAX_BOOK_TAGS,
  MAX_BOOK_TITLE_LENGTH,
  MAX_BOOK_URL_LENGTH,
  MIN_BOOK_CONTENT_LENGTH,
  MIN_BOOK_DESCRIPTION_LENGTH,
  MIN_BOOK_PUBLISHED_YEAR,
  MIN_BOOK_TITLE_LENGTH,
} from '@/constants/validation-vars';
import { BookAuthorRole, BookLanguage } from '@/enums/book-enums';

export const getNewBookSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({

    // Localized fields

    title: yup.object({
      en: yup.string()
        .trim()
        .min(MIN_BOOK_TITLE_LENGTH, t('titleEnTooShort', { min: MIN_BOOK_TITLE_LENGTH }))
        .max(MAX_BOOK_TITLE_LENGTH, t('titleEnTooLong', { max: MAX_BOOK_TITLE_LENGTH }))
        .required(t('titleEnRequired')),
      si: yup.string()
        .trim()
        .max(MAX_BOOK_TITLE_LENGTH, t('titleSiTooLong', { max: MAX_BOOK_TITLE_LENGTH }))
        .notRequired(),
    }).required(),

    subtitle: yup.object({
      en: yup.string()
        .trim()
        .max(MAX_BOOK_TITLE_LENGTH, t('subtitleEnTooLong', { max: MAX_BOOK_TITLE_LENGTH }))
        .notRequired(),
      si: yup.string()
        .trim()
        .max(MAX_BOOK_TITLE_LENGTH, t('subtitleSiTooLong', { max: MAX_BOOK_TITLE_LENGTH }))
        .notRequired(),
    }).notRequired(),

    description: yup.object({
      en: yup.string()
        .trim()
        .min(MIN_BOOK_DESCRIPTION_LENGTH, t('descriptionEnTooShort', { min: MIN_BOOK_DESCRIPTION_LENGTH }))
        .max(MAX_BOOK_DESCRIPTION_LENGTH, t('descriptionEnTooLong', { max: MAX_BOOK_DESCRIPTION_LENGTH }))
        .required(t('descriptionEnRequired')),
      si: yup.string()
        .trim()
        .max(MAX_BOOK_DESCRIPTION_LENGTH, t('descriptionSiTooLong', { max: MAX_BOOK_DESCRIPTION_LENGTH }))
        .notRequired(),
    }).required(),

    content: yup.object({
      en: yup.string()
        .trim()
        .min(MIN_BOOK_CONTENT_LENGTH, t('contentEnTooShort', { min: MIN_BOOK_CONTENT_LENGTH }))
        .max(MAX_BOOK_CONTENT_LENGTH, t('contentEnTooLong', { max: MAX_BOOK_CONTENT_LENGTH }))
        .required(t('contentEnRequired')),
      si: yup.string()
        .trim()
        .max(MAX_BOOK_CONTENT_LENGTH, t('contentSiTooLong', { max: MAX_BOOK_CONTENT_LENGTH }))
        .notRequired(),
    }).required(),

    publisher: yup.object({
      en: yup.string()
        .trim()
        .min(MIN_BOOK_TITLE_LENGTH, t('publisherEnTooShort', { min: MIN_BOOK_TITLE_LENGTH }))
        .max(MAX_BOOK_TITLE_LENGTH, t('publisherEnTooLong', { max: MAX_BOOK_TITLE_LENGTH }))
        .required(t('publisherEnRequired')),
      si: yup.string()
        .trim()
        .max(MAX_BOOK_TITLE_LENGTH, t('publisherSiTooLong', { max: MAX_BOOK_TITLE_LENGTH }))
        .notRequired(),
    }).required(),

    // Authors

    authors: yup.array()
      .of(
        yup.object({
          name: yup.object({
            en: yup.string()
              .trim()
              .min(2, t('authorNameEnTooShort'))
              .max(MAX_BOOK_AUTHOR_NAME_LENGTH, t('authorNameEnTooLong', { max: MAX_BOOK_AUTHOR_NAME_LENGTH }))
              .required(t('authorNameEnRequired')),
            si: yup.string()
              .trim()
              .max(MAX_BOOK_AUTHOR_NAME_LENGTH, t('authorNameSiTooLong', { max: MAX_BOOK_AUTHOR_NAME_LENGTH }))
              .notRequired(),
          }).required(),
          role: yup.string()
            .oneOf(Object.values(BookAuthorRole), t('authorRoleInvalid'))
            .required(t('authorRoleRequired')),
          profileUrl: yup.string()
            .url(t('urlMustBeValid'))
            .max(MAX_BOOK_URL_LENGTH, t('urlTooLong', { max: MAX_BOOK_URL_LENGTH }))
            .notRequired()
            .transform((value, originalValue) =>
              originalValue === '' ? undefined : value
            ),
        })
      )
      .min(1, t('authorsRequired'))
      .max(MAX_BOOK_AUTHORS, t('authorsTooMany', { max: MAX_BOOK_AUTHORS }))
      .required(t('authorsRequired')),

    // Subject

    subject: yup.array()
      .of(
        yup.object({
          en: yup.string()
            .trim()
            .max(MAX_BOOK_SUBJECT_LENGTH, t('subjectEnTooLong', { max: MAX_BOOK_SUBJECT_LENGTH }))
            .notRequired(),
          si: yup.string()
            .trim()
            .max(MAX_BOOK_SUBJECT_LENGTH, t('subjectSiTooLong', { max: MAX_BOOK_SUBJECT_LENGTH }))
            .notRequired(),
        })
      )
      .max(MAX_BOOK_SUBJECTS, t('subjectsTooMany', { max: MAX_BOOK_SUBJECTS }))
      .notRequired(),

    // Publication details

    writtenLang: yup.string()
      .oneOf(Object.values(BookLanguage), t('writtenLangInvalid'))
      .required(t('writtenLangRequired')),

    publishedYear: yup.number()
      .typeError(t('publishedYearMustBeNumber'))
      .integer(t('publishedYearMustBeInteger'))
      .min(MIN_BOOK_PUBLISHED_YEAR, t('publishedYearTooLow', { min: MIN_BOOK_PUBLISHED_YEAR }))
      .max(MAX_BOOK_PUBLISHED_YEAR, t('publishedYearTooHigh', { max: MAX_BOOK_PUBLISHED_YEAR }))
      .required(t('publishedYearRequired')),

    edition: yup.string()
      .trim()
      .max(MAX_BOOK_EDITION_LENGTH, t('editionTooLong', { max: MAX_BOOK_EDITION_LENGTH }))
      .notRequired(),

    isbn: yup.string()
      .trim()
      .max(MAX_BOOK_ISBN_LENGTH, t('isbnTooLong', { max: MAX_BOOK_ISBN_LENGTH }))
      .notRequired(),

    pages: yup.number()
      .typeError(t('pagesMustBeNumber'))
      .integer(t('pagesMustBeInteger'))
      .min(1, t('pagesTooLow'))
      .notRequired(),

    tags: yup.array()
      .of(
        yup.string()
          .trim()
          .max(MAX_BOOK_TAG_LENGTH, t('tagTooLong', { max: MAX_BOOK_TAG_LENGTH }))
      )
      .max(MAX_BOOK_TAGS, t('tagsTooMany', { max: MAX_BOOK_TAGS }))
      .notRequired(),

    // Media & links

    coverImage: yup.string()
      .trim()
      .max(MAX_BOOK_URL_LENGTH, t('urlTooLong', { max: MAX_BOOK_URL_LENGTH }))
      .notRequired()
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : value
      ),

    previewImages: yup.array()
      .of(
        yup.string()
          .trim()
          .max(MAX_BOOK_URL_LENGTH, t('urlTooLong', { max: MAX_BOOK_URL_LENGTH }))
      )
      .notRequired(),

    buyLink: yup.string()
      .url(t('urlMustBeValid'))
      .max(MAX_BOOK_URL_LENGTH, t('urlTooLong', { max: MAX_BOOK_URL_LENGTH }))
      .notRequired()
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : value
      ),

    pdfTeaser: yup.string()
      .url(t('urlMustBeValid'))
      .max(MAX_BOOK_URL_LENGTH, t('urlTooLong', { max: MAX_BOOK_URL_LENGTH }))
      .notRequired()
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : value
      ),

    // Display

    featured: yup.boolean()
      .required(),

    displayOrder: yup.number()
      .typeError(t('displayOrderMustBeNumber'))
      .integer(t('displayOrderMustBeInteger'))
      .min(0, t('displayOrderTooLow'))
      .notRequired(),
  });
};
