import * as yup from 'yup';

const MAX_TITLE_LENGTH = 100;

const MIN_SUMMARY_LENGTH = 30;
const MAX_SUMMARY_LENGTH = 400;

const MIN_CONTENT_LENGTH = 50;
const MAX_CONTENT_LENGTH = 5000;

const MIN_DESCRIPTION_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 160;

export const getNewBlogPostEnSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    titleEn: yup.string()
      .max(MAX_TITLE_LENGTH, t('titleEnTooLong', { max: MAX_TITLE_LENGTH }) )
      .required(t('titleEnRequired')),
    summaryEn: yup.string()
      .min(MIN_SUMMARY_LENGTH, t('summaryEnTooShort', { min: MIN_SUMMARY_LENGTH }) )
      .max(MAX_SUMMARY_LENGTH, t('summaryEnTooLong', { max: MAX_SUMMARY_LENGTH }) )
      .required(t('summaryEnRequired')),
    contentEn: yup.string()
      .min(MIN_CONTENT_LENGTH, t('contentEnTooShort', { min: MIN_CONTENT_LENGTH }))
      .max(MAX_CONTENT_LENGTH, t('contentEnTooLong', { max: MAX_CONTENT_LENGTH }))
      .required(t('contentEnRequired')),
    pageDescriptionEn: yup.string()
      .min(MIN_DESCRIPTION_LENGTH, t('pageDescriptionEnTooShort', { min: MIN_DESCRIPTION_LENGTH }) )
      .max(MAX_DESCRIPTION_LENGTH, t('pageDescriptionEnTooLong', { max: MAX_DESCRIPTION_LENGTH }) )
      .required(t('pageDescriptionEnRequired')),
  });
}
