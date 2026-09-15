import { clsx } from '@/lib/clsx';

export type BadgeTone = 'neutral' | 'accent' | 'ink';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-transparent text-[var(--color-ink-soft)] border-[var(--color-steel-line)]',
  accent: 'bg-[var(--accent)]/12 text-[var(--accent)] border-[var(--accent)]/35',
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
        'technical-label inline-flex items-center gap-1.5 rounded-none border px-2.5 py-1',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
