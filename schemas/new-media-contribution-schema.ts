import * as yup from 'yup';
import { MAX_MEDIA_CONTRIBUTION_AUTHOR_NAME_LENGTH, MAX_MEDIA_CONTRIBUTION_AUTHORS, MAX_MEDIA_CONTRIBUTION_CONTENT_LENGTH, MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH, MAX_MEDIA_CONTRIBUTION_PUBLISHED_DATE, MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH, MAX_MEDIA_CONTRIBUTION_TOPIC_LENGTH, MAX_MEDIA_CONTRIBUTION_TOPICS, MAX_MEDIA_CONTRIBUTION_URL_LENGTH, MIN_MEDIA_CONTRIBUTION_CONTENT_LENGTH, MIN_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH, MIN_MEDIA_CONTRIBUTION_PUBLISHED_DATE, MIN_MEDIA_CONTRIBUTION_TITLE_LENGTH } from '@/constants/validation-vars';
import { MEDIA_CONTRIBUTION_LANGUAGES, MEDIA_CONTRIBUTION_ROLES, MEDIA_CONTRIBUTION_TYPES } from '@/enums/media-contribution-enums';

export const getNewMediaContributionSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({

    // Localized fields

    title: yup.object({
      en: yup.string()
        .trim()
        .min(MIN_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('titleEnTooShort', { min: MIN_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
        .max(MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('titleEnTooLong', { max: MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
        .required(t('titleEnRequired')),
      si: yup.string()
        .trim()
        .max(MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('titleSiTooLong', { max: MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
        .notRequired(),
    }).required(),

    titleOriginal: yup.string()
      .trim()
      .min(MIN_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('titleOriginalTooShort', { min: MIN_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
      .max(MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('titleOriginalTooLong', { max: MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
      .required(),

    subtitle: yup.object({
      en: yup.string()
        .trim()
        .max(MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('subtitleEnTooLong', { max: MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
        .notRequired(),
      si: yup.string()
        .trim()
        .max(MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('subtitleSiTooLong', { max: MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
        .notRequired(),
    }).notRequired(),

    subtitleOriginal: yup.string()
      .trim()
      .max(MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('subtitleOriginalTooLong', { max: MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
      .notRequired(),

    description: yup.object({
      en: yup.string()
        .trim()
        .min(MIN_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH, t('descriptionEnTooShort', { min: MIN_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH }))
        .max(MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH, t('descriptionEnTooLong', { max: MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH }))
        .required(t('descriptionEnRequired')),
      si: yup.string()
        .trim()
        .max(MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH, t('descriptionSiTooLong', { max: MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH }))
        .notRequired(),
    }).required(),

    content: yup.object({
      en: yup.string()
        .trim()
        .min(MIN_MEDIA_CONTRIBUTION_CONTENT_LENGTH, t('contentEnTooShort', { min: MIN_MEDIA_CONTRIBUTION_CONTENT_LENGTH }))
        .max(MAX_MEDIA_CONTRIBUTION_CONTENT_LENGTH, t('contentEnTooLong', { max: MAX_MEDIA_CONTRIBUTION_CONTENT_LENGTH }))
        .required(t('contentEnRequired')),
      si: yup.string()
        .trim()
        .max(MAX_MEDIA_CONTRIBUTION_CONTENT_LENGTH, t('contentSiTooLong', { max: MAX_MEDIA_CONTRIBUTION_CONTENT_LENGTH }))
        .notRequired(),
    }).required(),

    type: yup.string()
      .oneOf(Object.values(MEDIA_CONTRIBUTION_TYPES), t('typeInvalid'))
      .required(t('typeRequired')),

    role: yup.string()
      .oneOf(Object.values(MEDIA_CONTRIBUTION_ROLES), t('roleInvalid'))
      .required(t('roleRequired')),

    // Topics

    topics: yup.array()
      .of(
        yup.object({
          en: yup.string()
            .trim()
            .max(MAX_MEDIA_CONTRIBUTION_TOPIC_LENGTH, t('topicEnTooLong', { max: MAX_MEDIA_CONTRIBUTION_TOPIC_LENGTH }))
            .notRequired(),
          si: yup.string()
            .trim()
            .max(MAX_MEDIA_CONTRIBUTION_TOPIC_LENGTH, t('topicSiTooLong', { max: MAX_MEDIA_CONTRIBUTION_TOPIC_LENGTH }))
            .notRequired(),
        })
      )
      .max(MAX_MEDIA_CONTRIBUTION_TOPICS, t('topicsTooMany', { max: MAX_MEDIA_CONTRIBUTION_TOPICS }))
      .notRequired(),

    // Authors

    authors: yup.array()
      .of(
        yup.object({
          name: yup.object({
            en: yup.string()
              .trim()
              .min(2, t('authorNameEnTooShort'))
              .max(MAX_MEDIA_CONTRIBUTION_AUTHOR_NAME_LENGTH, t('authorNameEnTooLong', { max: MAX_MEDIA_CONTRIBUTION_AUTHOR_NAME_LENGTH }))
              .required(t('authorNameEnRequired')),
            si: yup.string()
              .trim()
              .max(MAX_MEDIA_CONTRIBUTION_AUTHOR_NAME_LENGTH, t('authorNameSiTooLong', { max: MAX_MEDIA_CONTRIBUTION_AUTHOR_NAME_LENGTH }))
              .notRequired(),
          }).required(),
          isMe: yup.boolean(),
          profileUrl: yup.string()
            .url(t('urlMustBeValid'))
            .max(MAX_MEDIA_CONTRIBUTION_URL_LENGTH, t('urlTooLong', { max: MAX_MEDIA_CONTRIBUTION_URL_LENGTH }))
            .notRequired()
            .transform((value, originalValue) =>
              originalValue === '' ? undefined : value
            ),
        })
      )
      .max(MAX_MEDIA_CONTRIBUTION_AUTHORS, t('authorsTooMany', { max: MAX_MEDIA_CONTRIBUTION_AUTHORS }))
      .notRequired(),
    
    language: yup.string()
      .oneOf(Object.values(MEDIA_CONTRIBUTION_LANGUAGES), t('languageInvalid'))
      .required(t('languageRequired')),

    interviewers: yup.array()
      .of(
        yup.object({
          name: yup.object({
            en: yup.string()
              .trim()
              .min(2, t('interviewerNameEnTooShort'))
              .max(MAX_MEDIA_CONTRIBUTION_AUTHOR_NAME_LENGTH, t('interviewerNameEnTooLong', { max: MAX_MEDIA_CONTRIBUTION_AUTHOR_NAME_LENGTH }))
              .required(t('interviewerNameEnRequired')),
            si: yup.string()
              .trim()
              .max(MAX_MEDIA_CONTRIBUTION_AUTHOR_NAME_LENGTH, t('interviewerNameSiTooLong', { max: MAX_MEDIA_CONTRIBUTION_AUTHOR_NAME_LENGTH }))
              .notRequired(),
          }).required(),
          profileUrl: yup.string()
            .url(t('urlMustBeValid'))
            .max(MAX_MEDIA_CONTRIBUTION_URL_LENGTH, t('urlTooLong', { max: MAX_MEDIA_CONTRIBUTION_URL_LENGTH }))
            .notRequired()
            .transform((value, originalValue) =>
              originalValue === '' ? undefined : value
            ),
        })
      )
      .max(MAX_MEDIA_CONTRIBUTION_AUTHORS, t('interviewersTooMany', { max: MAX_MEDIA_CONTRIBUTION_AUTHORS }))
      .notRequired(),
    
    outlet: yup.object({
      name: yup.object({
        en: yup.string()
          .trim()
          .min(MIN_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('publisherNameEnTooShort', { min: MIN_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
          .max(MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('publisherNameEnTooLong', { max: MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
          .required(t('publisherNameEnRequired')),
        si: yup.string()
          .trim()
          .max(MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH, t('publisherNameSiTooLong', { max: MAX_MEDIA_CONTRIBUTION_TITLE_LENGTH }))
          .notRequired(),
      }).required(),

      webUrl: yup.string()
        .url(t('urlMustBeValid'))
        .max(MAX_MEDIA_CONTRIBUTION_URL_LENGTH, t('urlTooLong', { max: MAX_MEDIA_CONTRIBUTION_URL_LENGTH }))
        .notRequired()
        .transform((value, originalValue) =>
          originalValue === '' ? undefined : value
        ),
    }).notRequired(),

    publishedDate: yup.date()
      .typeError(t('publishedDateMustBeNumber'))
      .min(MIN_MEDIA_CONTRIBUTION_PUBLISHED_DATE, t('publishedDateTooLow', { min: MIN_MEDIA_CONTRIBUTION_PUBLISHED_DATE }))
      .max(MAX_MEDIA_CONTRIBUTION_PUBLISHED_DATE, t('publishedDateTooHigh', { max: MAX_MEDIA_CONTRIBUTION_PUBLISHED_DATE }))
      .required(t('publishedDateRequired')),

    durationSeconds: yup.number()
      .typeError(t('durationSecondsMustBeNumber'))
      .integer(t('durationSecondsMustBeInteger'))
      .min(5, t('durationSecondsTooLow'))
      .notRequired(),
    
    highlightQuote: yup.object({
      en: yup.string()
        .trim()
        .min(MIN_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH, t('descriptionEnTooShort', { min: MIN_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH }))
        .max(MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH, t('descriptionEnTooLong', { max: MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH }))
        .required(t('descriptionEnRequired')),
      si: yup.string()
        .trim()
        .max(MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH, t('descriptionSiTooLong', { max: MAX_MEDIA_CONTRIBUTION_DESCRIPTION_LENGTH }))
        .notRequired(),
    }),

    // Media & links

    sourceUrl: yup.string()
      .url(t('urlMustBeValid'))
      .max(MAX_MEDIA_CONTRIBUTION_URL_LENGTH, t('urlTooLong', { max: MAX_MEDIA_CONTRIBUTION_URL_LENGTH }))
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
