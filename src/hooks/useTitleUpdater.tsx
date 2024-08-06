import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useTitleUpdater = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('title');
  }, [t]);
};

export default useTitleUpdater;