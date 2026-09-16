import { site } from '@/content/site.config';
import { Reveal, Section } from '@/components/ui';

/**
 * Блок 6. Объяснить разницу в цене между подрядчиками и снять подозрение,
 * что дешевле — это то же самое.
 *
 * Свёрстано как инженерная таблица, а не как инфографика: слева фактор,
 * справа три колонки одной последовательности «экономия → последствие →
 * как правильно». Колонки у всех факторов стоят на одной сетке — именно
 * повторяемость раскладки читается как компетентность.
 */
export function Durability() {
  return (
    <Section
      tone="canvas"
      title="Что влияет на срок службы"
      lead="Разница в цене между подрядчиками почти всегда объясняется этими пятью пунктами. Их стоит уточнять у всех, к кому вы обращаетесь — не только у нас."
    >
      <ul className="border-t border-[var(--hairline)]">
        {site.durability.map((factor, i) => (
          <Reveal
            key={factor.title}
            as="li"
            delay={i * 50}
            className="border-b border-[var(--hairline)]"
          >
            <div className="grid gap-6 py-8 lg:grid-cols-12 lg:gap-8 lg:py-12">
              <div className="lg:col-span-3">
                {/* Номер тихий: акцент в этом блоке зарезервирован за колонкой
                    «Как делаем мы», иначе он перестаёт что-либо означать. */}
                <span className="t-label text-[var(--fg-3)]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3 mt-3">{factor.title}</h3>
              </div>

              <dl className="grid gap-6 sm:grid-cols-3 lg:col-span-9 lg:gap-8">
                <div>
                  <dt className="t-label text-[var(--fg-3)]">Как экономят</dt>
                  <dd className="t-sm mt-3 text-[var(--fg-2)]">{factor.cheap}</dd>
                </div>

                <div>
                  {/* Красный — только на подписи и только здесь: в самом
                      тексте он превратил бы разбор в запугивание. */}
                  <dt className="t-label text-[var(--color-danger)]">Чем это кончается</dt>
                  <dd className="t-sm mt-3 text-[var(--fg-2)]">{factor.consequence}</dd>
                </div>

                <div>
                  <dt className="t-label text-[var(--accent-fg)]">Как делаем мы</dt>
                  <dd className="t-sm mt-3 font-medium text-[var(--fg)]">{factor.right}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
