import Image from 'next/image';
import { clsx } from '@/lib/clsx';

/**
 * Вариант ответа — карточка, а не радиокнопка: по ТЗ квиз должен обходиться
 * без мелких чекбоксов, а на телефоне промах по кружку диаметром 20 px
 * стоит ответа. Вся карточка — одна цель нажатия.
 */
export function OptionCard({
  label,
  note,
  image,
  selected,
  onSelect,
}: {
  label: string;
  note?: string;
  image?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={clsx(
        'group flex min-h-14 w-full items-center gap-3 overflow-hidden rounded-[var(--radius-control)] border p-3 text-left',
        'transition-[border-color,background-color,transform] duration-150 ease-[var(--ease-out-soft)]',
        'hover:-translate-y-0.5',
        selected
          ? 'border-[var(--accent)] bg-[var(--accent)]/8'
          : 'border-[var(--color-steel-line)] bg-[var(--color-paper-raised)] hover:border-[var(--color-steel)]',
      )}
    >
      {image && (
        <span className="relative size-14 shrink-0 overflow-hidden rounded-[8px] bg-[var(--color-ink)]">
          <Image src={image} alt="" fill sizes="56px" className="object-cover" />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{label}</span>
        {note && <span className="mt-0.5 block text-sm text-[var(--color-ink-muted)]">{note}</span>}
      </span>

      <span
        aria-hidden="true"
        className={clsx(
          'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          selected
            ? 'border-[var(--accent)] bg-[var(--accent)]'
            : 'border-[var(--color-steel-line)]',
        )}
      >
        {selected && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#14181B"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </button>
  );
}
