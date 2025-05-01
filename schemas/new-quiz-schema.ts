import * as yup from 'yup';
import {
  MAX_QUIZ_DESCRIPTION_LENGTH,
  MAX_QUIZ_DURATION,
  MAX_QUIZ_TITLE_LENGTH,
  MIN_QUIZ_DESCRIPTION_LENGTH,
  MIN_QUIZ_DURATION,
  MIN_QUIZ_TITLE_LENGTH
} from '@/constants/validation-vars';

export const getNewQuizSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    titleEn: yup.string()
      .min(MIN_QUIZ_TITLE_LENGTH, t('titleEnTooShort', { min: MIN_QUIZ_TITLE_LENGTH }) )
      .max(MAX_QUIZ_TITLE_LENGTH, t('titleEnTooLong', { max: MAX_QUIZ_TITLE_LENGTH }) )
      .required(t('titleEnRequired')),
    titleSi: yup.string()
      .min(MIN_QUIZ_TITLE_LENGTH, t('titleSiTooShort', { min: MIN_QUIZ_TITLE_LENGTH }) )
      .max(MAX_QUIZ_TITLE_LENGTH, t('titleSiTooLong', { max: MAX_QUIZ_TITLE_LENGTH }) )
      .required(t('titleSiRequired')),
    descriptionEn: yup.string()
      .min(MIN_QUIZ_DESCRIPTION_LENGTH, t('descriptionEnTooShort', { min: MIN_QUIZ_DESCRIPTION_LENGTH }) )
      .max(MAX_QUIZ_DESCRIPTION_LENGTH, t('descriptionEnTooLong', { max: MAX_QUIZ_DESCRIPTION_LENGTH }) )
      .required(t('descriptionEnRequired')),
    descriptionSi: yup.string()
      .min(MIN_QUIZ_DESCRIPTION_LENGTH, t('descriptionSiTooShort', { min: MIN_QUIZ_DESCRIPTION_LENGTH }) )
      .max(MAX_QUIZ_DESCRIPTION_LENGTH, t('descriptionSiTooLong', { max: MAX_QUIZ_DESCRIPTION_LENGTH }) )
      .required(t('descriptionSiRequired')),
    duration: yup.number()
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      })
      .typeError(t('durationMustBeNumber'))
      .integer(t('durationMustBeWholeNumber'))
      .min(MIN_QUIZ_DURATION, t('durationTooLow', { min: MIN_QUIZ_DURATION }))
      .max(MAX_QUIZ_DURATION, t('durationTooHigh', { max: MAX_QUIZ_DURATION })),
    availableFrom: yup.date()
      .nullable()
      .notRequired()
      .typeError(t('availableFromMustBeDate')),
    availableUntil: yup.date()
      .nullable()
      .notRequired()
      .typeError(t('availableUntilMustBeDate'))
      .test('is-after', t('availableUntilMustBeAfter'), function(value) {
        const { availableFrom } = this.parent;
        // Only validate if both values are provided.
        if (availableFrom && value) {
          return new Date(value) > new Date(availableFrom);
        }
        return true;
      }),
  });
};
