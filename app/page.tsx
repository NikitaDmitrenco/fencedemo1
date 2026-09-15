import { site } from '@/content/site.config';

/**
 * Этап Э0: каркас проекта.
 *
 * Страница пока служебная — показывает, что сборка, токены и контентная модель
 * подключены и деплой работает. Секции из docs/PLAN.md §5 собираются на Э1–Э4
 * и подставляются сюда массивом, чтобы порядок блоков менялся перестановкой
 * строк, а не рефакторингом.
 */

const roadmap = [
  { stage: 'Э0', title: 'Каркас, токены, контентная модель, деплой', done: true },
  { stage: 'Э1', title: 'Дизайн-система: UI-kit, шапка, футер, sticky CTA', done: false },
  { stage: 'Э2', title: 'Блоки 1, 3, 4, 5 — hero, каталог, кейсы, цена', done: false },
  { stage: 'Э3', title: 'Квиз, расчёт диапазона, отправка заявок', done: false },
  {
    stage: 'Э4',
    title: 'Блоки 6–11 — качество, этапы, доверие, отзывы, FAQ, контакты',
    done: false,
  },
  { stage: 'Э5', title: 'Контент демо, фотографии, правовые страницы', done: false },
  { stage: 'Э6', title: 'Производительность, доступность, аналитика, QA', done: false },
  { stage: 'Э7', title: 'Домен, HTTPS, Метрика, продакшн', done: false },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-steel)] uppercase">
        Демо-сайт · ниша «Заборы и ворота»
      </p>

      <h1 className="h-display mt-5 text-balance">{site.hero.title}</h1>

      <p className="measure mt-5 text-lg text-[var(--color-ink-soft)]">{site.hero.subtitle}</p>

      <div className="mt-10 rounded-[var(--radius-card)] border border-[var(--color-steel-line)] bg-[var(--color-paper-raised)] p-6">
        <h2 className="text-base font-bold">Статус разработки</h2>

        <ol className="mt-4 space-y-2.5">
          {roadmap.map((step) => (
            <li key={step.stage} className="flex items-start gap-3 text-[0.9375rem]">
              <span
                aria-hidden="true"
                className="mt-2 size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: step.done ? 'var(--accent)' : 'var(--color-steel-line)',
                }}
              />
              <span className={step.done ? '' : 'text-[var(--color-ink-muted)]'}>
                <span className="font-semibold">{step.stage}.</span> {step.title}
                {step.done ? <span className="sr-only"> — выполнено</span> : null}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="measure mt-8 text-sm text-[var(--color-ink-muted)]">
        Каркас собран: Next.js, TypeScript, Tailwind, дизайн-токены и контентная модель подключены.
        План разработки — <code className="text-[var(--color-ink-soft)]">docs/PLAN.md</code>,
        техническое задание — <code className="text-[var(--color-ink-soft)]">docs/TZ.md</code>.
      </p>
    </main>
  );
}
