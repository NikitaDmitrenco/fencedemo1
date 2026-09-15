import { Container } from './Container';
import { Reveal } from './Reveal';
import { clsx } from '@/lib/clsx';

export type SectionTone = 'paper' | 'raised' | 'ink';

const TONES: Record<SectionTone, string> = {
  paper: 'bg-[var(--color-paper)] text-white',
  raised: 'bg-[var(--color-ink-raised)] text-white',
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
        'relative overflow-hidden py-(--spacing-section) lg:py-(--spacing-section-lg)',
        TONES[tone],
        className,
      )}
    >
      <Container>
        {(eyebrow || title || lead) && (
          <Reveal className="mb-12 grid gap-5 border-t border-[var(--color-steel-line)] pt-5 lg:mb-20 lg:grid-cols-12 lg:gap-8">
            {eyebrow && (
              <p
                className={clsx(
                  'technical-label lg:col-span-3',
                  isInk ? 'text-[var(--accent)]' : 'text-[var(--color-steel)]',
                )}
              >
                {'// '}
                {eyebrow}
              </p>
            )}
            <div className="lg:col-span-9">
              {title && <h2 className="h-section max-w-5xl text-balance">{title}</h2>}
              {lead && (
                <p
                  className={clsx(
                    'measure mt-8 text-base sm:text-lg',
                    isInk ? 'text-white/65' : 'text-[var(--color-ink-soft)]',
                  )}
                >
                  {lead}
                </p>
              )}
            </div>
          </Reveal>
        )}

        {children}
      </Container>
    </section>
  );
}
