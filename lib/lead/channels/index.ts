import type { LeadChannel } from './types';
import { telegramChannel } from './telegram';
import { emailChannel } from './email';

export type { LeadChannel };

const ALL: LeadChannel[] = [telegramChannel, emailChannel];

/**
 * Каналы, в которые уйдёт заявка.
 *
 * LEAD_CHANNELS задаёт список через запятую («telegram,email»). Без неё
 * берутся все настроенные: заводить переменную только ради значения по
 * умолчанию — лишний шаг при подключении нового клиента.
 */
export function activeChannels(): LeadChannel[] {
  const requested = process.env.LEAD_CHANNELS?.split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  const pool = requested?.length ? ALL.filter((channel) => requested.includes(channel.name)) : ALL;

  return pool.filter((channel) => channel.isConfigured());
}
