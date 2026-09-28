/**
 * Работа с номерами телефона (международная поддержка).
 *
 * Маска вводится по мере набора: поле, в которое можно вписать что угодно,
 * даёт заявки вида «звоните вечером» вместо номера.
 *
 * Поддерживает выбор страны — код страны и длина номера определяются
 * из справочника phone-countries.ts.
 */

import { type CountryCode, countryByIso, DEFAULT_COUNTRY_ISO } from './phone-countries';

/**
 * Нормализует телефонный ввод к формату <кодСтраны><номер>.
 *
 * Возвращает строку вида "79001234567" или null, если номер неполный.
 * Для российских номеров по-прежнему поддерживает ввод с ведущей 8.
 */
export function normalizePhone(input: string, countryIso?: string): string | null {
  const country = countryIso ? countryByIso(countryIso) : countryByIso(DEFAULT_COUNTRY_ISO);
  let digits = input.replace(/\D/g, '');

  // Специальная обработка для России/Казахстана: 8 (900)… = +7 (900)…
  if (country.dialCode === '7') {
    if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
    if (digits.length === country.digits) digits = `7${digits}`;
  }

  const fullLength = country.dialCode.length + country.digits;
  return digits.length === fullLength && digits.startsWith(country.dialCode)
    ? digits
    : null;
}

/**
 * Форматирует ввод по маске страны по мере набора.
 *
 * Возвращает ТОЛЬКО маску номера БЕЗ кода страны (код уже в кнопке).
 * Примеры:
 * - Россия:  (999) 123-45-67
 * - США:     (202) 555-0147
 * - Украина: (67) 123-45-67
 */
export function maskPhone(input: string, countryIso?: string): string {
  const country = countryIso ? countryByIso(countryIso) : countryByIso(DEFAULT_COUNTRY_ISO);
  let digits = input.replace(/\D/g, '');

  // Специальная обработка для России/Казахстана
  if (country.dialCode === '7') {
    if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
    if (!digits.startsWith('7')) digits = `7${digits}`;
  }

  digits = digits.slice(0, country.dialCode.length + country.digits);

  // Отделяем код страны от номера
  const localNumber = digits.slice(country.dialCode.length);

  if (localNumber.length === 0) return '';

  // Применяем маску к локальному номеру (без кода страны)
  return applyMask(localNumber, country.mask);
}

/** Применяет шаблон маски к цифрам. X — цифра, всё остальное — разделитель. */
function applyMask(digits: string, mask: string): string {
  let result = '';
  let digitIndex = 0;

  for (const char of mask) {
    if (digitIndex >= digits.length) break;

    if (char === 'X') {
      result += digits[digitIndex];
      digitIndex++;
    } else {
      result += char;
    }
  }

  return result;
}

/**
 * Человекочитаемый вид для уже нормализованного номера.
 *
 * Принимает полный номер с кодом страны (например "79001234567")
 * и форматирует его по маске страны.
 */
export function displayPhone(normalized: string, countryIso?: string): string {
  const country = countryIso ? countryByIso(countryIso) : countryByIso(DEFAULT_COUNTRY_ISO);
  const digits = normalized.replace(/\D/g, '');

  const fullLength = country.dialCode.length + country.digits;
  if (digits.length !== fullLength) return normalized;

  const localNumber = digits.slice(country.dialCode.length);
  const masked = applyMask(localNumber, country.mask);
  return `+${country.dialCode} ${masked}`;
}

/**
 * Проверяет, заполнен ли номер полностью для данной страны.
 */
export function isPhoneComplete(input: string, countryIso?: string): boolean {
  const country = countryIso ? countryByIso(countryIso) : countryByIso(DEFAULT_COUNTRY_ISO);
  const digits = input.replace(/\D/g, '');
  return digits.length === country.dialCode.length + country.digits;
}

/**
 * Возвращает плейсхолдер для маски ввода.
 *
 * Пример: "+7 (___) ___-__-__" для России, "+1 (___) ___-____" для США.
 */
export function phonePlaceholder(countryIso?: string): string {
  const country = countryIso ? countryByIso(countryIso) : countryByIso(DEFAULT_COUNTRY_ISO);
  const placeholder = country.mask.replace(/X/g, '_');
  return `+${country.dialCode} ${placeholder}`;
}
