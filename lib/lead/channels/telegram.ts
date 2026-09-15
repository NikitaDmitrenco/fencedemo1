import type { LeadChannel } from './types';

/**
 * Доставка в Telegram владельцу.
 *
 * Выбран каналом по умолчанию: заявка приходит на телефон за секунды, не
 * требует домена и настройки почтовой репутации. Письмо с нового домена без
 * SPF/DKIM уезжает в спам, а заявка «перезвоните» с суточной задержкой —
 * это потерянная заявка.
 */
export const telegramChannel: LeadChannel = {
  name: 'telegram',

  isConfigured() {
    return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  },

  async send(text) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId)
      throw new Error('Telegram: не заданы TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID');

    // Адрес Bot API переопределяется: у Telegram штатно есть self-hosted
    // сервер, и та же переменная позволяет прогнать доставку на локальном
    // моке, не отправляя ничего в настоящий чат.
    const base = process.env.TELEGRAM_API_BASE ?? 'https://api.telegram.org';

    const response = await fetch(`${base}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      // Ответ владельцу не должен зависеть от того, как долго думает Telegram.
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Telegram ответил ${response.status}: ${detail.slice(0, 200)}`);
    }
  },
};
