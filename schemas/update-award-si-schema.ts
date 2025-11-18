import * as yup from 'yup';
import {
  MAX_AWARD_CO_RECIPIENT_NAME_LENGTH,
  MAX_AWARD_CO_RECIPIENTS,
  MAX_AWARD_DESCRIPTION_LENGTH,
  MAX_AWARD_TITLE_LENGTH,
  MIN_AWARD_DESCRIPTION_LENGTH,
  MIN_AWARD_TITLE_LENGTH,
} from '@/constants/validation-vars'

export const getUpdateAwardSiSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    titleSi: yup.string()
      .trim()
      .min(MIN_AWARD_TITLE_LENGTH, t('titleSiTooShort', { min: MIN_AWARD_TITLE_LENGTH }) )
      .max(MAX_AWARD_TITLE_LENGTH, t('titleSiTooLong', { max: MAX_AWARD_TITLE_LENGTH }) )
      .required(t('titleSiRequired')),
    descriptionSi: yup.string()
      .trim()
      .min(MIN_AWARD_DESCRIPTION_LENGTH, t('descriptionSiTooShort', { min: MIN_AWARD_DESCRIPTION_LENGTH }))
      .max(MAX_AWARD_DESCRIPTION_LENGTH, t('descriptionSiTooLong', { max: MAX_AWARD_DESCRIPTION_LENGTH }))
      .required(t('descriptionSiRequired')),
    issuerSi: yup.string()
      .trim()
      .min(MIN_AWARD_DESCRIPTION_LENGTH, t('issuerSiTooShort', { min: MIN_AWARD_DESCRIPTION_LENGTH }))
      .max(MAX_AWARD_DESCRIPTION_LENGTH, t('issuerSiTooLong', { max: MAX_AWARD_DESCRIPTION_LENGTH }))
      .required(t('issuerSiRequired')),
    issuerLocationSi: yup.string()
      .trim()
      .max(MAX_AWARD_DESCRIPTION_LENGTH, t('issuerLocationSiTooLong', { max: MAX_AWARD_DESCRIPTION_LENGTH })),
    ceremonyLocationSi: yup.string()
      .trim()
      .max(MAX_AWARD_DESCRIPTION_LENGTH, t('ceremonyLocationSiTooLong', { max: MAX_AWARD_DESCRIPTION_LENGTH })),
    coRecipientsSi: yup.array()
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
  });
}
