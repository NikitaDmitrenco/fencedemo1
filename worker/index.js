/**
 * Cloudflare Worker для отправки заявок в Telegram.
 *
 * Принимает POST-запросы с данными формы и пересылает их
 * в Telegram через Bot API. Токен хранится в Secrets воркера.
 *
 * Деплой: wrangler deploy
 * Secrets: wrangler secret put TELEGRAM_BOT_TOKEN
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

/**
 * Форматирует данные заявки в читаемое сообщение для Telegram.
 */
function formatMessage(data) {
  const lines = [
    '🔔 Заявка с сайта',
    '',
  ];

  if (data.kind === 'quiz') {
    lines.push('Тип: Квиз (расчёт)');
    if (data.type) lines.push(`Решение: ${data.type}`);
    if (data.length) lines.push(`Длина: ${data.length} м`);
    if (data.height) lines.push(`Высота: ${data.height} м`);
    if (data.gates) lines.push(`Ворота: ${data.gates}`);
    if (data.automation) lines.push('Автоматика: да');
  } else {
    lines.push('Тип: Короткая заявка');
    if (data.task) lines.push(`Задача: ${data.task}`);
    if (data.length) lines.push(`Длина: ${data.length} м`);
  }

  lines.push('');
  if (data.name) lines.push(`Имя: ${data.name}`);
  lines.push(`Телефон: ${data.phone}`);
  lines.push(`Связь: ${data.messenger || 'не указан'}`);

  return lines.join('\n');
}

/**
 * Отправляет сообщение в Telegram.
 */
async function sendToTelegram(env, text) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatIds = (env.TELEGRAM_CHAT_ID || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) {
    throw new Error('Telegram not configured');
  }

  const base = env.TELEGRAM_API_BASE || 'https://api.telegram.org';
  const results = await Promise.allSettled(
    chatIds.map((chatId) =>
      fetch(`${base}/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Telegram responded ${res.status}`);
        }
        return res;
      })
    )
  );

  const failures = results.filter((r) => r.status === 'rejected');
  if (failures.length === chatIds.length) {
    throw new Error('All Telegram recipients failed');
  }

  return { ok: true };
}

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Только POST
    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
    }

    // Проверка пути
    const url = new URL(request.url);
    if (url.pathname !== '/lead') {
      return jsonResponse({ ok: false, error: 'Not found' }, 404);
    }

    try {
      const data = await request.json();

      // Базовая валидация
      if (!data.phone) {
        return jsonResponse({ ok: false, error: 'Phone required' }, 400);
      }

      // Ловушка для ботов
      if (data.company) {
        return jsonResponse({ ok: true });
      }

      // Формируем и отправляем
      const text = formatMessage(data);
      await sendToTelegram(env, text);

      return jsonResponse({ ok: true });
    } catch (e) {
      console.error('Lead processing error:', e);
      return jsonResponse(
        { ok: false, error: 'Failed to process lead' },
        500
      );
    }
  },
};
