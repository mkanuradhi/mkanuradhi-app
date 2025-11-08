import * as yup from 'yup';
import {
  MAX_AWARD_CO_RECIPIENT_NAME_LENGTH,
  MAX_AWARD_CO_RECIPIENTS,
  MAX_AWARD_DESCRIPTION_LENGTH,
  MAX_AWARD_TITLE_LENGTH,
  MAX_AWARD_URL_LENGTH,
  MAX_AWARD_YEAR,
  MIN_AWARD_DESCRIPTION_LENGTH,
  MIN_AWARD_TITLE_LENGTH,
  MIN_AWARD_YEAR,
} from '@/constants/validation-vars'
import AwardType from '@/enums/award-type';
import AwardScope from '@/enums/award-scope';
import AwardRole from '@/enums/award-role';
import AwardResult from '@/enums/award-result';
import AwardCategory from '@/enums/award-category';

export const getNewAwardEnSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    year: yup.number()
      .typeError(t('yearMustBeNumber'))
      .integer(t('yearMustBeAnInteger'))
      .min(MIN_AWARD_YEAR, t('yearTooLow', { min: MIN_AWARD_YEAR }))
      .max(MAX_AWARD_YEAR, t('yearTooHigh', { max: MAX_AWARD_YEAR }))
      .test(
        'len',
        t('yearInvalid'),
        (value) => value !== undefined && value.toString().length === 4
      )
      .required(t('yearRequired')),
    titleEn: yup.string()
      .trim()
      .min(MIN_AWARD_TITLE_LENGTH, t('titleEnTooShort', { min: MIN_AWARD_TITLE_LENGTH }) )
      .max(MAX_AWARD_TITLE_LENGTH, t('titleEnTooLong', { max: MAX_AWARD_TITLE_LENGTH }) )
      .required(t('titleEnRequired')),
    descriptionEn: yup.string()
      .trim()
      .min(MIN_AWARD_DESCRIPTION_LENGTH, t('descriptionEnTooShort', { min: MIN_AWARD_DESCRIPTION_LENGTH }) )
      .max(MAX_AWARD_DESCRIPTION_LENGTH, t('descriptionEnTooLong', { max: MAX_AWARD_DESCRIPTION_LENGTH }) )
      .required(t('descriptionEnRequired')),
    issuerEn: yup.string()
      .trim()
      .min(MIN_AWARD_DESCRIPTION_LENGTH, t('issuerEnTooShort', { min: MIN_AWARD_DESCRIPTION_LENGTH }))
      .max(MAX_AWARD_DESCRIPTION_LENGTH, t('issuerEnTooLong', { max: MAX_AWARD_DESCRIPTION_LENGTH }))
      .required(t('issuerEnRequired')),
    issuerLocationEn: yup.string()
      .trim()
      .max(MAX_AWARD_DESCRIPTION_LENGTH, t('issuerLocationEnTooLong', { max: MAX_AWARD_DESCRIPTION_LENGTH })),
    ceremonyLocationEn: yup.string()
      .trim()
      .max(MAX_AWARD_DESCRIPTION_LENGTH, t('ceremonyLocationEnTooLong', { max: MAX_AWARD_DESCRIPTION_LENGTH })),
    coRecipientsEn: yup.array()
      .of(yup
        .string()
        .trim()
        .max(MAX_AWARD_CO_RECIPIENT_NAME_LENGTH, t('coRecipientNameTooLong', { max: MAX_AWARD_CO_RECIPIENT_NAME_LENGTH }))
      )
      .transform((value, originalValue) =>
        Array.isArray(originalValue)
          ? originalValue.filter(v => v && v.trim() !== '')
          : []
      )
      .max(MAX_AWARD_CO_RECIPIENTS, t('coRecipientsTooMany', { max: MAX_AWARD_CO_RECIPIENTS }))
      .test(
        'unique-co-recipients',
        t('coRecipientsMustBeUnique'),
        (coRecipients) => {
          if (!Array.isArray(coRecipients)) return true;
          const names = coRecipients.map(cr => (cr ?? '').trim().toLowerCase());
          const duplicates = names.filter((name, idx) => names.indexOf(name) !== idx);
          return duplicates.length === 0;
        }
      ),
    receivedDate: yup.date()
          .required(t('receivedDateRequired'))
          .default(() => new Date()),
    type: yup.string()
      .oneOf(Object.values(AwardType), t('typeInvalid'))
      .required(t('typeRequired')),
    scope: yup.string()
      .oneOf(Object.values(AwardScope), t('scopeInvalid'))
      .required(t('scopeRequired')),
    role: yup.string()
      .oneOf(Object.values(AwardRole), t('roleInvalid'))
      .required(t('roleRequired')),
    result: yup.string()
      .oneOf(Object.values(AwardResult), t('resultInvalid'))
      .required(t('resultRequired')),
    category: yup.string()
      .oneOf(Object.values(AwardCategory), t('categoryInvalid'))
      .required(t('categoryRequired')),
    eventUrl: yup.string()
      .url(t('urlMustBeValid'))
      .nullable()
      .notRequired()
      .max(MAX_AWARD_URL_LENGTH, t('urlTooLong', { max: MAX_AWARD_URL_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    relatedWorkUrl: yup.string()
      .url(t('urlMustBeValid'))
      .nullable()
      .notRequired()
      .max(MAX_AWARD_URL_LENGTH, t('urlTooLong', { max: MAX_AWARD_URL_LENGTH }) )
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      }),
    monetaryValue: yup.string()
      .trim()
      .notRequired()  
      .max(MAX_AWARD_TITLE_LENGTH, t('monetaryValueTooLong', { max: MAX_AWARD_TITLE_LENGTH }) ),
  });
}
