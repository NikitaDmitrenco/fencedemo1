import { Reveal, Section } from '@/components/ui';
import { Quiz } from '@/components/quiz/Quiz';

/**
 * Блок 2. Вовлечь посетителя в собственный проект и собрать лид.
 *
 * Главный конверсионный узел страницы: весь остальной контент ведёт сюда.
 * Пять коротких шагов вместо инженерного калькулятора — по ТЗ важнее, чтобы
 * человек дошёл до конца, чем чтобы цифра была точной.
 */
export function Calculator() {
  return (
    <Section
      id="calc"
      eyebrow="Первый шаг"
      title="Узнайте стоимость своего участка"
      lead="Пять коротких вопросов — покажем диапазон цены сразу, до того как спросим телефон. Занимает около минуты."
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
        <Reveal className="border-l border-[var(--accent)] pl-5 lg:col-span-3 lg:sticky lg:top-28">
          <p className="technical-label text-[var(--accent)]">01 / Estimate</p>
          <p className="mt-4 text-xl font-semibold leading-snug">
            Сначала диапазон. Детали — после замера.
          </p>
          <p className="mt-4 text-sm text-[var(--color-ink-soft)]">
            Расчёт остаётся предварительным: рельеф и грунт оцениваются на объекте.
          </p>
        </Reveal>
        <Reveal className="lg:col-span-8 lg:col-start-5">
          <Quiz />
        </Reveal>
      </div>
    </Section>
  );
}
