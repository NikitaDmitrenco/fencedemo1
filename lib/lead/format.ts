import type { Lead } from './schema';
import { FENCE_TYPES, GATES, HEIGHTS, labelOf, messengerLabel } from '@/content/quiz';
import { estimatePrice, formatRub } from '@/content/pricing';
import { displayPhone } from '@/lib/phone';

/**
 * Текст заявки для владельца.
 *
 * Собирается с подписями из content/quiz.ts, а не из сырых значений: заявка
 * должна читаться с телефона на ходу, без расшифровки служебных ключей.
 * Диапазон пересчитывается на сервере — цифру из браузера в заявку не пишем.
 */
export function formatLead(lead: Lead, meta: { source?: string } = {}): string {
  const range = estimatePrice({
    type: lead.type,
    length: lead.length,
    height: lead.height,
    gates: lead.gates,
    automation: lead.automation,
  });

  const lines = [
    '🔔 Заявка с сайта',
    '',
    `Решение: ${labelOf(FENCE_TYPES, lead.type)}`,
    `Длина: ${lead.length} м`,
    `Высота: ${labelOf(HEIGHTS, lead.height)}`,
    `Ворота: ${labelOf(GATES, lead.gates)}${lead.automation && lead.gates !== 'net' ? ' + автоматика' : ''}`,
    '',
    `Предварительно: ${formatRub(range.low)} — ${formatRub(range.high)}`,
    '',
    lead.name ? `Имя: ${lead.name}` : null,
    `Телефон: ${displayPhone(lead.phone)}`,
    `Связь: ${messengerLabel(lead.messenger)}`,
    meta.source ? `Источник: ${meta.source}` : null,
  ];

  return lines.filter((line) => line !== null).join('\n');
}
