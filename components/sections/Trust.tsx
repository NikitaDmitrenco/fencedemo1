import Image from 'next/image';
import { site } from '@/content/site.config';
import { Reveal, Section } from '@/components/ui';
import type { Fact } from '@/content/types';

/**
 * Блок 8. Заменить абстрактные преимущества проверяемыми фактами.
 *
 * Цифры берутся из конфига, где непроверенное значение имеет тип '[X]'.
 * В демо все они и стоят как [X] — выдуманные «15 лет на рынке» на сайте
 * компании, работающей три года, клиент заметит не сразу, но заметит.
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
      tone="ink"
      eyebrow="О компании"
      title="Почему нам доверяют"
      lead="Всё, что можно проверить: цифры, производство, документы и человек, который отвечает за результат."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8">
            {facts.map((fact, i) => (
              // Обёртка Reveal сама выступает группирующим div: внутри <dl>
              // допустим ровно один уровень <div> вокруг пары <dt>/<dd>,
              // и лишний вложенный элемент делает разметку недопустимой.
              //
              // Порядок тоже обязателен — <dt> перед своим <dd>. Визуально
              // цифра сверху, и это задаётся направлением flex, а не
              // перестановкой элементов в разметке.
              <Reveal key={fact.label} delay={i * 60} className="flex flex-col-reverse">
                <dt className="mt-1.5 text-[0.9375rem] text-white/60">{fact.label}</dt>
                <dd className="text-5xl font-bold tracking-[-0.06em] text-white lg:text-7xl">
                  {factText(fact.value)}
                </dd>
              </Reveal>
            ))}
          </dl>

          <Reveal>
            <ul className="mt-10 space-y-3 border-t border-white/12 pt-8 text-[0.9375rem]">
              {trust.production && (
                <li className="flex gap-3">
                  <Check />
                  <span>
                    <span className="font-bold text-white">Собственное производство.</span>{' '}
                    <span className="text-white/65">
                      Каркас, ворота и калитку варим и красим сами, без посредников.
                    </span>
                  </span>
                </li>
              )}

              {trust.contract && (
                <li className="flex gap-3">
                  <Check />
                  <span>
                    <span className="font-bold text-white">Договор и фиксированная смета.</span>{' '}
                    <span className="text-white/65">
                      Стоимость закрепляется до начала работ и не растёт по ходу.
                    </span>
                  </span>
                </li>
              )}

              <li className="flex gap-3">
                <Check />
                <span>
                  <span className="font-bold text-white">Свои монтажники.</span>{' '}
                  <span className="text-white/65">
                    Работу выполняют наши бригады, а не случайный субподряд.
                  </span>
                </span>
              </li>
            </ul>
          </Reveal>
        </div>

        {trust.owner && (
          <Reveal delay={120}>
            <figure className="border-t border-white/20 pt-6 lg:pt-8">
              {trust.owner.photo ? (
                <div className="relative mb-6 aspect-4/5 w-full max-w-64 overflow-hidden">
                  <Image
                    src={trust.owner.photo}
                    alt={trust.owner.name}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                </div>
              ) : (
                // Заглушка честно называет себя: живое фото владельца —
                // один из самых сильных элементов на таком сайте, и его
                // отсутствие лучше обозначить, чем маскировать стоком.
                <div className="mb-6 flex aspect-4/5 w-full max-w-64 items-center justify-center border border-dashed border-white/25 p-6 text-center text-sm text-white/45">
                  Здесь будет фотография владельца или команды
                </div>
              )}

              <blockquote className="measure text-lg text-white/85">
                «{trust.owner.quote}»
              </blockquote>

              <figcaption className="mt-5 border-t border-white/12 pt-5">
                <span className="block font-bold text-white">{trust.owner.name}</span>
                <span className="text-sm text-white/55">{trust.owner.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

function Check() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
