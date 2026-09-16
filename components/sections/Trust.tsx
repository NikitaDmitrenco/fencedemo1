import Image from 'next/image';
import { site } from '@/content/site.config';
import { clsx } from '@/lib/clsx';
import { CheckIcon, Reveal, Section } from '@/components/ui';
import type { Fact } from '@/content/types';

/**
 * Блок 8. Заменить абстрактные преимущества проверяемыми фактами.
 *
 * Цифры берутся из конфига, где непроверенное значение имеет тип '[X]'.
 * В демо все они и стоят как [X] — выдуманные «15 лет на рынке» на сайте
 * компании, работающей три года, клиент заметит не сразу, но заметит.
 * Поэтому показатели свёрстаны как таблица характеристик, а не как крупные
 * рекламные числа: доказательство должно выглядеть спокойно.
 */

function factText(value: Fact): string {
  return value === '[X]' ? '[X]' : String(value);
}

export function Trust() {
  const { trust } = site;

  const facts = [
    { value: trust.years, label: 'лет на рынке' },
    { value: trust.objects, label: 'объектов сдано' },
    { value: trust.crews, label: 'монтажных бригад' },
    { value: trust.warrantyYears, label: 'лет гарантии' },
  ];

  return (
    <Section
      tone="canvas"
      eyebrow="О компании"
      title="Почему нам доверяют"
      lead="Всё, что можно проверить: цифры, производство, документы и человек, который отвечает за результат."
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          {/* Обе колонки начинаются одной волосяной линией на одной высоте —
              так таблица показателей и портрет стоят на общей сетке. */}
          <dl className="grid grid-cols-2 border-t border-[var(--hairline)]">
            {facts.map((fact, i) => (
              // Обёртка Reveal сама выступает группирующим div: внутри <dl>
              // допустим ровно один уровень <div> вокруг пары <dt>/<dd>,
              // и лишний вложенный элемент делает разметку недопустимой.
              //
              // Порядок тоже обязателен — <dt> перед своим <dd>. Визуально
              // цифра сверху, и это задаётся направлением flex, а не
              // перестановкой элементов в разметке.
              <Reveal
                key={fact.label}
                delay={i * 60}
                className={clsx(
                  // justify-end в column-reverse прижимает содержимое к верху:
                  // иначе растянутая по высоте ячейка пакует цифру вниз и
                  // числа в строке перестают стоять на одной базовой линии.
                  'flex flex-col-reverse justify-end border-b border-[var(--hairline)] py-6',
                  i % 2 === 1 ? 'border-l border-[var(--hairline)] pl-6' : 'pr-6',
                )}
              >
                <dt className="t-sm mt-3 text-[var(--fg-2)]">{fact.label}</dt>
                <dd className="t-metric">{factText(fact.value)}</dd>
              </Reveal>
            ))}
          </dl>

          <Reveal>
            <ul className="mt-8 space-y-4">
              {trust.production && (
                <li className="flex gap-3">
                  <span className="flex h-6 shrink-0 items-center text-[var(--accent-fg)]">
                    <CheckIcon />
                  </span>
                  <span className="t-sm">
                    <span className="font-bold">Собственное производство.</span>{' '}
                    <span className="text-[var(--fg-2)]">
                      Каркас, ворота и калитку варим и красим сами, без посредников.
                    </span>
                  </span>
                </li>
              )}

              {trust.contract && (
                <li className="flex gap-3">
                  <span className="flex h-6 shrink-0 items-center text-[var(--accent-fg)]">
                    <CheckIcon />
                  </span>
                  <span className="t-sm">
                    <span className="font-bold">Договор и фиксированная смета.</span>{' '}
                    <span className="text-[var(--fg-2)]">
                      Стоимость закрепляется до начала работ и не растёт по ходу.
                    </span>
                  </span>
                </li>
              )}

              <li className="flex gap-3">
                <span className="flex h-6 shrink-0 items-center text-[var(--accent-fg)]">
                  <CheckIcon />
                </span>
                <span className="t-sm">
                  <span className="font-bold">Свои монтажники.</span>{' '}
                  <span className="text-[var(--fg-2)]">
                    Работу выполняют наши бригады, а не случайный субподряд.
                  </span>
                </span>
              </li>
            </ul>
          </Reveal>
        </div>

        {trust.owner && (
          <Reveal delay={120} className="lg:col-span-5">
            <figure className="border-t border-[var(--hairline)] pt-6">
              {trust.owner.photo ? (
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-[var(--radius-surface)] bg-[var(--color-ink-raised)]">
                  <Image
                    src={trust.owner.photo}
                    alt={trust.owner.name}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                // Заглушка честно называет себя: живое фото владельца —
                // один из самых сильных элементов на таком сайте, и его
                // отсутствие лучше обозначить, чем маскировать стоком.
                <div className="flex aspect-4/5 w-full items-center justify-center rounded-[var(--radius-surface)] border border-dashed border-[var(--hairline-strong)] bg-[var(--surface-bg-quiet)] p-6">
                  <span className="t-sm measure-tight text-center text-[var(--fg-3)]">
                    Здесь будет фотография владельца или команды
                  </span>
                </div>
              )}

              <blockquote className="t-lead mt-6">«{trust.owner.quote}»</blockquote>

              <figcaption className="mt-6 border-t border-[var(--hairline)] pt-5">
                <span className="t-h4 block">{trust.owner.name}</span>
                <span className="t-sm mt-1 block text-[var(--fg-2)]">{trust.owner.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
