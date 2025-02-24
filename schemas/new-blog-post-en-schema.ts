import * as yup from 'yup';
import {
  MAX_BLOG_CONTENT_LENGTH,
  MAX_BLOG_DESCRIPTION_LENGTH,
  MAX_BLOG_SUMMARY_LENGTH,
  MAX_BLOG_TITLE_LENGTH,
  MIN_BLOG_CONTENT_LENGTH,
  MIN_BLOG_DESCRIPTION_LENGTH,
  MIN_BLOG_SUMMARY_LENGTH,
  MIN_BLOG_TITLE_LENGTH
} from '@/constants/validation-vars'

export const getNewBlogPostEnSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    titleEn: yup.string()
      .min(MIN_BLOG_TITLE_LENGTH, t('titleEnTooShort', { min: MIN_BLOG_TITLE_LENGTH }) )
      .max(MAX_BLOG_TITLE_LENGTH, t('titleEnTooLong', { max: MAX_BLOG_TITLE_LENGTH }) )
      .required(t('titleEnRequired')),
    summaryEn: yup.string()
      .min(MIN_BLOG_SUMMARY_LENGTH, t('summaryEnTooShort', { min: MIN_BLOG_SUMMARY_LENGTH }) )
      .max(MAX_BLOG_SUMMARY_LENGTH, t('summaryEnTooLong', { max: MAX_BLOG_SUMMARY_LENGTH }) )
      .required(t('summaryEnRequired')),
    contentEn: yup.string()
      .min(MIN_BLOG_CONTENT_LENGTH, t('contentEnTooShort', { min: MIN_BLOG_CONTENT_LENGTH }))
      .max(MAX_BLOG_CONTENT_LENGTH, t('contentEnTooLong', { max: MAX_BLOG_CONTENT_LENGTH }))
      .required(t('contentEnRequired')),
    pageDescriptionEn: yup.string()
      .min(MIN_BLOG_DESCRIPTION_LENGTH, t('pageDescriptionEnTooShort', { min: MIN_BLOG_DESCRIPTION_LENGTH }) )
      .max(MAX_BLOG_DESCRIPTION_LENGTH, t('pageDescriptionEnTooLong', { max: MAX_BLOG_DESCRIPTION_LENGTH }) )
      .required(t('pageDescriptionEnRequired')),
    keywords: yup.array()
      .of(yup.string().trim())
      .transform((value, originalValue) =>
        Array.isArray(originalValue)
          ? originalValue.filter(v => v && v.trim() !== '')
          : []
      )
      .min(1, t('keywordsRequired')),
    dateTime: yup.date()
      .required(t('dateTimeRequired'))
      .default(() => new Date()),
  });
}
