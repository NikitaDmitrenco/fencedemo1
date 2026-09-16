import { clsx } from '@/lib/clsx';

/**
 * Общий вид контрола. Построен на переменных поверхности, поэтому одно и то
 * же поле корректно выглядит и в светлой секции, и в тёмной — без точечных
 * переопределений цвета на месте использования.
 */
const CONTROL = clsx(
  'w-full rounded-[var(--radius-control)] border border-[var(--hairline-strong)]',
  'bg-[var(--field-bg)] px-4 text-[var(--fg)]',
  'min-h-13 py-3',
  'placeholder:text-[var(--fg-3)]',
  'transition-colors duration-150 focus:border-[var(--fg)] focus:outline-none',
  // Шрифт не меньше 16 px: иначе Safari на iOS зумит страницу при фокусе.
  'text-[16px]',
);

/**
 * Обвязка поля: подпись, подсказка, ошибка.
 *
 * Идентификаторы подсказки и ошибки предсказуемы — `<id>-hint` и `<id>-error`,
 * — поэтому потребитель связывает их с контролом сам через aria-describedby.
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
      <label htmlFor={id} className="t-xs mb-2 block font-semibold text-[var(--fg)]">
        {label}
        {required && (
          <span className="text-[var(--fg-3)]" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p id={`${id}-hint`} className="t-xs mt-2 text-[var(--fg-3)]">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="t-xs mt-2 font-medium text-[var(--color-danger)]"
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
      className={clsx(CONTROL, invalid && 'border-[var(--color-danger)]', className)}
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
        invalid && 'border-[var(--color-danger)]',
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
 * в вёрстке.
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
    <label htmlFor={id} className="t-xs flex cursor-pointer items-start gap-3 text-[var(--fg-2)]">
      <span className="relative mt-px inline-flex size-5 shrink-0">
        <input
          id={id}
          type="checkbox"
          required
          checked={checked}
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          className={clsx(
            'peer size-5 cursor-pointer appearance-none rounded-[var(--radius-control)]',
            'border border-[var(--hairline-strong)] bg-[var(--field-bg)]',
            'transition-colors duration-150',
            'checked:border-[var(--accent)] checked:bg-[var(--accent)]',
          )}
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute inset-0 m-auto size-3 opacity-0 peer-checked:opacity-100"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>

      <span>{children}</span>
    </label>
  );
}
