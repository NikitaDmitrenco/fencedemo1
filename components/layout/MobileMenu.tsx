'use client';

import { useEffect, useRef } from 'react';
import { site, formatPhone } from '@/content/site.config';
import { NAV_LINKS, CALC_ANCHOR } from '@/lib/nav';
import { clsx } from '@/lib/clsx';

/**
 * Меню для экранов, где ссылки разделов не помещаются в шапку.
 *
 * Кроме навигации отдаёт телефон и мессенджеры: по ТЗ они должны быть
 * доступны без поиска в футере, а на узком экране в шапку не влезают.
 * До появления этого меню на первом экране телефона не было вовсе.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // Фон не должен уезжать под открытым меню.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    // Фокус переносится в меню, иначе с клавиатуры человек остаётся
    // на странице под ним и «проваливается» сквозь открытую панель.
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const messengers = [
    site.company.whatsapp && {
      label: 'WhatsApp',
      href: `https://wa.me/${site.company.whatsapp.replace(/\D/g, '')}`,
    },
    site.company.telegram && {
      label: 'Telegram',
      href: `https://t.me/${site.company.telegram}`,
    },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <div
      // Выше плашки cookie и шапки: у них z-50, и без запаса баннер
      // перекрывал бы нижние пункты открытого меню.
      className={clsx(
        'fixed inset-0 z-60 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
      inert={!open || undefined}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Закрыть меню"
        onClick={onClose}
        className={clsx(
          'absolute inset-0 bg-[#0B0F12] transition-opacity duration-300 ease-[var(--ease-out-soft)]',
          open ? 'opacity-60' : 'opacity-0',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
        className={clsx(
          'absolute inset-x-0 top-0 bg-[var(--color-paper)] shadow-[0_18px_40px_-20px_rgba(11,15,18,0.6)]',
          'transition-transform duration-300 ease-[var(--ease-out-soft)]',
          open ? 'translate-y-0' : '-translate-y-full',
        )}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="flex h-16 items-center justify-between px-5 sm:px-6">
          <span className="text-base font-bold tracking-tight">{site.company.name}</span>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            className="-mr-2 flex size-11 items-center justify-center rounded-[var(--radius-control)]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="border-t border-[var(--color-steel-line)] px-5 pt-4 pb-7 sm:px-6">
          <nav aria-label="Разделы страницы">
            <ul className="divide-y divide-[var(--color-steel-line)]">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="flex min-h-14 items-center text-lg font-semibold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={CALC_ANCHOR}
            onClick={onClose}
            className="mt-5 flex min-h-14 w-full items-center justify-center rounded-[var(--radius-control)] bg-[var(--accent)] text-base font-bold text-[var(--color-accent-ink)]"
          >
            Рассчитать стоимость
          </a>

          <a
            href={`tel:${site.company.phone}`}
            className="mt-5 block text-2xl font-bold tracking-tight"
          >
            {formatPhone(site.company.phone)}
          </a>

          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{site.company.workHours}</p>

          {messengers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {messengers.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] border border-[var(--color-steel-line)] bg-[var(--color-paper-raised)] px-4 font-semibold"
                >
                  {m.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
