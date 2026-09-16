import { Container } from './Container';
import { Reveal } from './Reveal';
import { clsx } from '@/lib/clsx';

export type SectionTone = 'canvas' | 'sunken' | 'ink';

/**
 * Секция лендинга: вертикальный ритм, шапка блока и поверхность.
 *
 * Тон секции объявляется атрибутом data-surface, а не набором классов на
 * каждом вложенном элементе: карточки, кнопки и формы внутри читают
 * переменные поверхности и сами подстраиваются под светлый или тёмный фон.
 *
 * Тёмные секции расставлены осознанно и редко — первый экран, блок цены и
 * финальный контакт. Они работают как архитектурные опоры страницы; если
 * тёмным сделать всё, тон перестаёт что-либо значить.
 */
export function Section({
  id,
  tone = 'canvas',
  eyebrow,
  title,
  lead,
  aside,
  className,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** Короткая строка у правого края шапки секции — уточнение, не второй CTA. */
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const hasHeader = Boolean(eyebrow || title || lead);

  return (
    <section
      id={id}
      data-surface={tone}
      className={clsx('py-(--spacing-section) lg:py-(--spacing-section-lg)', className)}
    >
      <Container>
        {hasHeader && (
          <Reveal className="mb-10 lg:mb-16">
            {/* Волосяная линия сверху — начало секции читается как разворот
                каталога: линия, рубрика, заголовок. */}
            <div className="border-t border-[var(--hairline)] pt-5 lg:pt-6">
              <div className="grid gap-x-8 gap-y-4 lg:grid-cols-12">
                {eyebrow && (
                  <p className="t-label text-[var(--accent-fg)] lg:col-span-3">{eyebrow}</p>
                )}

                <div className={clsx('lg:col-span-9', !eyebrow && 'lg:col-start-4')}>
                  {title && <h2 className="t-h2 max-w-[22ch] text-balance">{title}</h2>}
                  {lead && <p className="t-lead measure mt-5">{lead}</p>}
                  {aside && <div className="mt-6">{aside}</div>}
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {children}
      </Container>
    </section>
  );
}
