interface SanitizeTextOptions {
  maxLength?: number;
}

export function sanitizeTextInput(
  value: string,
  { maxLength = 15 }: SanitizeTextOptions = {},
) {
  return value
    .replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '')
    .slice(0, maxLength)
    .trim();
}
