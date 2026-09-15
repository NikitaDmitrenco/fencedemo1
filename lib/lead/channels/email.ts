import type { LeadChannel } from './types';

/**
 * Доставка на почту через Resend.
 *
 * Держится готовым: часть клиентов работает с почтой, а не с мессенджерами.
 * Не активен, пока не заданы RESEND_API_KEY и LEAD_EMAIL_TO.
 */
export const emailChannel: LeadChannel = {
  name: 'email',

  isConfigured() {
    return Boolean(process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_TO);
  },

  async send(text) {
    const key = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_EMAIL_TO;
    const from = process.env.LEAD_EMAIL_FROM ?? 'onboarding@resend.dev';

    if (!key || !to) throw new Error('Email: не заданы RESEND_API_KEY/LEAD_EMAIL_TO');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Заявка с сайта',
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Resend ответил ${response.status}: ${detail.slice(0, 200)}`);
    }
  },
};
