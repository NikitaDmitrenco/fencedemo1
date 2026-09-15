import { clsx } from '@/lib/clsx';

const CONTROL = clsx(
  'w-full rounded-[var(--radius-control)] border border-[var(--color-steel-line)]',
  'bg-[var(--color-paper-raised)] px-4 py-3.5 text-base text-[var(--color-ink)]',
  'placeholder:text-[var(--color-ink-muted)]',
  'transition-colors duration-150 focus:border-[var(--accent)] focus:outline-none',
  // Шрифт не меньше 16 px: иначе Safari на iOS зумит страницу при фокусе.
  'text-[16px]',
);

/**
 * Обвязка поля: подпись, подсказка, ошибка.
 *
 * Идентификаторы подсказки и ошибки предсказуемы — `<id>-hint` и `<id>-error`,
 * — поэтому потребитель связывает их с контролом сам через aria-describedby.
 * Это честнее, чем прокидывать пропсы через клонирование children.
 */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required && (
          <span className="text-[var(--color-warn)]" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-[var(--color-ink-muted)]">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-sm font-medium text-[var(--color-warn)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={clsx(CONTROL, invalid && 'border-[var(--color-warn)]', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Textarea({
  className,
  invalid,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      className={clsx(
        CONTROL,
        'min-h-28 resize-y',
        invalid && 'border-[var(--color-warn)]',
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

/**
 * Чекбокс согласия на обработку ПД. По 152-ФЗ не может быть предустановленным.
 *
 * Собственная отрисовка вместо нативной: нативный чекбокс в невыбранном
 * состоянии заливается белым, и на тёмной секции это выглядит как дырка
 * в вёрстке. Рамка берёт currentColor, поэтому контрол одинаково уместен
 * и на светлом, и на тёмном фоне.
 */
export function Consent({
  id,
  checked,
  onChange,
  children,
}: {
  id: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 text-sm text-[var(--color-ink-soft)]"
    >
      <span className="relative mt-0.5 inline-flex size-5 shrink-0">
        <input
          id={id}
          type="checkbox"
          required
          checked={checked}
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          className={clsx(
            'peer size-5 cursor-pointer appearance-none rounded-[5px] border-2 border-current/35 bg-transparent',
            'transition-colors duration-150',
            'checked:border-[var(--accent)] checked:bg-[var(--accent)]',
          )}
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#14181B"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute inset-0 m-auto size-3.5 opacity-0 peer-checked:opacity-100"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>

      <span>{children}</span>
    </label>
  );
}
