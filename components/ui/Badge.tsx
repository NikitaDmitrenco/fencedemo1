import { clsx } from '@/lib/clsx';

export type BadgeTone = 'neutral' | 'accent';

/**
 * Служебная метка: источник отзыва, статус, короткий признак.
 * Прямоугольная и тихая — бейдж не должен соревноваться с ценой или CTA.
 */
const TONES: Record<BadgeTone, string> = {
  neutral: 'border-[var(--hairline-strong)] bg-transparent text-[var(--fg-2)]',
  accent: 'border-transparent bg-[var(--color-accent-soft)] text-[var(--accent)]',
};

export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        't-label inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border px-2.5 py-1.5',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
