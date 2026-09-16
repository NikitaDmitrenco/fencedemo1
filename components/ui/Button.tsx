import Link from 'next/link';
import type { Route } from 'next';
import { clsx } from '@/lib/clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet';
export type ButtonSize = 'md' | 'lg';

/**
 * Иерархия кнопок держит правило ТЗ «один доминирующий CTA»:
 * primary — только «Рассчитать стоимость», всё остальное вторично.
 *
 * Primary залит акцентом и потому одинаков на светлой и тёмной поверхности:
 * главный призыв не должен менять вид от секции к секции. Secondary и quiet
 * строятся на переменных поверхности и подстраиваются под фон сами.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]',
  secondary:
    'border border-[var(--hairline-strong)] bg-transparent text-[var(--fg)] hover:border-[var(--fg)]',
  quiet: 'bg-transparent text-[var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_8%,transparent)]',
};

const SIZES: Record<ButtonSize, string> = {
  // Тап-таргет не меньше 48 px — требование доступности из ТЗ.
  md: 't-sm min-h-12 px-5',
  lg: 't-body min-h-14 px-8',
};

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  full = false,
): string {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)]',
    'font-semibold whitespace-nowrap',
    // Меняются только цвета: сдвиг кнопки под курсором — декоративный тик,
    // который на плотной сетке читается как дрожание вёрстки.
    'transition-colors duration-200 ease-[var(--ease-out-soft)]',
    'disabled:pointer-events-none disabled:opacity-45',
    VARIANTS[variant],
    SIZES[size],
    full && 'w-full',
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
};

export function Button({ variant, size, full, className, ...props }: ButtonProps) {
  return <button className={clsx(buttonClass(variant, size, full), className)} {...props} />;
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Ссылка в виде кнопки. Внешние адреса и якоря отдаются обычным <a>,
 * внутренние маршруты — через next/link с предзагрузкой.
 */
export function ButtonLink({ href, variant, size, full, className, children }: ButtonLinkProps) {
  const classes = clsx(buttonClass(variant, size, full), className);
  const isInternalRoute = href.startsWith('/') && !href.startsWith('//');

  if (!isInternalRoute) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href as Route} className={classes}>
      {children}
    </Link>
  );
}
