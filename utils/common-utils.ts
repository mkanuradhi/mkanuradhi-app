
export const truncateText = (text: string, maxLength: number = 100, appendEllipsis: boolean = true): string => {
  if (text.length <= maxLength) return text;

  let truncated = text.substring(0, maxLength);
  let lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > 0) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return truncated + (appendEllipsis ? " ..." : "");
};