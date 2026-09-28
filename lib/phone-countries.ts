/**
 * Справочник стран с телефонными кодами (Евразия + основные страны мира).
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
 * Страны Евразии + основные страны мира.
 * Россия — первая по умолчанию.
 */
export const COUNTRIES: readonly CountryCode[] = [
  // ─── СНГ ─────────────────────────────────────────────────────────────
  { iso: 'RU', name: 'Россия', dialCode: '7', digits: 10, mask: '(XXX) XXX-XX-XX' },
  { iso: 'UA', name: 'Украина', dialCode: '380', digits: 9, mask: '(XX) XXX-XX-XX' },
  { iso: 'BY', name: 'Беларусь', dialCode: '375', digits: 9, mask: '(XX) XXX-XX-XX' },
  { iso: 'KZ', name: 'Казахстан', dialCode: '7', digits: 10, mask: '(XXX) XXX-XX-XX' },
  { iso: 'UZ', name: 'Узбекистан', dialCode: '998', digits: 9, mask: '(XX) XXX-XX-XX' },
  { iso: 'KG', name: 'Кыргызстан', dialCode: '996', digits: 9, mask: '(XXX) XXX-XXX' },
  { iso: 'TJ', name: 'Таджикистан', dialCode: '992', digits: 9, mask: '(XX) XXX-XX-XX' },
  { iso: 'TM', name: 'Туркменистан', dialCode: '993', digits: 8, mask: 'XX-XX-XX-XX' },
  { iso: 'MD', name: 'Молдова', dialCode: '373', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'AM', name: 'Армения', dialCode: '374', digits: 8, mask: 'XX XXX-XXX' },
  { iso: 'AZ', name: 'Азербайджан', dialCode: '994', digits: 9, mask: '(XX) XXX-XX-XX' },
  { iso: 'GE', name: 'Грузия', dialCode: '995', digits: 9, mask: '(XX) XXX-XX-XX' },

  // ─── Европа ──────────────────────────────────────────────────────────
  { iso: 'GB', name: 'Великобритания', dialCode: '44', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'DE', name: 'Германия', dialCode: '49', digits: 10, mask: 'XXXX XXXXXXX' },
  { iso: 'FR', name: 'Франция', dialCode: '33', digits: 9, mask: 'X XX XX XX XX' },
  { iso: 'IT', name: 'Италия', dialCode: '39', digits: 10, mask: 'XXX XXX XXXX' },
  { iso: 'ES', name: 'Испания', dialCode: '34', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'PT', name: 'Португалия', dialCode: '351', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'NL', name: 'Нидерланды', dialCode: '31', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'BE', name: 'Бельгия', dialCode: '32', digits: 9, mask: 'XXX XX XX XX' },
  { iso: 'AT', name: 'Австрия', dialCode: '43', digits: 10, mask: 'XXX XXX XXXX' },
  { iso: 'CH', name: 'Швейцария', dialCode: '41', digits: 9, mask: 'XX XXX XX XX' },
  { iso: 'PL', name: 'Польша', dialCode: '48', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'CZ', name: 'Чехия', dialCode: '420', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'SK', name: 'Словакия', dialCode: '421', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'HU', name: 'Венгрия', dialCode: '36', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'RO', name: 'Румыния', dialCode: '40', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'BG', name: 'Болгария', dialCode: '359', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'GR', name: 'Греция', dialCode: '30', digits: 10, mask: 'XXXXXXXXXX' },
  { iso: 'HR', name: 'Хорватия', dialCode: '385', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'SI', name: 'Словения', dialCode: '386', digits: 8, mask: 'XX XXX XXX' },
  { iso: 'RS', name: 'Сербия', dialCode: '381', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'BA', name: 'Босния и Герцеговина', dialCode: '387', digits: 8, mask: 'XX XXX XXX' },
  { iso: 'ME', name: 'Черногория', dialCode: '382', digits: 8, mask: 'XX XXX XXX' },
  { iso: 'MK', name: 'Северная Македония', dialCode: '389', digits: 8, mask: 'XX XXX XXX' },
  { iso: 'AL', name: 'Албания', dialCode: '355', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'XK', name: 'Косово', dialCode: '383', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'LT', name: 'Литва', dialCode: '370', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'LV', name: 'Латвия', dialCode: '371', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'EE', name: 'Эстония', dialCode: '372', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'FI', name: 'Финляндия', dialCode: '358', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'SE', name: 'Швеция', dialCode: '46', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'NO', name: 'Норвегия', dialCode: '47', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'DK', name: 'Дания', dialCode: '45', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'IS', name: 'Исландия', dialCode: '354', digits: 7, mask: 'XXX XXXX' },
  { iso: 'IE', name: 'Ирландия', dialCode: '353', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'LU', name: 'Люксембург', dialCode: '352', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'MC', name: 'Монако', dialCode: '377', digits: 8, mask: 'XX XX XX XX' },
  { iso: 'AD', name: 'Андорра', dialCode: '376', digits: 6, mask: 'XX XX XX' },
  { iso: 'LI', name: 'Лихтенштейн', dialCode: '423', digits: 7, mask: 'XXX XXXX' },
  { iso: 'SM', name: 'Сан-Марино', dialCode: '378', digits: 10, mask: 'XXXXXXXXXX' },
  { iso: 'VA', name: 'Ватикан', dialCode: '379', digits: 10, mask: 'XXXXXXXXXX' },
  { iso: 'CY', name: 'Кипр', dialCode: '357', digits: 8, mask: 'XXXXXXXX' },
  { iso: 'MT', name: 'Мальта', dialCode: '356', digits: 8, mask: 'XXXX XXXX' },

  // ─── Турция, Кипр, Грузия, Армения, Азербайджан (в Европе и Азии) ────
  { iso: 'TR', name: 'Турция', dialCode: '90', digits: 10, mask: 'XXX XXX XX XX' },

  // ─── Ближний Восток ─────────────────────────────────────────────────
  { iso: 'IL', name: 'Израиль', dialCode: '972', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'LB', name: 'Ливан', dialCode: '961', digits: 8, mask: 'XX XXX XXX' },
  { iso: 'SY', name: 'Сирия', dialCode: '963', digits: 9, mask: 'XXXX XXXXX' },
  { iso: 'IQ', name: 'Ирак', dialCode: '964', digits: 10, mask: 'XXX XXX XXXX' },
  { iso: 'IR', name: 'Иран', dialCode: '98', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'SA', name: 'Саудовская Аравия', dialCode: '966', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'AE', name: 'ОАЭ', dialCode: '971', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'QA', name: 'Катар', dialCode: '974', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'KW', name: 'Кувейт', dialCode: '965', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'BH', name: 'Бахрейн', dialCode: '973', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'OM', name: 'Оман', dialCode: '968', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'JO', name: 'Иордания', dialCode: '962', digits: 9, mask: 'X XXXX XXXX' },
  { iso: 'PS', name: 'Палестина', dialCode: '970', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'YE', name: 'Йемен', dialCode: '967', digits: 9, mask: 'XXX XXX XXX' },

  // ─── Азия ────────────────────────────────────────────────────────────
  { iso: 'CN', name: 'Китай', dialCode: '86', digits: 11, mask: 'XXX XXXX XXXX' },
  { iso: 'JP', name: 'Япония', dialCode: '81', digits: 10, mask: 'XX XXXX XXXX' },
  { iso: 'KR', name: 'Южная Корея', dialCode: '82', digits: 10, mask: 'XX XXXX XXXX' },
  { iso: 'IN', name: 'Индия', dialCode: '91', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'PK', name: 'Пакистан', dialCode: '92', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'BD', name: 'Бангладеш', dialCode: '880', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'LK', name: 'Шри-Ланка', dialCode: '94', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'NP', name: 'Непал', dialCode: '977', digits: 10, mask: 'XXXXXXXXXX' },
  { iso: 'MM', name: 'Мьянма', dialCode: '95', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'TH', name: 'Таиланд', dialCode: '66', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'VN', name: 'Вьетнам', dialCode: '84', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'ID', name: 'Индонезия', dialCode: '62', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'MY', name: 'Малайзия', dialCode: '60', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'PH', name: 'Филиппины', dialCode: '63', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'SG', name: 'Сингапур', dialCode: '65', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'TW', name: 'Тайвань', dialCode: '886', digits: 9, mask: 'XXXX XXXXX' },
  { iso: 'HK', name: 'Гонконг', dialCode: '852', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'MO', name: 'Макао', dialCode: '853', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'KH', name: 'Камбоджа', dialCode: '855', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'LA', name: 'Лаос', dialCode: '856', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'BN', name: 'Бруней', dialCode: '673', digits: 7, mask: 'XXX XXXX' },
  { iso: 'MN', name: 'Монголия', dialCode: '976', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'BT', name: 'Бутан', dialCode: '975', digits: 8, mask: 'XXXX XXXX' },

  // ─── Африка (основные) ──────────────────────────────────────────────
  { iso: 'EG', name: 'Египет', dialCode: '20', digits: 10, mask: 'XXXXXXXXXX' },
  { iso: 'ZA', name: 'ЮАР', dialCode: '27', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'NG', name: 'Нигерия', dialCode: '234', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'KE', name: 'Кения', dialCode: '254', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'ET', name: 'Эфиопия', dialCode: '251', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'GH', name: 'Гана', dialCode: '233', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'TZ', name: 'Танзания', dialCode: '255', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'UG', name: 'Уганда', dialCode: '256', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'DZ', name: 'Алжир', dialCode: '213', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'MA', name: 'Марокко', dialCode: '212', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'TN', name: 'Тунис', dialCode: '216', digits: 8, mask: 'XX XXX XXX' },
  { iso: 'LY', name: 'Ливия', dialCode: '218', digits: 9, mask: 'XX XXX XXXX' },

  // ─── Америка ─────────────────────────────────────────────────────────
  { iso: 'US', name: 'США', dialCode: '1', digits: 10, mask: '(XXX) XXX-XXXX' },
  { iso: 'CA', name: 'Канада', dialCode: '1', digits: 10, mask: '(XXX) XXX-XXXX' },
  { iso: 'MX', name: 'Мексика', dialCode: '52', digits: 10, mask: 'XX XXXX XXXX' },
  { iso: 'BR', name: 'Бразилия', dialCode: '55', digits: 11, mask: 'XX XXXXX XXXX' },
  { iso: 'AR', name: 'Аргентина', dialCode: '54', digits: 10, mask: 'XX XXXX XXXX' },
  { iso: 'CL', name: 'Чили', dialCode: '56', digits: 9, mask: 'X XXXX XXXX' },
  { iso: 'CO', name: 'Колумбия', dialCode: '57', digits: 10, mask: 'XXX XXX XXXX' },
  { iso: 'PE', name: 'Перу', dialCode: '51', digits: 9, mask: 'XXX XXX XXX' },
  { iso: 'VE', name: 'Венесуэла', dialCode: '58', digits: 10, mask: 'XXXX XXXXXX' },
  { iso: 'EC', name: 'Эквадор', dialCode: '593', digits: 9, mask: 'XX XXX XXXX' },
  { iso: 'CL', name: 'Коста-Рика', dialCode: '506', digits: 8, mask: 'XXXX XXXX' },
  { iso: 'PA', name: 'Панама', dialCode: '507', digits: 8, mask: 'XXXX XXXX' },

  // ─── Океания ─────────────────────────────────────────────────────────
  { iso: 'AU', name: 'Австралия', dialCode: '61', digits: 9, mask: 'XXXX XXXXXX' },
  { iso: 'NZ', name: 'Новая Зеландия', dialCode: '64', digits: 9, mask: 'XX XXX XXXX' },
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
