import { site } from '@/content/site.config';
import { Badge, Card, Reveal, Section } from '@/components/ui';

/**
 * Блок 9. Внешнее социальное доказательство.
 *
 * Каждый отзыв со ссылкой на оригинал — поле url обязательно по типу, отзыв
 * без проверяемого источника собрать невозможно. Развёрнутых отзывов немного,
 * и это осознанно: один содержательный текст убеждает сильнее двадцати
 * карточек «всё отлично, рекомендую».
 *
 * Аватар-заглушки с первой буквой имени здесь нет намеренно: буква не несёт
 * никакой информации, а залитый акцентом квадрат перетягивал на себя больше
 * внимания, чем сам текст отзыва — единственное, ради чего блок существует.
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
      tone="sunken"
      title="Что пишут заказчики"
      lead="Отзывы с карт — каждый со ссылкой на оригинал, который можно открыть и проверить."
    >
      <ul className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        {site.reviews.map((review, i) => (
          <Reveal key={review.url + review.author} as="li" delay={i * 60} className="h-full">
            <Card className="flex h-full flex-col p-6">
              <div className="flex items-baseline justify-between gap-4">
                <span className="t-h4">{review.author}</span>
                <span className="t-xs shrink-0 text-[var(--fg-2)]">{formatDate(review.date)}</span>
              </div>

              <blockquote className="t-body mt-4 flex-1 text-[var(--fg-2)]">
                {review.text}
              </blockquote>

              {/* Источник и ссылка идут одной тихой строкой под линией: это
                  служебная подпись к отзыву, а не призыв уйти с сайта. */}
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--hairline)] pt-4">
                <Badge>{SOURCE_LABELS[review.source]}</Badge>

                <a
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-label text-[var(--fg-2)] underline underline-offset-4 transition-colors hover:text-[var(--accent-fg)]"
                >
                  Открыть оригинал
                </a>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>

      {site.isDemo && (
        <p className="t-xs measure mt-8 text-[var(--fg-3)]">
          В демо тексты отзывов приведены как образец. В рабочей версии здесь стоят только настоящие
          отзывы с рабочими ссылками на карточку компании.
        </p>
      )}
    </Section>
  );
}
