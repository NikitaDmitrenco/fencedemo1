# План: Telegram через Cloudflare Worker на GitHub Pages

## Текущее состояние

- **Международные телефоны** — ВЫПОЛНЕНО (T1): справочник стран, PhoneInput, обновлены формы
- **Telegram бот** — НЕ РАБОТАЕТ (T2): `output: 'export'` не генерирует API-маршруты на GitHub Pages
- **Vercel-миграция** — ОТМЕНЕНА: пользователь хочет оставаться на GitHub Pages

---

## Шаг 1: Откатить Vercel-изменения

Удалить файлы, созданные для Vercel:
- `vercel.json`
- `.github/workflows/deploy-vercel.yml`
- `docs/VERCEL_SETUP.md`

Откатить `next.config.ts` к исходному виду:
```bash
git restore next.config.ts
```

---

## Шаг 2: Создать Cloudflare Worker для Telegram

### 2.1 Структура воркера

Создать папку `worker/` в корне проекта:

```
worker/
├── index.js       # Основной код воркера
├── wrangler.toml  # Конфигурация Cloudflare
└── README.md      # Инструкция по деплою
```

### 2.2 Код воркера (`worker/index.js`)

Worker будет:
1. Принимать POST-запросы с заявками
2. Валидировать данные (базовая проверка)
3. Отправлять в Telegram через Bot API
4. Возвращать CORS-заголовки для кросс-доменных запросов

```javascript
export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    // Только POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const data = await request.json();

      // Базовая валидация
      if (!data.phone || !data.task) {
        return jsonResponse({ ok: false, error: 'Missing required fields' }, 400);
      }

      // Формируем сообщение для Telegram
      const text = formatTelegramMessage(data);

      // Отправляем в Telegram
      const result = await sendToTelegram(env, text);

      if (!result.ok) {
        return jsonResponse({ ok: false, error: 'Telegram delivery failed' }, 502);
      }

      return jsonResponse({ ok: true });
    } catch (e) {
      return jsonResponse({ ok: false, error: 'Internal error' }, 500);
    }
  }
};
```

### 2.3 Конфигурация (`worker/wrangler.toml`)

```toml
name = "fencedemo-lead"
main = "index.js"
compatibility_date = "2024-01-01"

[vars]
TELEGRAM_API_BASE = "https://api.telegram.org"
```

**Важно:** `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` хранятся в Secrets воркера (не в коде):
```bash
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
```

---

## Шаг 3: Обновить формы для отправки на Cloudflare Worker

### 3.1 Добавить URL воркера в конфиг

Создать `lib/config.ts`:
```typescript
// URL Cloudflare Worker для отправки заявок
export const LEAD_API_URL = process.env.NEXT_PUBLIC_LEAD_API_URL
  || 'https://fencedemo-lead.<ваш_айди>.workers.dev/lead';
```

### 3.2 Обновить `components/sections/ShortForm.tsx`

Заменить `fetch('/api/lead', ...)` на `fetch(LEAD_API_URL, ...)`:
```typescript
const response = await fetch(LEAD_API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... }),
});
```

### 3.3 Обновить `components/quiz/Quiz.tsx`

Аналогично — заменить URL отправки.

---

## Шаг 4: Обновить GitHub Actions workflow

Добавить env-переменную в `deploy-pages.yml`:
```yaml
- name: Build Next.js
  run: npm run build
  env:
    GITHUB_PAGES: true
    NEXT_PUBLIC_LEAD_API_URL: ${{ secrets.LEAD_API_URL }}
```

---

## Шаг 5: Деплой Cloudflare Worker

### 5.1 Установить Wrangler CLI
```bash
npm install -g wrangler
```

### 5.2 Авторизация
```bash
wrangler login
```

### 5.3 Деплой
```bash
cd worker
wrangler deploy
```

### 5.4 Настройка Secrets
```bash
wrangler secret put TELEGRAM_BOT_TOKEN
# Ввести токен бота

wrangler secret put TELEGRAM_CHAT_ID
# Ввести ID чата
```

### 5.5 Проверка
```bash
curl -X POST https://fencedemo-lead.<ваш_айди>.workers.dev/lead \
  -H "Content-Type: application/json" \
  -d '{"phone":"79001234567","task":"Тест","messenger":"call","consent":true}'
```

---

## Файлы для изменения

| Файл | Действие |
|---|---|
| `vercel.json` | **Удалить** |
| `.github/workflows/deploy-vercel.yml` | **Удалить** |
| `docs/VERCEL_SETUP.md` | **Удалить** |
| `next.config.ts` | **Откатить** (`git restore`) |
| `worker/index.js` | **Создать** — код воркера |
| `worker/wrangler.toml` | **Создать** — конфигурация |
| `worker/README.md` | **Создать** — инструкция |
| `lib/config.ts` | **Создать** — URL API |
| `components/sections/ShortForm.tsx` | **Обновить** — URL отправки |
| `components/quiz/Quiz.tsx` | **Обновить** — URL отправки |
| `.github/workflows/deploy-pages.yml` | **Обновить** — env переменная |

---

## Верификация

1. **Локально:** `npm run dev` → заполнить форму → заявка уходит на Cloudflare Worker → приходит в Telegram
2. **На проде:** задеплоить на GitHub Pages → заполнить форму → проверить Telegram
3. **Безопасность:** токен бота НЕ виден в JS-бандле (хранится в Cloudflare Secrets)

---

## Альтернативы (если Cloudflare не подходит)

- **Google Apps Script** — бесплатный, без сервера, токен у Google
- **Vercel** — уже готово (откатить откат и использовать)
