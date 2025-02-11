"use server";

import { getTranslations } from "next-intl/server";

export const getClerkLocalization = async (locale: string) => {
  const clerkTPath = "clerk";
  const t = await getTranslations({ locale, namespace: clerkTPath });

  const localization = {
    backButton: t('backButton'),
    formFieldLabel__emailAddress: t('formFieldLabel__emailAddress'),
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
      form_identifier_not_found: t('unstable__errors.form_identifier_not_found'),
      zxcvbn: {
        goodPassword: t('unstable__errors.zxcvbn.goodPassword'),
      }
    }
  };

  return localization;
}