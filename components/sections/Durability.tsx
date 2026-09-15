import { site } from '@/content/site.config';
import { Reveal, Section } from '@/components/ui';

export function Durability() {
  return (
    <Section
      eyebrow="Качество"
      title="Что влияет на срок службы"
      lead="Разница в цене между подрядчиками почти всегда объясняется этими пятью пунктами. Их стоит уточнять у всех, к кому вы обращаетесь — не только у нас."
    >
      <ul className="border-y border-[var(--color-steel-line)]">
        {site.durability.map((factor, i) => (
          <Reveal
            key={factor.title}
            as="li"
            delay={i * 50}
            className="border-b border-[var(--color-steel-line)] last:border-0"
          >
            <div className="grid gap-5 py-7 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-3">
                <span className="technical-label text-[var(--accent)]">0{i + 1}</span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">{factor.title}</h3>
              </div>
              <dl className="grid gap-5 text-[0.9375rem] sm:grid-cols-3 lg:col-span-9">
                <div>
                  <dt className="technical-label text-[var(--color-ink-muted)]">Как экономят</dt>
                  <dd className="mt-2 text-[var(--color-ink-soft)]">{factor.cheap}</dd>
                </div>
                <div>
                  <dt className="technical-label text-[var(--color-warn)]">Чем это кончается</dt>
                  <dd className="mt-2 text-[var(--color-ink-soft)]">{factor.consequence}</dd>
                </div>
                <div>
                  <dt className="technical-label text-[var(--accent)]">Как делаем мы</dt>
                  <dd className="mt-2 font-medium text-white">{factor.right}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
