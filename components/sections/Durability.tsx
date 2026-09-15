import { site } from '@/content/site.config';
import { Card, Reveal, Section } from '@/components/ui';

/**
 * Блок 6. Увести сравнение от «у кого дешевле метр» к качеству исполнения.
 *
 * Каждый фактор подан как «как экономят → что из этого выйдет → как правильно».
 * Просто перечислить характеристики мало: посетитель не инженер и сам не
 * поймёт, почему толщина металла 0,35 мм — это проблема, а не экономия.
 */
export function Durability() {
  return (
    <Section
      eyebrow="Качество"
      title="Что влияет на срок службы"
      lead="Разница в цене между подрядчиками почти всегда объясняется этими пятью пунктами. Их стоит уточнять у всех, к кому вы обращаетесь — не только у нас."
    >
      <ul className="grid gap-5 lg:grid-cols-2">
        {site.durability.map((factor, i) => (
          <Reveal key={factor.title} delay={i * 50} className="h-full">
            <Card as="li" className="flex h-full list-none flex-col p-6">
              <h3 className="text-lg font-bold">{factor.title}</h3>

              <dl className="mt-4 space-y-3 text-[0.9375rem]">
                <div>
                  <dt className="text-xs font-bold tracking-wider text-[var(--color-ink-muted)] uppercase">
                    Как экономят
                  </dt>
                  <dd className="mt-1 text-[var(--color-ink-soft)]">{factor.cheap}</dd>
                </div>

                <div>
                  <dt className="text-xs font-bold tracking-wider text-[var(--color-warn)] uppercase">
                    Чем это кончается
                  </dt>
                  <dd className="mt-1 text-[var(--color-ink-soft)]">{factor.consequence}</dd>
                </div>

                <div className="border-t border-[var(--color-steel-line)] pt-3">
                  <dt className="text-xs font-bold tracking-wider text-[var(--color-ink)] uppercase">
                    Как делаем мы
                  </dt>
                  <dd className="mt-1 font-medium">{factor.right}</dd>
                </div>
              </dl>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
