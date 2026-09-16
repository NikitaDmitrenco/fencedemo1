import { clsx } from '@/lib/clsx';

/**
 * Горизонтальные рамки страницы — единственный источник ширины контента.
 *
 * Максимум 1344 px и один набор боковых отступов на весь сайт: шапка, секции
 * и футер обязаны выравниваться по одной вертикальной оси, иначе страница
 * рассыпается на отдельно свёрстанные блоки.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx('mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10', className)}>
      {children}
    </div>
  );
}
