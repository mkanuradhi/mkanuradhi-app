import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import si from "./si.json";

i18n.use(initReactI18next).init(
  {
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
      },
      si: {
        translation: si,
      },
    },
  }
);

export default i18n;