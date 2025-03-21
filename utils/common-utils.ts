
export const truncateText = (text: string, maxLength: number = 100, appendEllipsis: boolean = true): string => {
  if (!text) return "";
  if (text?.length <= maxLength) return text;

  let truncated = text.substring(0, maxLength);
  let lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > 0) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return truncated + (appendEllipsis ? " ..." : "");
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
