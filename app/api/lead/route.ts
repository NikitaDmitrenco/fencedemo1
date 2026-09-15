import { NextResponse } from 'next/server';
import { leadSchema } from '@/lib/lead/schema';
import { formatLead } from '@/lib/lead/format';
import { activeChannels } from '@/lib/lead/channels';
import { isRateLimited } from '@/lib/lead/rate-limit';

/** Ниже этого времени форму заполнил не человек. */
const MIN_FILL_MS = 2500;

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Некорректный запрос' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Проверьте заполнение формы' },
      { status: 422 },
    );
  }

  const lead = parsed.data;

  // Боты отсеиваются молча: осмысленная ошибка подсказала бы, как её обойти,
  // а человеку это сообщение всё равно никогда не покажется.
  if (lead.company) return NextResponse.json({ ok: true });
  if (lead.elapsedMs !== undefined && lead.elapsedMs < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: 'Слишком много заявок подряд. Позвоните нам — ответим сразу.' },
      { status: 429 },
    );
  }

  const channels = activeChannels();

  if (channels.length === 0) {
    // Заявку терять нельзя даже при неверной конфигурации: она хотя бы
    // останется в логе Vercel, откуда её можно достать вручную.
    console.error('[lead] не настроен ни один канал доставки\n', formatLead(lead));
    return NextResponse.json(
      { ok: false, error: 'Форма временно недоступна. Позвоните нам, пожалуйста.' },
      { status: 503 },
    );
  }

  const text = formatLead(lead);
  const results = await Promise.allSettled(channels.map((channel) => channel.send(text)));
  const delivered = results.some((result) => result.status === 'fulfilled');

  for (const [i, result] of results.entries()) {
    if (result.status === 'rejected') {
      console.error(`[lead] канал ${channels[i]?.name} не принял заявку:`, result.reason);
    }
  }

  if (!delivered) {
    console.error('[lead] ни один канал не принял заявку\n', text);
    return NextResponse.json(
      { ok: false, error: 'Не удалось отправить заявку. Позвоните нам, пожалуйста.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
