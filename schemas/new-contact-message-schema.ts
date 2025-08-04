import * as yup from 'yup';

export const getNewContactMessageSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    name: yup.string()
      .matches(/^[\p{L}\p{M}\s'-]+$/u, t('nameInvalid'))
      .min(3, t('nameTooShort') )
      .max(40, t('nameTooLong'))
      .required(t('nameRequired')),
    email: yup.string()
      .email(t('emailInvalid'))
      .max(50, t('emailTooLong'))
      .required(t('emailRequired')),
    message: yup.string()
      .min(6, t('messageTooShort') )
      .max(300, t('messageTooLong'))
      .required(t('messageRequired')),
  });
};
