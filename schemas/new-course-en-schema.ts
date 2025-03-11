import * as yup from 'yup';
import {
  MAX_COURSE_CODE_LENGTH,
  MAX_COURSE_CREDITS,
  MAX_COURSE_DESCRIPTION_LENGTH,
  MAX_COURSE_LOCATION_LENGTH,
  MAX_COURSE_MODE_LENGTH,
  MAX_COURSE_SUBTITLE_LENGTH,
  MAX_COURSE_TITLE_LENGTH,
  MAX_COURSE_YEAR,
  MIN_COURSE_CODE_LENGTH,
  MIN_COURSE_CREDITS,
  MIN_COURSE_DESCRIPTION_LENGTH,
  MIN_COURSE_LOCATION_LENGTH,
  MIN_COURSE_MODE_LENGTH,
  MIN_COURSE_SUBTITLE_LENGTH,
  MIN_COURSE_TITLE_LENGTH,
  MIN_COURSE_YEAR,
} from '@/constants/validation-vars'
import DeliveryMode from '@/enums/delivery-mode';

export const getNewCourseEnSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    year: yup.number()
      .typeError(t('yearMustBeNumber'))
      .integer(t('yearMustBeAnInteger'))
      .min(MIN_COURSE_YEAR, t('yearTooLow', { min: MIN_COURSE_YEAR }))
      .max(MAX_COURSE_YEAR, t('yearTooHigh', { max: MAX_COURSE_YEAR }))
      .test(
        'len',
        t('yearInvalid'),
        (value) => value !== undefined && value.toString().length === 4
      )
      .required(t('yearRequired')),
    code: yup.string()
      .min(MIN_COURSE_CODE_LENGTH, t('codeTooShort', { min: MIN_COURSE_CODE_LENGTH }) )
      .max(MAX_COURSE_CODE_LENGTH, t('codeTooLong', { max: MAX_COURSE_CODE_LENGTH }) ),
    credits: yup.number()
      .typeError(t('creditsMustBeNumber'))
      .min(MIN_COURSE_CREDITS, t('creditsTooLow', { min: MIN_COURSE_CREDITS }))
      .max(MAX_COURSE_CREDITS, t('creditsTooHigh', { max: MAX_COURSE_CREDITS })),
    mode: yup.string()
      .oneOf(Object.values(DeliveryMode), t('modeInvalid'))
      .required(t('modeRequired')),
    titleEn: yup.string()
      .min(MIN_COURSE_TITLE_LENGTH, t('titleEnTooShort', { min: MIN_COURSE_TITLE_LENGTH }) )
      .max(MAX_COURSE_TITLE_LENGTH, t('titleEnTooLong', { max: MAX_COURSE_TITLE_LENGTH }) )
      .required(t('titleEnRequired')),
    subtitleEn: yup.string()
      .min(MIN_COURSE_SUBTITLE_LENGTH, t('subtitleEnTooShort', { min: MIN_COURSE_SUBTITLE_LENGTH }) )
      .max(MAX_COURSE_SUBTITLE_LENGTH, t('subtitleEnTooLong', { max: MAX_COURSE_SUBTITLE_LENGTH }) ),
    descriptionEn: yup.string()
      .min(MIN_COURSE_DESCRIPTION_LENGTH, t('descriptionEnTooShort', { min: MIN_COURSE_DESCRIPTION_LENGTH }))
      .max(MAX_COURSE_DESCRIPTION_LENGTH, t('descriptionEnTooLong', { max: MAX_COURSE_DESCRIPTION_LENGTH })),
    locationEn: yup.string()
      .min(MIN_COURSE_LOCATION_LENGTH, t('locationEnTooShort', { min: MIN_COURSE_LOCATION_LENGTH }) )
      .max(MAX_COURSE_LOCATION_LENGTH, t('locationEnTooLong', { max: MAX_COURSE_LOCATION_LENGTH }) )
      .required(t('locationEnRequired')),
  });
}
