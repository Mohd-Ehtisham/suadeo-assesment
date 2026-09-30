const MARKUP = /[<>]/;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const PERSON_NAME = /^[\p{L}][\p{L}\s.'-]{0,49}$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function containsMarkup(value: string): boolean {
  return MARKUP.test(value);
}

export function sanitizeText(value: string): string {
  return value.replace(CONTROL_CHARS, "").trim();
}

export function isValidPersonName(value: string): boolean {
  return PERSON_NAME.test(value);
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL.test(value);
}

export function isValidLabel(value: string): boolean {
  return value.length >= 2 && value.length <= 60 && !containsMarkup(value);
}
