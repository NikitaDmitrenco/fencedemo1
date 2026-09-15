import Link from 'next/link';
import type { Route } from 'next';
import { clsx } from '@/lib/clsx';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'md' | 'lg';

/**
 * Иерархия кнопок держит правило ТЗ «один доминирующий CTA»:
 * primary — только «Рассчитать стоимость», всё остальное вторично.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-[var(--color-accent-ink)] font-bold hover:bg-[var(--color-accent-strong)]',
  outline:
    'border border-[var(--color-steel-line)] bg-transparent text-white font-semibold hover:border-[var(--color-steel)]',
  ghost:
    'border border-white/35 bg-transparent text-white font-semibold hover:border-white hover:bg-white/8',
};

const SIZES: Record<ButtonSize, string> = {
  // Тап-таргет не меньше 48 px — требование доступности из ТЗ.
  md: 'min-h-12 px-5 text-[0.9375rem]',
  lg: 'min-h-14 px-7 text-base',
};

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  full = false,
): string {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)]',
    'transition-[transform,background-color,border-color,filter] duration-200 ease-[var(--ease-out-soft)]',
    'hover:-translate-y-px active:translate-y-0',
    'disabled:pointer-events-none disabled:opacity-55',
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
