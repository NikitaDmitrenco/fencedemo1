import type { LeadChannel } from './types';

/**
 * Доставка в Telegram.
 *
 * Выбран каналом по умолчанию: заявка приходит на телефон за секунды, не
 * требует домена и настройки почтовой репутации. Письмо с нового домена без
 * SPF/DKIM уезжает в спам, а заявка «перезвоните» с суточной задержкой —
 * это потерянная заявка.
 *
 * Получателей может быть несколько: TELEGRAM_CHAT_ID принимает список через
 * запятую. Добавить человека — дописать его id, менять код не нужно.
 * Отрицательный id — это группа, она тоже работает как получатель.
 */

/** Разбирает список получателей: «123» или «123,456,-1001234567890». */
function parseChatIds(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

async function sendTo(base: string, token: string, chatId: string, text: string): Promise<void> {
  const response = await fetch(`${base}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    // Ответ посетителю не должен зависеть от того, как долго думает Telegram.
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`чат ${chatId}: Telegram ответил ${response.status} ${detail.slice(0, 160)}`);
  }
}

export const telegramChannel: LeadChannel = {
  name: 'telegram',

  isConfigured() {
    return (
      Boolean(process.env.TELEGRAM_BOT_TOKEN) &&
      parseChatIds(process.env.TELEGRAM_CHAT_ID).length > 0
    );
  },

  async send(text) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatIds = parseChatIds(process.env.TELEGRAM_CHAT_ID);

    if (!token || chatIds.length === 0) {
      throw new Error('Telegram: не заданы TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID');
    }

    // Адрес Bot API переопределяется: у Telegram штатно есть self-hosted
    // сервер, и та же переменная позволяет прогнать доставку на локальном
    // моке, не отправляя ничего в настоящий чат.
    const base = process.env.TELEGRAM_API_BASE ?? 'https://api.telegram.org';

    const results = await Promise.allSettled(
      chatIds.map((chatId) => sendTo(base, token, chatId, text)),
    );

    const failures = results.filter((r) => r.status === 'rejected');

    // Один получатель мог не нажать Start или заблокировать бота — остальные
    // заявку получили, и терять её из-за него нельзя. В лог пишем каждого,
    // кто не принял: иначе поломка у одного останется незамеченной.
    for (const failure of failures) {
      console.error('[telegram] не доставлено:', (failure as PromiseRejectedResult).reason);
    }

    if (failures.length === chatIds.length) {
      throw new Error(`Telegram: ни один из ${chatIds.length} получателей не принял заявку`);
    }
  },
};
