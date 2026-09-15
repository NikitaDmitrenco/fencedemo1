/**
 * Работа с российским номером телефона.
 *
 * Маска вводится по мере набора: поле, в которое можно вписать что угодно,
 * даёт заявки вида «звоните вечером» вместо номера.
 */

/** Оставляет 11 цифр в формате 7XXXXXXXXXX. Возвращает null, если номер неполный. */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');

  // 8 (900)… и +7 (900)… — одно и то же, приводим к 7.
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (digits.length === 10) digits = `7${digits}`;

  return /^7\d{10}$/.test(digits) ? digits : null;
}

/** Форматирует ввод по маске +7 (999) 123-45-67, не мешая стирать символы. */
export function maskPhone(input: string): string {
  let digits = input.replace(/\D/g, '');

  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith('7')) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const rest = digits.slice(1);
  if (rest.length === 0) return '+7 ';

  let out = '+7 (' + rest.slice(0, 3);
  if (rest.length >= 3) out += ') ' + rest.slice(3, 6);
  if (rest.length >= 6) out += '-' + rest.slice(6, 8);
  if (rest.length >= 8) out += '-' + rest.slice(8, 10);
  return out;
}

/** Человекочитаемый вид для уже нормализованного номера. */
export function displayPhone(normalized: string): string {
  const d = normalized;
  if (!/^7\d{10}$/.test(d)) return normalized;
  return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
}
