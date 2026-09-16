import { clsx } from '@/lib/clsx';

/**
 * Аккордеон на <details>/<summary>: нативная семантика, работа с клавиатуры
 * и поиск по странице — без единой строки JavaScript.
 */
export function Accordion({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        'divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AccordionItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group">
      <summary
        className={clsx(
          'flex cursor-pointer list-none items-start justify-between gap-6 py-5',
          'text-left [&::-webkit-details-marker]:hidden',
        )}
      >
        <span className="t-h4">{question}</span>

        <span
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[var(--fg-3)] transition-transform duration-200 ease-[var(--ease-out-soft)] group-open:rotate-45"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M10 4v12M4 10h12" strokeLinecap="round" />
          </svg>
        </span>
      </summary>

      <p className="measure t-sm pb-6 text-[var(--fg-2)]">{answer}</p>
    </details>
  );
}
