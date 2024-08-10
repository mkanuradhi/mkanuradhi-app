import { useState, useEffect } from 'react';
import i18n from 'i18next';

const langKey = 'lang';

const useLanguage = () => {
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem(langKey) || 'en';
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    localStorage.setItem(langKey, lng);
  };

  return { language, changeLanguage };
};

export default useLanguage;