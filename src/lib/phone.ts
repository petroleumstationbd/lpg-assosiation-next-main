export function normalizePhone(value: string) {
  return value.replace(/\D/g, '');
}

export function formatPhoneInput(value: string) {
  const digits = normalizePhone(value).slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isValidBangladeshPhone(value: string) {
  return normalizePhone(value).length === 11;
}
