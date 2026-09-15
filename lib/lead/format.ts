import type { Lead } from './schema';
import { FENCE_TYPES, GATES, HEIGHTS, labelOf, messengerLabel } from '@/content/quiz';
import { estimatePrice, formatRub } from '@/content/pricing';
import { displayPhone } from '@/lib/phone';

/**
 * Текст заявки для владельца.
 *
 * Собирается с подписями из content/quiz.ts, а не из сырых значений: заявка
 * должна читаться с телефона на ходу, без расшифровки служебных ключей.
 * Диапазон пересчитывается на сервере — цифру из браузера в заявку не пишем,
 * подменить её в запросе может кто угодно.
 */
export function formatLead(lead: Lead): string {
  const head = lead.kind === 'quiz' ? '🔔 Заявка с расчётом' : '🔔 Заявка с сайта';

  const details =
    lead.kind === 'quiz'
      ? [
          `Решение: ${labelOf(FENCE_TYPES, lead.type)}`,
          `Длина: ${lead.length} м`,
          `Высота: ${labelOf(HEIGHTS, lead.height)}`,
          `Ворота: ${labelOf(GATES, lead.gates)}${
            lead.automation && lead.gates !== 'net' ? ' + автоматика' : ''
          }`,
          '',
          (() => {
            const range = estimatePrice({
              type: lead.type,
              length: lead.length,
              height: lead.height,
              gates: lead.gates,
              automation: lead.automation,
            });
            return `Предварительно: ${formatRub(range.low)} — ${formatRub(range.high)}`;
          })(),
        ]
      : [`Задача: ${lead.task}`, lead.length ? `Примерная длина: ${lead.length} м` : null];

  const lines = [
    head,
    '',
    ...details,
    '',
    lead.name ? `Имя: ${lead.name}` : null,
    `Телефон: ${displayPhone(lead.phone)}`,
    `Связь: ${messengerLabel(lead.messenger)}`,
  ];

  return lines.filter((line) => line !== null).join('\n');
}
