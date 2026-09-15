import { clsx } from '@/lib/clsx';

/**
 * Аккордеон на <details>/<summary>: нативная семантика, работа с клавиатуры
 * и поиск по странице — без единой строки JavaScript. Для блока FAQ, который
 * по ТЗ нужен на каждом сайте, это экономит бандл целиком.
 */
export function Accordion({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx('divide-y divide-[var(--color-steel-line)]', className)}>{children}</div>
  );
}

export function AccordionItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group py-1">
      <summary
        className={clsx(
          'flex cursor-pointer list-none items-start justify-between gap-4 py-4',
          'text-left font-semibold [&::-webkit-details-marker]:hidden',
        )}
      >
        <span className="text-[1.0625rem]">{question}</span>

        <span
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[var(--color-steel)] transition-transform duration-200 ease-[var(--ease-out-soft)] group-open:rotate-45"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M10 4v12M4 10h12" strokeLinecap="round" />
          </svg>
        </span>
      </summary>

      <p className="measure pb-4 text-[var(--color-ink-soft)]">{answer}</p>
    </details>
  );
}
