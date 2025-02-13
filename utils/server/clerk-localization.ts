"use server";

import { getTranslations } from "next-intl/server";

export const getClerkLocalization = async (locale: string) => {
  const clerkTPath = "clerk";
  const t = await getTranslations({ locale, namespace: clerkTPath });

  const localization = {
    backButton: t('backButton'),
    formFieldHintText__optional: t('formFieldHintText__optional'),
    formFieldInputPlaceholder__emailAddress: t('formFieldInputPlaceholder__emailAddress'),
    formFieldInputPlaceholder__firstName: t('formFieldInputPlaceholder__firstName'),
    formFieldInputPlaceholder__lastName: t('formFieldInputPlaceholder__lastName'),
    formFieldInputPlaceholder__password: t('formFieldInputPlaceholder__password'),
    formFieldLabel__emailAddress: t('formFieldLabel__emailAddress'),
    formFieldLabel__firstName: t('formFieldLabel__firstName'),
    formFieldLabel__lastName: t('formFieldLabel__lastName'),
    formFieldLabel__password: t('formFieldLabel__password'),
    formButtonPrimary: t('formButtonPrimary'),
    formFieldAction__forgotPassword: t('formFieldAction__forgotPassword'),
    signIn: {
      alternativeMethods: {
        actionLink: t('signIn.alternativeMethods.actionLink'),
        actionText: t('signIn.alternativeMethods.actionText'),
        blockButton__emailCode: t('signIn.alternativeMethods.blockButton__emailCode'),
      },
      forgotPasswordAlternativeMethods: {
        blockButton__resetPassword: t('signIn.forgotPasswordAlternativeMethods.blockButton__resetPassword'),
        label__alternativeMethods: t('signIn.forgotPasswordAlternativeMethods.label__alternativeMethods'),
        title: t('signIn.forgotPasswordAlternativeMethods.title'),
      },
      password: {
        actionLink: t('signIn.password.actionLink'),
        subtitle: t('signIn.password.subtitle'),
        title: t('signIn.password.title'),
      },
      start: {
        title: t('signIn.start.title'),
        subtitle: t('signIn.start.subtitle'),
        actionText: t('signIn.start.actionText'),
        actionLink: t('signIn.start.actionLink'),
      }
    },
    signUp: {
      start: {
        actionLink: t('signUp.start.actionLink'),
        actionLink__use_email: t('signUp.start.actionLink__use_email'),
        actionLink__use_phone: t('signUp.start.actionLink__use_phone'),
        actionText: t('signUp.start.actionText'),
        subtitle: t('signUp.start.subtitle'),
        subtitleCombined: t('signUp.start.subtitleCombined'),
        title: t('signUp.start.title'),
        titleCombined: t('signUp.start.titleCombined'),
      },
    },
    unstable__errors: {
      form_identifier_exists__email_address: t('unstable__errors.form_identifier_exists__email_address'),
      form_identifier_not_found: t('unstable__errors.form_identifier_not_found'),
      form_param_format_invalid: t('unstable__errors.form_param_format_invalid'),
      form_password_incorrect: t('unstable__errors.form_password_incorrect'),
      passwordComplexity: {
        maximumLength: t('unstable__errors.passwordComplexity.maximumLength'),
        minimumLength: t('unstable__errors.passwordComplexity.minimumLength'),
        requireLowercase: t('unstable__errors.passwordComplexity.requireLowercase'),
        requireNumbers: t('unstable__errors.passwordComplexity.requireNumbers'),
        requireSpecialCharacter: t('unstable__errors.passwordComplexity.requireSpecialCharacter'),
        requireUppercase: t('unstable__errors.passwordComplexity.requireUppercase'),
        sentencePrefix: t('unstable__errors.passwordComplexity.sentencePrefix'),
      },
      zxcvbn: {
        goodPassword: t('unstable__errors.zxcvbn.goodPassword'),
      }
    }
  };

  return localization;
}