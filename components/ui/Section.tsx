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
  title,
  lead,
  aside,
  className,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  title?: string;
  lead?: string;
  /** Уточнение под лидом секции — не второй CTA. */
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const hasHeader = Boolean(title || lead);

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
                каталога: линия, затем заголовок у самого левого края. */}
            <div className="border-t border-[var(--hairline)] pt-5 lg:pt-6">
              <div className="grid gap-x-8 gap-y-5 lg:grid-cols-12">
                {title && <h2 className="t-h2 text-balance lg:col-span-5">{title}</h2>}

                {(lead || aside) && (
                  <div className={clsx('lg:col-span-6 lg:col-start-7', title && 'lg:mt-2')}>
                    {lead && <p className="t-lead measure">{lead}</p>}
                    {aside && <div className="mt-6">{aside}</div>}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {children}
      </Container>
    </section>
  );
}
