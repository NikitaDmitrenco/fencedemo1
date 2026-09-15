import { site } from '@/content/site.config';
import { Reveal, Section } from '@/components/ui';

/**
 * Блок 7. Снизить неопределённость процесса.
 *
 * На десктопе — горизонтальная линия, на мобильном вертикальный таймлайн:
 * шесть этапов в ряд на узком экране превратились бы в нечитаемую мелочь.
 * У каждого шага указана длительность — вопрос «сколько это займёт» люди
 * задают раньше, чем «сколько стоит».
 */
export function Process() {
  return (
    <Section
      tone="raised"
      eyebrow="Порядок работы"
      title="Как всё пройдёт"
      lead="Шесть шагов от первого звонка до приёмки. Ни на одном из них не появляется сюрпризов по цене — все допработы обсуждаются на замере."
    >
      <ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-5">
        {/* Линия связи между шагами: только на десктопе, где шаги в ряд. */}
        <div
          aria-hidden="true"
          className="absolute top-5 right-0 left-0 hidden h-px bg-[var(--color-steel-line)] lg:block"
        />

        {site.process.map((step, i) => (
          <Reveal key={step.title} delay={i * 60}>
            <li className="relative flex gap-4 lg:block">
              <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-steel-line)] bg-[var(--color-paper-raised)] font-bold">
                {i + 1}
              </span>

              {/* Вертикальная линия для мобильного таймлайна. */}
              {i < site.process.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-10 left-5 h-[calc(100%+2rem)] w-px bg-[var(--color-steel-line)] lg:hidden"
                />
              )}

              <div className="pb-2 lg:mt-4 lg:pb-0">
                <h3 className="font-bold">{step.title}</h3>
                <p className="mt-1 text-[0.9375rem] text-[var(--color-ink-soft)]">{step.text}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--accent-ink,var(--color-ink))]">
                  {step.duration}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
