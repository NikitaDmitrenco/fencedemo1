import { site } from '@/content/site.config';
import { Badge, Card, Reveal, Section } from '@/components/ui';

/**
 * Блок 9. Внешнее социальное доказательство.
 *
 * Каждый отзыв со ссылкой на оригинал — поле url обязательно по типу, отзыв
 * без проверяемого источника собрать невозможно. Развёрнутых отзывов немного,
 * и это осознанно: один содержательный текст убеждает сильнее двадцати
 * карточек «всё отлично, рекомендую».
 */

const SOURCE_LABELS = {
  yandex: 'Яндекс Карты',
  '2gis': '2ГИС',
} as const;

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
}

export function Reviews() {
  if (site.reviews.length === 0) return null;

  return (
    <Section
      eyebrow="Отзывы"
      title="Что пишут заказчики"
      lead="Отзывы с карт — каждый со ссылкой на оригинал, который можно открыть и проверить."
    >
      <ul className="grid gap-5 lg:grid-cols-3">
        {site.reviews.map((review, i) => (
          <Reveal key={review.url + review.author} delay={i * 60} className="h-full">
            <Card as="li" className="flex h-full list-none flex-col p-6">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-paper)] font-bold"
                >
                  {review.author.trim().charAt(0)}
                </span>

                <span>
                  <span className="block font-bold">{review.author}</span>
                  <span className="text-sm text-[var(--color-ink-muted)]">
                    {formatDate(review.date)}
                  </span>
                </span>
              </div>

              <blockquote className="mt-4 flex-1 text-[0.9375rem] text-[var(--color-ink-soft)]">
                {review.text}
              </blockquote>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--color-steel-line)] pt-4">
                <Badge>{SOURCE_LABELS[review.source]}</Badge>

                <a
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold underline underline-offset-4"
                >
                  Открыть оригинал
                </a>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>

      {site.isDemo && (
        <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
          В демо тексты отзывов приведены как образец. В рабочей версии здесь стоят только настоящие
          отзывы с рабочими ссылками на карточку компании.
        </p>
      )}
    </Section>
  );
}
