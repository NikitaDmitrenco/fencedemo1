import { clsx } from '@/lib/clsx';

/**
 * Горизонтальные рамки страницы. Боковой отступ не меньше 20 px на любой
 * ширине — иначе текст липнет к краю экрана на телефоне.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx('mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}
