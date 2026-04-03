interface SanitizeTextOptions {
  maxLength?: number;
  trim?: boolean;
}

export function sanitizeTextInput(
  value: string,
  { maxLength = 15, trim = false }: SanitizeTextOptions = {},
) {
  const sanitizedValue = value
    .replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '')
    .slice(0, maxLength);

  return trim ? sanitizedValue.trim() : sanitizedValue;
}
