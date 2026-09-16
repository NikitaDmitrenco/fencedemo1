import { clsx } from '@/lib/clsx';

/**
 * Базовая карточка: одна поверхность, одна волосяная граница, один радиус.
 *
 * Тень появляется только у кликабельной карточки и только в наведении —
 * это единственная тень во всей системе. Статичная карточка держится
 * на границе и контрасте поверхности, а не на слоях свечения.
 */
export function Card({
  as: Tag = 'div',
  id,
  /** Приподнимается при наведении — для карточек, по которым кликают. */
  interactive = false,
  /** Приглушённая поверхность: для блоков-сносок внутри светлой секции. */
  quiet = false,
  className,
  children,
}: {
  as?: 'div' | 'article';
  id?: string;
  interactive?: boolean;
  quiet?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={clsx(
        'rounded-[var(--radius-surface)] border border-[var(--hairline)]',
        quiet ? 'bg-[var(--surface-bg-quiet)]' : 'bg-[var(--surface-bg)]',
        interactive &&
          'transition-[border-color,box-shadow] duration-200 ease-[var(--ease-out-soft)] hover:border-[var(--hairline-strong)] hover:shadow-[var(--shadow-lift)]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
