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
          'transition-[transform,border-color,box-shadow] duration-150 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-[var(--color-steel)] hover:shadow-[0_8px_24px_-12px_rgba(20,24,27,0.25)]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
