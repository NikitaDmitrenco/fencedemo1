/**
 * Склейка классов. Свои три строки вместо зависимости: нужен только отсев
 * falsy-значений, а лишний пакет в бандле на этом сайте не окупается.
 */
export function clsx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
