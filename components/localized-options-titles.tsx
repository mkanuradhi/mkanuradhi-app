import { LocalizedString } from '@/types/locale.types';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Badge } from 'react-bootstrap';

const baseTPath = 'components.LocalizedOptionsTitles';

interface LocalizedOptionsTitlesProps {
  title: LocalizedString;
  className?: string;
}

const LocalizedOptionsTitles = ({ title, className }: LocalizedOptionsTitlesProps) => {
  const t = useTranslations(baseTPath);
  const entries = Object.entries(title).filter(([, text]) => text?.trim());

  if (entries.length === 0) return null;

  return (
    <ul className={`list-unstyled mb-0 ${className ?? ''}`}>
      {entries.map(([lang, text]) => (
        <li key={lang} className="d-flex align-items-baseline gap-2 text-body-secondary">
          <Badge
            bg="secondary-subtle"
            text="secondary-emphasis"
            className="flex-shrink-0 fw-semibold"
            style={{ minWidth: 30 }}
          >
            {t(`${lang}`)}
          </Badge>
          <span lang={lang} className="h5">
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default LocalizedOptionsTitles;