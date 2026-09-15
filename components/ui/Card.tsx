import { clsx } from '@/lib/clsx';

/**
 * Базовая карточка: одна граница, один радиус, тень только в наведении.
 * «Обилие рамок, теней и визуального шума» — то, чего ТЗ велит избегать,
 * поэтому декоративные слои сюда не добавляются.
 */
export function Card({
  as: Tag = 'div',
  id,
  interactive = false,
  className,
  children,
}: {
  as?: 'div' | 'article';
  id?: string;
  /** Приподнимается при наведении — для карточек, по которым кликают. */
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={clsx(
        'rounded-[var(--radius-card)] border border-[var(--color-steel-line)] bg-[var(--color-paper-raised)]',
        interactive &&
          'transition-[transform,border-color,background-color] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-px hover:border-[var(--color-steel)] hover:bg-[#1b2326]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
