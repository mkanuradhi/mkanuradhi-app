import * as yup from 'yup';
import {
  MAX_PUBLICATION_ABSTRACT_LENGTH,
  MAX_PUBLICATION_BIBTEX_LENGTH,
  MAX_PUBLICATION_SOURCE_LENGTH,
  MAX_PUBLICATION_TITLE_LENGTH,
  MAX_PUBLICATION_URL_LENGTH,
  MAX_PUBLICATION_YEAR,
  MIN_PUBLICATION_SOURCE_LENGTH,
  MIN_PUBLICATION_TITLE_LENGTH,
  MIN_PUBLICATION_YEAR,
} from '@/constants/validation-vars';
import PublicationType from '@/enums/publication-type';
import PublicationStatus from '@/enums/publication-status';

export const getNewPublicationSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    type: yup.string()
      .oneOf(Object.values(PublicationType), t('typeInvalid'))
      .required(t('typeRequired')),
    year: yup.number()
      .typeError(t('yearMustBeNumber'))
      .integer(t('yearMustBeAnInteger'))
      .min(MIN_PUBLICATION_YEAR, t('yearTooLow', { min: MIN_PUBLICATION_YEAR }))
      .max(MAX_PUBLICATION_YEAR, t('yearTooHigh', { max: MAX_PUBLICATION_YEAR }))
      .test(
        'len',
        t('yearInvalid'),
        (value) => value !== undefined && value.toString().length === 4
      )
      .required(t('yearRequired')),
    title: yup.string()
      .min(MIN_PUBLICATION_TITLE_LENGTH, t('titleTooShort', { min: MIN_PUBLICATION_TITLE_LENGTH }) )
      .max(MAX_PUBLICATION_TITLE_LENGTH, t('titleTooLong', { max: MAX_PUBLICATION_TITLE_LENGTH }) )
      .required(t('titleRequired')),
    source: yup.string()
      .min(MIN_PUBLICATION_SOURCE_LENGTH, t('sourceTooShort', { min: MIN_PUBLICATION_SOURCE_LENGTH }) )
      .max(MAX_PUBLICATION_SOURCE_LENGTH, t('sourceTooLong', { max: MAX_PUBLICATION_SOURCE_LENGTH }) ),
    authors: yup.array()
      .of(
        yup.object({
          name: yup.string().trim().required(t('authorNameRequired')),
          affiliation: yup.string().nullable(),
          profileUrl: yup.string().url(t('urlMustBeValid')).nullable(),
          isMe: yup.boolean(),
          corresponding: yup.boolean(),
          equallyContributed: yup.boolean(),
        })
      )
      .min(1, t('authorsRequired'))
      .test(
        'unique-authors',
        t('authorsMustBeUnique'),
        (authors) => {
          if (!Array.isArray(authors)) return true;
          const names = authors.map(a => (a?.name ?? '').trim().toLowerCase());
          const duplicates = names.filter((name, idx) => names.indexOf(name) !== idx);
          return duplicates.length === 0;
        }
      )
      .test('one-isMe', t('authorExactlyOneIsMe'), (authors) =>
        authors ? authors.filter(a => a.isMe).length === 1 : false
      )
      .test('max-one-corresponding', t('authorAtMostOneCorresponding'), (authors) =>
        authors ? authors.filter(a => a.corresponding).length <= 1 : true
      )
      .test(
        'at-least-two-equal-contributors',
        t('atLeastTwoEqualContributors'),
        function (authors) {
          const equalCount = (authors || []).filter(a => a.equallyContributed).length;
          return equalCount === 0 || equalCount >= 2;
        }
      ),
    publicationStatus: yup.string()
      .oneOf(Object.values(PublicationStatus), t('publicationStatusInvalid'))
      .required(t('publicationStatusRequired')),
    tags: yup.array()
      .of(yup.string().trim())
      .transform((value, originalValue) =>
        Array.isArray(originalValue)
          ? originalValue.filter(v => v && v.trim() !== '')
          : []
      ),
    keywords: yup.array()
      .of(yup.string().trim())
      .transform((value, originalValue) =>
        Array.isArray(originalValue)
          ? originalValue.filter(v => v && v.trim() !== '')
          : []
      ),
    publicationUrl: yup.string()
      .url(t('urlMustBeValid'))
      .nullable()
      .notRequired()
      .max(MAX_PUBLICATION_URL_LENGTH, t('urlTooLong', { max: MAX_PUBLICATION_URL_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    pdfUrl: yup.string()
      .url(t('urlMustBeValid'))
      .notRequired()
      .max(MAX_PUBLICATION_URL_LENGTH, t('urlTooLong', { max: MAX_PUBLICATION_URL_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    doiUrl: yup.string()
      .url(t('urlMustBeValid'))
      .notRequired()
      .max(MAX_PUBLICATION_URL_LENGTH, t('urlTooLong', { max: MAX_PUBLICATION_URL_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    preprintUrl: yup.string()
      .url(t('urlMustBeValid'))
      .notRequired()
      .max(MAX_PUBLICATION_URL_LENGTH, t('urlTooLong', { max: MAX_PUBLICATION_URL_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    slidesUrl: yup.string()
      .url(t('urlMustBeValid'))
      .notRequired()
      .max(MAX_PUBLICATION_URL_LENGTH, t('urlTooLong', { max: MAX_PUBLICATION_URL_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    abstract: yup.string()
      .notRequired()
      .max(MAX_PUBLICATION_ABSTRACT_LENGTH, t('abstractTooLong', { max: MAX_PUBLICATION_ABSTRACT_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    bibtex: yup.string()
      .notRequired()
      .max(MAX_PUBLICATION_BIBTEX_LENGTH, t('bibtexTooLong', { max: MAX_PUBLICATION_BIBTEX_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    ris: yup.string()
      .notRequired()
      .max(MAX_PUBLICATION_BIBTEX_LENGTH, t('risTooLong', { max: MAX_PUBLICATION_BIBTEX_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    publishedDate: yup.date()
      .nullable()
      .notRequired()
      .min(new Date('2010-01-01'), t('publishedDateTooEarly'))
      .max(new Date(), t('publishedDateCannotBeInFuture'))
      .typeError(t('publishedDateInvalid'))
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
  });
};
