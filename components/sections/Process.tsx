import { site } from '@/content/site.config';
import { clsx } from '@/lib/clsx';
import { Reveal, Section } from '@/components/ui';

/** Сколько шагов стоит в ряду на десктопе — от этого зависит, какому шагу
 *  рисовать отрезок оси вправо: последнему в строке он вёл бы в пустоту. */
const DESKTOP_COLUMNS = 3;

/**
 * Блок 7. Снизить неопределённость процесса.
 *
 * Шесть шагов в один ряд не помещаются по смыслу, а не по вёрстке: даже при
 * максимальной ширине контейнера на шаг остаётся ~190 px, описание рвётся на
 * строки по 25 символов и превращается в мелкий шум. Поэтому 3×2 на десктопе
 * и вертикальный таймлайн на телефоне — порядок всё равно читается по номерам
 * и по оси, а текст остаётся текстом.
 *
 * У каждого шага указана длительность — вопрос «сколько это займёт» люди
 * задают раньше, чем «сколько стоит». Но это параметр, а не обещание, поэтому
 * она набрана технической подписью, а не акцентной строкой.
 */
export function Process() {
  const steps = site.process;
  const lastIndex = steps.length - 1;

  return (
    <Section
      tone="sunken"
      eyebrow="Порядок работы"
      title="Как всё пройдёт"
      lead="Шесть шагов от первого звонка до приёмки. Ни на одном из них не появляется сюрпризов по цене — все допработы обсуждаются на замере."
    >
      <ol className="grid gap-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
        {steps.map((step, i) => {
          // Ось собирается из отрезков внутри шагов, а не одной линией поверх
          // сетки: при двух рядах общая линия прошла бы только по верхнему.
          const hasRowConnector = i !== lastIndex && (i + 1) % DESKTOP_COLUMNS !== 0;

          return (
            <Reveal key={step.title} as="li" delay={i * 60} className="relative">
              <div className="flex gap-4 lg:block">
                <span
                  className={clsx(
                    't-label flex size-10 shrink-0 items-center justify-center',
                    'border border-[var(--hairline)] bg-[var(--surface-bg)] text-[var(--accent-fg)]',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="lg:mt-5">
                  <h3 className="t-h4">{step.title}</h3>
                  <p className="t-sm mt-2 text-[var(--fg-2)]">{step.text}</p>
                  <p className="t-label mt-3 text-[var(--fg-2)]">{step.duration}</p>
                </div>
              </div>

              {/* Горизонтальный отрезок оси: от правой грани квадрата до левой
                  грани следующего — ровно по центру номеров (top-5 = половина
                  квадрата 40 px), с выносом на ширину колоночного зазора. */}
              {hasRowConnector && (
                <span
                  aria-hidden="true"
                  className="absolute top-5 left-10 hidden h-px -translate-y-1/2 -right-6 bg-[var(--hairline)] lg:block"
                />
              )}

              {/* Вертикальный отрезок мобильного таймлайна: от низа квадрата
                  до верха следующего — вынос вниз равен зазору сетки (gap-8),
                  поэтому линия не рвётся и не торчит под последним шагом. */}
              {i !== lastIndex && (
                <span
                  aria-hidden="true"
                  className="absolute top-10 -bottom-8 left-5 w-px -translate-x-1/2 bg-[var(--hairline)] lg:hidden"
                />
              )}
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
