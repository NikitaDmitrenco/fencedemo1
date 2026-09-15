/**
 * Якоря страницы. Один список на шапку, футер и sticky-панель, чтобы
 * идентификаторы секций не разъезжались при перестановке блоков.
 */
export const NAV_LINKS = [
  { href: '#catalog', label: 'Решения' },
  { href: '#cases', label: 'Работы' },
  { href: '#prices', label: 'Цены' },
  { href: '#faq', label: 'Вопросы' },
] as const;

/** Якорь главного CTA. Ведёт на квиз — единственный доминирующий призыв. */
export const CALC_ANCHOR = '#calc';
