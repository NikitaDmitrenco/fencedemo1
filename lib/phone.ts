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
 * Возвращает строку вида "37368088948" или null, если номер неполный.
 * Принимает локальный номер (без кода страны) и добавляет код автоматически.
 */
export function normalizePhone(input: string, countryIso?: string): string | null {
  const country = countryIso ? countryByIso(countryIso) : countryByIso(DEFAULT_COUNTRY_ISO);
  const digits = input.replace(/\D/g, '');

  // Проверяем, что введено достаточно цифр для локального номера
  if (digits.length < country.digits) return null;

  // Берём только локальную часть (последние digits цифр)
  const localNumber = digits.slice(-country.digits);

  // Формируем полный номер с кодом страны
  return `${country.dialCode}${localNumber}`;
}

/**
 * Форматирует ввод по маске страны по мере набора.
 *
 * Возвращает ТОЛЬКО маску номера БЕЗ кода страны (код уже в кнопке).
 * Пользователь вводит только локальный номер.
 *
 * Примеры:
 * - Россия:  (999) 123-45-67
 * - Молдова: XXXX XXXX
 */
export function maskPhone(input: string, countryIso?: string): string {
  const country = countryIso ? countryByIso(countryIso) : countryByIso(DEFAULT_COUNTRY_ISO);
  // Берём только цифры из ввода (это локальный номер, без кода страны)
  const digits = input.replace(/\D/g, '').slice(0, country.digits);

  if (digits.length === 0) return '';

  // Применяем маску к локальному номеру
  return applyMask(digits, country.mask);
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
 *
 * Проверяет только локальную часть номера (без кода страны),
 * так как код уже отображается в кнопке выбора страны.
 */
export function isPhoneComplete(input: string, countryIso?: string): boolean {
  const country = countryIso ? countryByIso(countryIso) : countryByIso(DEFAULT_COUNTRY_ISO);
  const digits = input.replace(/\D/g, '');
  // Проверяем количество цифр в локальной части (без кода страны)
  return digits.length >= country.digits;
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
