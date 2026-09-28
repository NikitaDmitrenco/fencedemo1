# Данные деплоя

## Cloudflare Worker

- **URL:** https://fencedemo-lead.fencedemo.workers.dev/lead
- **Имя воркера:** fencedemo-lead
- **Workers.dev поддомен:** fencedemo

### Secrets (хранятся в Cloudflare, не в коде)
- `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather
- `TELEGRAM_CHAT_ID` — ID чата (узнать через @userinfobot)

### Управление воркером

```bash
# Деплой
cd worker && wrangler deploy

# Логи (реалтайм)
wrangler tail

# Список secrets
wrangler secret list

# Обновить secret
wrangler secret put TELEGRAM_BOT_TOKEN
```

---

## GitHub Pages

- **URL:** https://nikitadmitrenko.github.io/fencedemo1/
- **Ветка деплоя:** deploy
- **Workflow:** `.github/workflows/deploy-pages.yml`

### Env переменные (GitHub Secrets)

| Переменная | Описание |
|---|---|
| `NEXT_PUBLIC_LEAD_API_URL` | URL Cloudflare Worker |

---

## Telegram Bot

- **Создание бота:** @BotFather → `/newbot`
- **Получить Chat ID:** `https://api.telegram.org/bot<TOKEN>/getUpdates`
- **Проверить бота:** `https://api.telegram.org/bot<TOKEN>/getMe`

### Важно
- Получатель должен нажать **Start** у бота
- Chat ID может быть отрицательным (для групп)
- Несколько получателей через запятую: `123,456,-1001234567890`

---

## Порядок действий при деплое

1. Изменить код
2. Проверить локально: `npm run dev`
3. Задеплоить воркер (если менялся): `cd worker && wrangler deploy`
4. Запушить в ветку `deploy`
5. GitHub Actions задеплоит на GitHub Pages
6. Проверить работу формы на сайте
