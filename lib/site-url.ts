/**
 * Канонический адрес сайта.
 *
 * Отдельный модуль, потому что адрес нужен в трёх местах (metadataBase, robots,
 * sitemap) и потому что наивное `process.env.X ?? fallback` ломает сборку:
 * переменная, заведённая в Vercel без значения, приходит пустой строкой, а она
 * не nullish — fallback не срабатывает, и `new URL('')` роняет build.
 *
 * Порядок источников подобран так, чтобы деплой работал вообще без настройки
 * переменных: Vercel сам отдаёт адрес проекта на этапе сборки.
 */

const PRODUCTION_FALLBACK = 'http://localhost:3000';

/** Пустая строка и пробелы — это «не задано», а не значение. */
function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Достраивает протокол: в Vercel-переменных адрес приходит без схемы. */
function withProtocol(host: string): string {
  return /^https?:\/\//i.test(host) ? host : `https://${host}`;
}

/**
 * Разбирает кандидата в адрес. Возвращает null, если значение непригодно, —
 * тогда берётся следующий источник, а не собирается мусорный URL: `new URL`
 * слишком терпима и из 'ht!tp://:::' сделает 'https://ht!tp//:::'.
 */
function parseCandidate(candidate: string): string | null {
  const normalized = withProtocol(candidate).replace(/\/+$/, '');

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  // Хост домена или localhost — без спецсимволов, которые URL пропускает.
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i.test(url.hostname)) {
    return null;
  }

  return url.toString().replace(/\/$/, '');
}

function resolveSiteUrl(): string {
  const candidates = [
    clean(process.env.NEXT_PUBLIC_SITE_URL),
    // Постоянный адрес продакшн-деплоя, выдаётся Vercel автоматически.
    clean(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    // Адрес конкретного деплоя — для превью-веток.
    clean(process.env.VERCEL_URL),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const parsed = parseCandidate(candidate);
    if (parsed) return parsed;
  }

  return PRODUCTION_FALLBACK;
}

export const siteUrl = resolveSiteUrl();
