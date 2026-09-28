/**
 * Справочник стран с телефонными кодами.
 *
 * Используется для маски ввода и валидации международных номеров.
 * Каждая страна определяет: код страны (dial code), длину номера без кода
 * и шаблон маски для отображения.
 */

export interface CountryCode {
  /** ISO 3166-1 alpha-2 */
  iso: string;
  /** Человекочитаемое название */
  name: string;
  /** Телефонный код без '+': '7', '1', '49', ... */
  dialCode: string;
  /** Количество цифр номера БЕЗ кода страны */
  digits: number;
  /** Шаблон маски: 'X' — цифра, пробел — разделитель. Например '(XXX) XXX-XXXX' */
  mask: string;
}

/**
 * Основные страны. Список не исчерпывающий — при необходимости добавляются
 * новые записи. Россия — первая по умолчанию.
 */
export const COUNTRIES: readonly CountryCode[] = [
  { iso: 'RU', name: 'Россия', dialCode: '7', digits: 10, mask: '(XXX) XXX-XX-XX' },
  { iso: 'US', name: 'США', dialCode: '1', digits: 10, mask: '(XXX) XXX-XXXX' },
  { iso: 'UA', name: 'Украина', dialCode: '380', digits: 9, mask: '(XX) XXX-XX-XX' },
  { iso: 'BY', name: 'Беларусь', dialCode: '375', digits: 9, mask: '(XX) XXX-XX-XX' },
  { iso: 'KZ', name: 'Казахстан', dialCode: '7', digits: 10, mask: '(XXX) XXX-XX-XX' },
  { iso: 'DE', name: 'Германия', dialCode: '49', digits: 10, mask: 'XXXX XXXXXXX' },
  { iso: 'GB', name: 'Великобритания', dialCode: '44', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'FR', name: 'Франция', dialCode: '33', digits: 9, mask: 'X XX XX XX XX' },
  { iso: 'IT', name: 'Италия', dialCode: '39', digits: 10, mask: 'XXX XXX XXXX' },
  { iso: 'ES', name: 'Испания', dialCode: '34', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'PL', name: 'Польша', dialCode: '48', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'TR', name: 'Турция', dialCode: '90', digits: 10, mask: 'XXX XXX XX XX' },
  { iso: 'CN', name: 'Китай', dialCode: '86', digits: 11, mask: 'XXX XXXX XXXX' },
  { iso: 'IN', name: 'Индия', dialCode: '91', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'BR', name: 'Бразилия', dialCode: '55', digits: 11, mask: 'XX XXXXX XXXX' },
] as const;

export const DEFAULT_COUNTRY_ISO = 'RU';

/** Найти страну по ISO-коду. Если не найдена — вернуть Россию. */
export function countryByIso(iso: string): CountryCode {
  const found = COUNTRIES.find((c) => c.iso === iso);
  return found ?? (COUNTRIES[0] as CountryCode);
}

/** Найти страну по номеру телефона (по коду страны). */
export function countryByPhone(phone: string): CountryCode | undefined {
  const digits = phone.replace(/\D/g, '');
  // Ищем самое длинное совпадение кода (чтобы 380 не путался с 38 и т.д.)
  let best: CountryCode | undefined;
  for (const c of COUNTRIES) {
    if (digits.startsWith(c.dialCode)) {
      if (!best || c.dialCode.length > best.dialCode.length) {
        best = c;
      }
    }
  }
  return best;
}
