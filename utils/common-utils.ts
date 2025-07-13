
export const truncateText = (text: string, maxLength: number = 100, appendEllipsis: boolean = true): string => {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  const result =
    lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;

  return appendEllipsis ? `${result}…` : result;
};

export const getFormattedDate = (locale: string, dateTime: Date) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateTime));
}

export const getFormattedTime = (locale: string, dateTime: Date) => {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }).format(new Date(dateTime));
}

export const getFormattedDateTime = (locale: string, dateTime: Date): string => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }).format(new Date(dateTime));
}

export const capitalizeLang = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const buildHeaders = (token?: string, extraHeaders?: Record<string, string>) => ({
  headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders ?? {}),
  },
});

export const getCssVar = (name: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export const toInitials = (text: string, withDots: boolean = true): string => {
  if (!text) return '';

  const normalized = String(text).normalize('NFC').trim();

  if (normalized === '') return '';

  const words = normalized.split(/\s+/);

  const initialsArray = words
    .map(word => word.charAt(0).toUpperCase())
    .filter(Boolean);

  if (initialsArray.length === 0) return '';

  if (withDots) {
    return `${initialsArray.join('.')}.`;
  } else {
    return initialsArray.join('');
  }
};

export const formatChartTickLabel = (label: string, format: 'truncate' | 'initials' | 'full', maxLen: number): string => {
  if (label.length <= maxLen || format === 'full') return label;

  if (format === 'truncate') {
    return `${label.slice(0, maxLen)}…`;
  }

  if (format === 'initials') {
    return label
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  return label;
};
