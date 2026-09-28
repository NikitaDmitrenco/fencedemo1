/**
 * Конфигурация приложения.
 *
 * URL API для отправки заявок определяется через env-переменную.
 * На localhost используется прямой URL воркера.
 */

/** URL Cloudflare Worker для отправки заявок */
export const LEAD_API_URL =
  process.env.NEXT_PUBLIC_LEAD_API_URL || 'https://fencedemo-lead.fencedemo.workers.dev/lead';
