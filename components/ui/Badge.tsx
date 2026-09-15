import { clsx } from '@/lib/clsx';

export type BadgeTone = 'neutral' | 'accent' | 'ink';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--color-paper)] text-[var(--color-ink-soft)] border-[var(--color-steel-line)]',
  accent: 'bg-[var(--accent)]/12 text-[var(--color-ink)] border-[var(--accent)]/35',
  ink: 'bg-[var(--color-ink)] text-white border-transparent',
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
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.75rem] font-semibold',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
