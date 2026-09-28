# Cloudflare Worker для отправки заявок

Этот воркер принимает заявки с сайта и пересылает их в Telegram.

## Быстрый старт

### 1. Установить Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Авторизоваться в Cloudflare

```bash
wrangler login
```

### 3. Настроить Secrets

```bash
# Токен бота (от @BotFather)
wrangler secret put TELEGRAM_BOT_TOKEN
# Ввести: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

# ID чата (узнать через @userinfobot)
wrangler secret put TELEGRAM_CHAT_ID
# Ввести: 123456789
```

### 4. Задеплоить

```bash
cd worker
wrangler deploy
```

После деплоя воркер будет доступен по адресу:
```
https://fencedemo-lead.<ваш_айди>.workers.dev/lead
```

### 5. Настроить URL в проекте

В файле `lib/config.ts` укажите URL вашего воркера:

```typescript
export const LEAD_API_URL = 'https://fencedemo-lead.<ваш_айди>.workers.dev/lead';
```

Или через env-переменную:

```bash
# В .env.local или GitHub Secrets
NEXT_PUBLIC_LEAD_API_URL=https://fencedemo-lead.<ваш_айди>.workers.dev/lead
```

## Тестирование

```bash
curl -X POST https://fencedemo-lead.<ваш_айди>.workers.dev/lead \
  -H "Content-Type: application/json" \
  -d '{"phone":"79001234567","task":"Тестовый запрос","messenger":"call","consent":true}'
```

Ответ: `{"ok": true}`

## Получение Chat ID

1. Напишите боту `/start`
2. Перейдите по ссылке: `https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates`
3. Найдите `"chat":{"id":123456789}` — это ваш Chat ID

## Troubleshooting

**Воркер не отвечает:**
- Проверьте статус: `wrangler tail`

**Telegram не получает сообщения:**
- Проверьте токен: `curl "https://api.telegram.org/bot<ТОКЕН>/getMe"`
- Убедитесь, что получатель нажал Start у бота

**CORS ошибка:**
- Воркер уже настроен на CORS (`Access-Control-Allow-Origin: *`)
- Если проблема сохраняется, проверьте Headers в Cloudflare Dashboard
