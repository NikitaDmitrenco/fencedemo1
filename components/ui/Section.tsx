import { Container } from './Container';
import { Reveal } from './Reveal';
import { clsx } from '@/lib/clsx';

export type SectionTone = 'paper' | 'raised' | 'ink';

const TONES: Record<SectionTone, string> = {
  paper: 'bg-[var(--color-paper)] text-[var(--color-ink)]',
  raised: 'bg-[var(--color-paper-raised)] text-[var(--color-ink)]',
  // Тёмная секция — способ разбить длинную страницу без лишних рамок и теней.
  ink: 'bg-[var(--color-ink)] text-white',
};

/**
 * Секция лендинга: вертикальный ритм, заголовочный блок и появление при
 * скролле. Все блоки страницы собираются на ней, чтобы отступы и типографика
 * не расходились от секции к секции.
 */
export function Section({
  id,
  tone = 'paper',
  eyebrow,
  title,
  lead,
  className,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  eyebrow?: string;
  title?: string;
  lead?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const isInk = tone === 'ink';

  return (
    <section
      id={id}
      className={clsx(
        'py-(--spacing-section) lg:py-(--spacing-section-lg)',
        TONES[tone],
        className,
      )}
    >
      <Container>
        {(eyebrow || title || lead) && (
          <Reveal className="mb-10 lg:mb-14">
            {eyebrow && (
              <p
                className={clsx(
                  'text-[0.8125rem] font-bold tracking-[0.18em] uppercase',
                  isInk ? 'text-[var(--accent)]' : 'text-[var(--color-steel)]',
                )}
              >
                {eyebrow}
              </p>
            )}

            {title && <h2 className="h-section mt-3 text-balance">{title}</h2>}

            {lead && (
              <p
                className={clsx(
                  'measure mt-4 text-lg',
                  isInk ? 'text-white/70' : 'text-[var(--color-ink-soft)]',
                )}
              >
                {lead}
              </p>
            )}
          </Reveal>
        )}

        {children}
      </Container>
    </section>
  );
}
