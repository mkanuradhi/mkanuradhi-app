
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

export const getTextColor = (text: string, theme: 'light' | 'dark' = 'light'): string => {
  const hash = text.split('').reduce((acc, char) => 
    char.charCodeAt(0) + ((acc << 5) - acc), 0
  );
  
  const hue = Math.abs(hash) % 360;
  const saturation = 65 + (Math.abs(hash) % 10);
  const lightness = theme === 'dark' 
    ? 35 + (Math.abs(hash) % 10)  // Dark mode: 35-45%
    : 50 + (Math.abs(hash) % 10); // Light mode: 50-60%
  
  return hslToHex(hue, saturation, lightness);
}

export const getGradientColor = (
  text: string,
  variant: 'light' | 'dark' | 'analogous' = 'light',
  theme: 'light' | 'dark' = 'light'
): string => {
  const hash = text.split('').reduce((acc, char) => 
    char.charCodeAt(0) + ((acc << 5) - acc), 0
  );
  
  let hue = Math.abs(hash) % 360;
  let saturation = 65 + (Math.abs(hash) % 10);
  let lightness = theme === 'dark'
    ? 35 + (Math.abs(hash) % 10)
    : 50 + (Math.abs(hash) % 10);
  
  // Adjust based on variant
  switch (variant) {
    case 'light':
      lightness = Math.min(lightness + 15, theme === 'dark' ? 60 : 85);
      break;
    case 'dark':
      lightness = Math.max(lightness - 15, theme === 'dark' ? 20 : 25);
      break;
    case 'analogous':
      hue = (hue + 30) % 360;
      break;
  }
  
  return hslToHex(hue, saturation, lightness);
}

export const getGradientColors = (
  text: string,
  variant: 'light' | 'dark' | 'analogous' = 'light',
  theme: 'light' | 'dark' = 'light'
): [string, string] => {
  return [getTextColor(text, theme), getGradientColor(text, variant, theme)];
};

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
  const [r, g, b] = [f(0), f(8), f(4)];
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const getContrastTextColor = (backgroundColor: string): string => {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance (WCAG formula)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};
