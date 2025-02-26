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

export const getUpdateBlogPostSiSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    titleSi: yup.string()
      .min(MIN_BLOG_TITLE_LENGTH, t('titleSiTooShort', { min: MIN_BLOG_TITLE_LENGTH }) )
      .max(MAX_BLOG_TITLE_LENGTH, t('titleSiTooLong', { max: MAX_BLOG_TITLE_LENGTH }) )
      .required(t('titleSiRequired')),
    summarySi: yup.string()
      .min(MIN_BLOG_SUMMARY_LENGTH, t('summarySiTooShort', { min: MIN_BLOG_SUMMARY_LENGTH }) )
      .max(MAX_BLOG_SUMMARY_LENGTH, t('summarySiTooLong', { max: MAX_BLOG_SUMMARY_LENGTH }) )
      .required(t('summarySiRequired')),
    contentSi: yup.string()
      .min(MIN_BLOG_CONTENT_LENGTH, t('contentSiTooShort', { min: MIN_BLOG_CONTENT_LENGTH }))
      .max(MAX_BLOG_CONTENT_LENGTH, t('contentSiTooLong', { max: MAX_BLOG_CONTENT_LENGTH }))
      .required(t('contentSiRequired')),
    pageDescriptionSi: yup.string()
      .min(MIN_BLOG_DESCRIPTION_LENGTH, t('pageDescriptionSiTooShort', { min: MIN_BLOG_DESCRIPTION_LENGTH }) )
      .max(MAX_BLOG_DESCRIPTION_LENGTH, t('pageDescriptionSiTooLong', { max: MAX_BLOG_DESCRIPTION_LENGTH }) )
      .required(t('pageDescriptionSiRequired')),
  });
}
