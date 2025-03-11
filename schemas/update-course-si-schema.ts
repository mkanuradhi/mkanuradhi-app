import * as yup from 'yup';
import {
  MAX_COURSE_DESCRIPTION_LENGTH,
  MAX_COURSE_LOCATION_LENGTH,
  MAX_COURSE_SUBTITLE_LENGTH,
  MAX_COURSE_TITLE_LENGTH,
  MIN_COURSE_DESCRIPTION_LENGTH,
  MIN_COURSE_LOCATION_LENGTH,
  MIN_COURSE_SUBTITLE_LENGTH,
  MIN_COURSE_TITLE_LENGTH,
} from '@/constants/validation-vars'

export const getUpdateCourseSiSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    titleSi: yup.string()
      .min(MIN_COURSE_TITLE_LENGTH, t('titleSiTooShort', { min: MIN_COURSE_TITLE_LENGTH }) )
      .max(MAX_COURSE_TITLE_LENGTH, t('titleSiTooLong', { max: MAX_COURSE_TITLE_LENGTH }) )
      .required(t('titleSiRequired')),
    subtitleSi: yup.string()
      .min(MIN_COURSE_SUBTITLE_LENGTH, t('subtitleSiTooShort', { min: MIN_COURSE_SUBTITLE_LENGTH }) )
      .max(MAX_COURSE_SUBTITLE_LENGTH, t('subtitleSiTooLong', { max: MAX_COURSE_SUBTITLE_LENGTH }) ),
    descriptionSi: yup.string()
      .min(MIN_COURSE_DESCRIPTION_LENGTH, t('descriptionSiTooShort', { min: MIN_COURSE_DESCRIPTION_LENGTH }))
      .max(MAX_COURSE_DESCRIPTION_LENGTH, t('descriptionSiTooLong', { max: MAX_COURSE_DESCRIPTION_LENGTH })),
    locationSi: yup.string()
      .min(MIN_COURSE_LOCATION_LENGTH, t('locationSiTooShort', { min: MIN_COURSE_LOCATION_LENGTH }) )
      .max(MAX_COURSE_LOCATION_LENGTH, t('locationSiTooLong', { max: MAX_COURSE_LOCATION_LENGTH }) )
      .required(t('locationSiRequired')),
  });
}
